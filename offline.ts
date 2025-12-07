import serve from "@es-exec/esbuild-plugin-serve";
import { context } from "esbuild";
import {
  esbuildOptions,
  localEntryPoint,
  outputFile,
} from "./esbuild.config.js";

(async () => {
  const ctx = await context({
    ...esbuildOptions,
    entryPoints: [localEntryPoint],
    plugins: [serve({ main: outputFile, env: { IS_LOCAL: "true" } })],
  });
  await ctx.watch();
  console.log("cdk-offline watching...");
})();
