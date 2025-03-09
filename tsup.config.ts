import { defineConfig } from "tsup";

export default defineConfig({
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
    options.assetNames = 'assets/[name]-[hash]';
  },
  loader: {
    '.css': 'copy',
  },
});