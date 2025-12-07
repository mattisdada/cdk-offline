import { serve } from "@hono/node-server";
import { app } from "./app.mjs";

console.log("Launch local.mts");

(async () => {
  serve(app, (info) => {
    console.log(`Listening on http://localhost:${info.port}`);
  });
})();
