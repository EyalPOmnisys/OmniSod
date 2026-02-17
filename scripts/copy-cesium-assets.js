const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const cesiumBuildPath = path.join(projectRoot, "node_modules", "cesium", "Build", "Cesium");
const publicCesiumPath = path.join(projectRoot, "public", "cesium");

const folders = ["Workers", "ThirdParty", "Assets", "Widgets"];

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log("Copying Cesium assets to public/cesium...");

for (const folder of folders) {
  const src = path.join(cesiumBuildPath, folder);
  const dest = path.join(publicCesiumPath, folder);
  console.log(`  ${folder}...`);
  copyRecursive(src, dest);
}

console.log("Done!");
