import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Use webpack for Cesium compatibility
  webpack: (config, { isServer }) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      jsts$: path.resolve(__dirname, "node_modules/jsts/dist/jsts.min.js"),
    };

    if (!isServer) {
      // Point cesium to its pre-built bundle
      config.resolve.alias = {
        ...config.resolve.alias,
        cesium$: "cesium/Build/Cesium/index.cjs",
      };

      // Tell webpack NOT to parse Cesium's pre-built bundle
      // (it has internal require() calls that webpack can't resolve)
      config.module = config.module || {};
      config.module.noParse = config.module.noParse || [];
      if (Array.isArray(config.module.noParse)) {
        config.module.noParse.push(/cesium[\\/]Build[\\/]Cesium/);
      } else {
        config.module.noParse = [/cesium[\\/]Build[\\/]Cesium/];
      }
    }
    return config;
  },
};

export default nextConfig;
