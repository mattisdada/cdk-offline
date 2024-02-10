import serve from "@es-exec/esbuild-plugin-serve";
import { context } from "esbuild";

const outputFile = "./build/bundle.js";
const handlerEntryPoint = "./src/handler.ts";
async function watch() {
  let ctx = await context({
    entryPoints: [handlerEntryPoint],
    minify: false,
    outfile: outputFile,
    bundle: true,
    loader: { ".ts": "ts" },
    platform: "node",
    target: "node20",
    plugins: [serve({ main: outputFile, env: { IS_LOCAL: "true" } })],
  });
  await ctx.watch();
  console.log("Watching...");
}
watch();
