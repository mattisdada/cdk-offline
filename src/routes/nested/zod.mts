import type { Context } from "hono";
import { z } from "zod";

export const exampleZodSchema = z.object({
  name: z.string(),
  age: z.number(),
});

export function routeNestedZod(c: Context) {
  c.status(202);
  return c.json({ message: "Processed" });
}
