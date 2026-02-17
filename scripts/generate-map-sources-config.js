/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");

function stripQuotes(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function countChar(str, ch) {
  let count = 0;
  for (let i = 0; i < str.length; i += 1) {
    if (str[i] === ch) count += 1;
  }
  return count;
}

function parseDotEnvWithMultiline(envText) {
  const env = {};
  const lines = envText.split(/\r?\n/);

  let pendingKey = null;
  let pendingValue = "";
  let bracketDepth = 0;

  for (const line of lines) {
    if (pendingKey) {
      pendingValue += `\n${line}`;
      bracketDepth += countChar(line, "[") - countChar(line, "]");
      if (bracketDepth <= 0) {
        env[pendingKey] = pendingValue.trim();
        pendingKey = null;
        pendingValue = "";
      }
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;

    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();

    if (value.startsWith("[")) {
      const depth = countChar(value, "[") - countChar(value, "]");
      if (depth > 0) {
        pendingKey = key;
        pendingValue = value;
        bracketDepth = depth;
        continue;
      }
    }

    env[key] = stripQuotes(value);
  }

  if (pendingKey) {
    throw new Error(`Unclosed JSON array value for key: ${pendingKey}`);
  }

  return env;
}

function required(env, key) {
  const value = env[key];
  if (value === undefined || value === null || String(value).trim() === "") {
    throw new Error(`Missing required .env key: ${key}`);
  }
  return String(value).trim();
}

function parseJsonArray(env, key) {
  const raw = required(env, key);
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error("Expected an array");
    }
    return parsed;
  } catch (error) {
    throw new Error(
      `Invalid JSON for ${key}. Must be a JSON array. ${error && error.message ? error.message : error}`
    );
  }
}

function buildMapSources(env) {
  const defaultBasemap = required(env, "DEFAULT_BASEMAP");
  const defaultTerrain = env.DEFAULT_TERRAIN ? String(env.DEFAULT_TERRAIN).trim() : undefined;
  const defaultMesh = env.DEFAULT_MESH ? String(env.DEFAULT_MESH).trim() : undefined;

  const basemapsRaw = parseJsonArray(env, "BASEMAPS");
  const terrainsRaw = env.TERRAINS ? parseJsonArray(env, "TERRAINS") : [];
  const meshesRaw = env.MESHES ? parseJsonArray(env, "MESHES") : [];

  const basemaps = basemapsRaw.map((entry) => {
    if (!entry || typeof entry !== "object") {
      throw new Error("BASEMAPS entries must be objects");
    }

    if (!entry.id || !entry.name || !entry.kind || !entry.url) {
      throw new Error("BASEMAPS entry missing one of: id, name, kind, url");
    }

    const iconUrl = entry.iconUrl || entry.icon;
    const tooltip = entry.tooltip;

    if (entry.kind === "WMS") {
      if (!entry.layers) {
        throw new Error(`BASEMAPS entry '${entry.id}' kind=WMS must include layers`);
      }

      return {
        id: entry.id,
        name: entry.name,
        tooltip,
        iconUrl,
        source: {
          kind: "WMS",
          url: entry.url,
          layers: entry.layers,
        },
      };
    }

    if (entry.kind === "WMTS") {
      const layer = entry.layer || entry.layers;
      if (!layer) {
        throw new Error(`BASEMAPS entry '${entry.id}' kind=WMTS must include layer`);
      }

      return {
        id: entry.id,
        name: entry.name,
        tooltip,
        iconUrl,
        source: {
          kind: "WMTS",
          url: entry.url,
          layer,
          tileMatrixSetID: entry.tileMatrixSetID,
          tileMatrixLabels: entry.tileMatrixLabels,
        },
      };
    }

    throw new Error(`Unsupported basemap kind '${entry.kind}' for id '${entry.id}'`);
  });

  const terrains = terrainsRaw.map((entry) => {
    if (!entry || typeof entry !== "object") {
      throw new Error("TERRAINS entries must be objects");
    }

    if (!entry.id || !entry.name || !entry.kind) {
      throw new Error("TERRAINS entry missing one of: id, name, kind");
    }

    const iconUrl = entry.iconUrl || entry.icon;
    const tooltip = entry.tooltip;

    if (entry.kind === "Ellipsoid") {
      return {
        id: entry.id,
        name: entry.name,
        tooltip,
        iconUrl,
        source: { kind: "Ellipsoid" },
      };
    }

    if (entry.kind === "CesiumTerrain") {
      if (!entry.url) {
        throw new Error(`TERRAINS entry '${entry.id}' kind=CesiumTerrain must include url`);
      }

      return {
        id: entry.id,
        name: entry.name,
        tooltip,
        iconUrl,
        source: {
          kind: "CesiumTerrain",
          url: entry.url,
        },
      };
    }

    throw new Error(`Unsupported terrain kind '${entry.kind}' for id '${entry.id}'`);
  });

  const meshes = meshesRaw.map((entry) => {
    if (!entry || typeof entry !== "object") {
      throw new Error("MESHES entries must be objects");
    }

    if (!entry.id || !entry.name || !entry.kind || !entry.url) {
      throw new Error("MESHES entry missing one of: id, name, kind, url");
    }

    if (entry.kind !== "3DTiles") {
      throw new Error(`Unsupported mesh kind '${entry.kind}' for id '${entry.id}'`);
    }

    const iconUrl = entry.iconUrl || entry.icon;
    const tooltip = entry.tooltip;

    return {
      id: entry.id,
      name: entry.name,
      tooltip,
      iconUrl,
      source: {
        kind: "3DTiles",
        url: entry.url,
      },
    };
  });

  if (!basemaps.some((item) => item.id === defaultBasemap)) {
    throw new Error(`DEFAULT_BASEMAP '${defaultBasemap}' must match one of BASEMAPS[].id`);
  }

  if (defaultTerrain && terrains.length > 0 && !terrains.some((item) => item.id === defaultTerrain)) {
    throw new Error(`DEFAULT_TERRAIN '${defaultTerrain}' must match one of TERRAINS[].id`);
  }

  if (defaultMesh && meshes.length > 0 && !meshes.some((item) => item.id === defaultMesh)) {
    throw new Error(`DEFAULT_MESH '${defaultMesh}' must match one of MESHES[].id`);
  }

  return {
    basemaps,
    terrains: terrains.length > 0 ? terrains : undefined,
    meshes: meshes.length > 0 ? meshes : undefined,
    defaults: {
      basemapId: defaultBasemap,
      terrainId: defaultTerrain || undefined,
      meshId: defaultMesh || undefined,
    },
  };
}

function run() {
  const projectRoot = path.join(__dirname, "..");
  const envPath = path.join(projectRoot, ".env");

  if (!fs.existsSync(envPath)) {
    throw new Error("Missing .env file in omnisod-mvp root.");
  }

  const envText = fs.readFileSync(envPath, "utf8");
  const env = parseDotEnvWithMultiline(envText);
  const mapSources = buildMapSources(env);

  const outPath = path.join(projectRoot, "src", "config", "mapSources.generated.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify({ mapSources }, null, 2) + "\n", "utf8");

  console.log(`Generated ${path.relative(projectRoot, outPath)} from .env`);
}

try {
  run();
} catch (error) {
  console.error(String(error && error.message ? error.message : error));
  process.exit(1);
}
