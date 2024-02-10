import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { handle } from "hono/aws-lambda";

const app = new Hono();

console.log("Launch server.ts");

app.get("/", (c) => c.json({ test: "Hello world" }));

const isLocal = process.env.IS_LOCAL === "true";

if (isLocal) {
  serve(app, (info) => {
    console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
  });
}
export const handler = handle(app);
