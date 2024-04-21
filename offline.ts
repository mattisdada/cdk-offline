import serve from "@es-exec/esbuild-plugin-serve";
import { context } from "esbuild";
import { esbuildOptions, outputFile } from "./esbuild.config.js";

(async () => {
  let ctx = await context({
    ...esbuildOptions,
    // @ts-ignore - serve doesn't have proper TS in ESModule export (CJS is fine)
    plugins: [serve({ main: outputFile, env: { IS_LOCAL: "true" } })],
  });
  await ctx.watch();
  console.log("cdk-offline watching...");
})();
