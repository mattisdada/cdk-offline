import type { BuildOptions } from "esbuild";

export const outputFile = "./build/bundle.js";
export const handlerEntryPoint = "./src/serve.mts";

export const esbuildOptions: Partial<BuildOptions> = {
  entryPoints: [handlerEntryPoint],
  minify: true,
  outfile: outputFile,
  bundle: true,
  loader: { ".ts": "ts" },
  platform: "node",
  target: "node22",
  sourcemap: true,
  format: "esm",
};
