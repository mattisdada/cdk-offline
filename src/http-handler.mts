import { Hono } from "hono/quick";
import { handle } from "hono/aws-lambda";
import { logger } from "hono/logger";
import { zValidator } from "@hono/zod-validator";
import routeJson from "./routes/json.mjs";
import routeNestedHtml from "./routes/nested/html.mjs";
import { exampleZodSchema, routeNestedZod } from "./routes/nested/zod.mjs";

const app = new Hono();
const isLocal = process.env.IS_LOCAL === "true";

// Middleware
app.use(logger());

console.log("Launch server.ts");

// Routes
app.get("/", (c) => c.redirect(`/json`));
app.get("/json", routeJson);
app.get("/nested/html", routeNestedHtml);
app.post("/nested/zod", zValidator("json", exampleZodSchema), routeNestedZod);
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
