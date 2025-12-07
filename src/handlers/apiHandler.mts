import { handle } from "hono/aws-lambda";
import { app } from "../app.mts";

export const apiHandler = handle(app);
