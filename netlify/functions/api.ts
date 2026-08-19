import type { Handler } from "@netlify/functions";
import serverless from "serverless-http";
import { createApp } from "../../server/_core/app";

const app = createApp();

// The shared app deliberately has no listener or database initialization.
// Cast via unknown: serverless-http's return type doesn't structurally overlap
// with @netlify/functions Handler but they are wire-compatible at runtime.
export const handler = serverless(app) as unknown as Handler;

