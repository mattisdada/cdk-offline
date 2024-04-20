import { Context } from "hono";

export default function routeNestedHtml(c: Context) {
  return c.html(`<h1>Hello World</h1>`);
}
