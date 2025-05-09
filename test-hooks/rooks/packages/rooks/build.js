#!/usr/bin/env node

const esbuild = require("esbuild");
const { dtsPlugin } = require("esbuild-plugin-d.ts");
const fs = require("fs");
const path = require("path");

const pkg = require("./package.json");

// External packages that should not be bundled
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

// Create dist directory if it doesn't exist
if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist");
}

// ESM Build
esbuild
  .build({
    entryPoints: ["src/index.ts"],
    outdir: "dist/esm",
    bundle: true,
    splitting: true,
    format: "esm",
    platform: "neutral",
    external,
    sourcemap: false,
    minify: false,
    outExtension: { ".js": ".js" },
    plugins: [
      dtsPlugin({
        outDir: "dist/types",
      }),
    ],
  })
  .catch(() => process.exit(1));

// CJS Build
esbuild
  .build({
    entryPoints: ["src/index.ts"],
    outdir: "dist/cjs",
    bundle: true,
    format: "cjs",
    platform: "neutral",
    external,
    sourcemap: false,
    minify: false,
  })
  .catch(() => process.exit(1));

// UMD Build - using IIFE with UMD wrapper
const umdBannerContent = `/*
* Rooks v${pkg.version}
* https://github.com/imbhargav5/rooks
* (c) ${new Date().getFullYear()} Bhargav Ponnapalli
* Released under the MIT License
*/
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('react-dom')) :
  typeof define === 'function' && define.amd ? define(['react', 'react-dom'], factory) :
  (global = global || self, global.rooks = factory(global.React, global.ReactDOM));
}(this, function(React, ReactDOM) {`;

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    outfile: "dist/umd/rooks.umd.js",
    bundle: true,
    format: "iife",
    globalName: "rooks",
    platform: "browser",
    external: ["react", "react-dom"],
    sourcemap: false,
    minify: true,
    define: {
      __VERSION__: `"${pkg.version}"`,
    },
    banner: {
      js: umdBannerContent,
    },
    footer: {
      js: "return rooks; }));",
    },
  })
  .catch(() => process.exit(1));

console.log("Build completed successfully!");
