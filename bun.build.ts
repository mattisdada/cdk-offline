await Bun.build({
  entrypoints: ["./src/app.mts"],
  outdir: "./build",
  target: "node",
});
