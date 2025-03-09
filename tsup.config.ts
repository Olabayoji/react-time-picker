import { defineConfig } from "tsup";

export default defineConfig({
  tsconfig: "tsconfig.build.json", 
  format: ["cjs", "esm"],
  entry: ["./src/index.ts"],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  clean: true,
  outDir: "dist",
  external: ["react", "react-dom"],
  injectStyle: false,
  esbuildOptions(options) {
    options.jsx = 'automatic';
    options.assetNames = 'assets/[name]-[hash]';
  },
  loader: {
    '.css': 'copy',
  },
});
