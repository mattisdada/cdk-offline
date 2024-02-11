import { Hono } from "hono/quick";
import { serve } from "@hono/node-server";
import { handle } from "hono/aws-lambda";
import { logger } from "hono/logger";

const app = new Hono();
app.use(logger());

console.log("Launch server.ts");

app.get("/", (c) => c.redirect(`/json`));
app.get("/json", (c) => c.json({ test: "Hello world" }));
app.get("/html", (c) => c.html(`<h1>Hello World</h1>`));
app.get("/text", (c) => c.text(`Hello World`));
app.get("/error", (c) => {
  throw new Error("Unhandled exception");
});

const isLocal = process.env.IS_LOCAL === "true";

if (isLocal) {
  serve(app, (info) => {
    console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
  });
}
export const httpHandler = handle(app);
