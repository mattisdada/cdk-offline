import { app } from "./http-handler.mjs";

const isLocal = process.env.IS_LOCAL === "true";

console.log("Launch serve.mts");

// Local
if (isLocal) {
  (async () => {
    // Dynamic import, so we can easily exclude the `@hono/node-server` from our bundle in prod
    // if using ECS, you can just import this normally

    const { serve } = await import("@hono/node-server");
    serve(app, (info) => {
      console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
    });
  })();
}
