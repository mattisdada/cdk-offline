import type { Context } from "hono";

export default function routeJson(c: Context) {
  return c.json({ test: "Hello world" });
}
