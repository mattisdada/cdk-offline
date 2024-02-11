import serve from "@es-exec/esbuild-plugin-serve";
import { context } from "esbuild";
import { esbuildOptions, outputFile } from "./esbuild.config";

async function watch() {
  let ctx = await context({
    ...esbuildOptions,
    plugins: [serve({ main: outputFile, env: { IS_LOCAL: "true" } })],
  });
  await ctx.watch();
  console.log("Watching...");
}
watch();
