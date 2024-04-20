import { Hono } from "hono/quick";
import { handle } from "hono/aws-lambda";
import { logger } from "hono/logger";
import routeJson from "./routes/json";
import routeNestedHtml from "./routes/nested/html";

const app = new Hono();
const isLocal = process.env.IS_LOCAL === "true";

// Middleware
app.use(logger());

console.log("Launch server.ts");

// Routes
app.get("/", (c) => c.redirect(`/json`));
app.get("/json", routeJson);
app.get("/nested/html", routeNestedHtml);
app.get("/text", (c) => c.text(`Hello World`));
app.get("/error", (c) => {
  throw new Error("Unhandled exception");
});

export const httpHandler = handle(app);

// Local
if (isLocal) {
  (async () => {
    // Dynamic import, so we can easily exclude the `@hono/node-server` from our bundle in prod
    const { serve } = await import("@hono/node-server");
    serve(app, (info) => {
      console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
    });
  })();
}
