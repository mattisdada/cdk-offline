import { zValidator } from "@hono/zod-validator";
import { logger } from "hono/logger";
import { Hono } from "hono/quick";
import routeJson from "./routes/json.mjs";
import routeNestedHtml from "./routes/nested/html.mjs";
import { exampleZodSchema, routeNestedZod } from "./routes/nested/zod.mjs";

export const app = new Hono();

// Middleware
app.use(logger());

// Routes
app.get("/", (c) => c.redirect(`/json`));
app.get("/json", routeJson);
app.get("/nested/html", routeNestedHtml);
app.post("/nested/zod", zValidator("json", exampleZodSchema), routeNestedZod);
app.get("/text", (c) => c.text(`Hello World`));
app.get("/error", (_c) => {
  throw new Error("Unhandled exception");
});
