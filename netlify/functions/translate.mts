import Anthropic from "@anthropic-ai/sdk";
import type { Config } from "@netlify/functions";
// The prompts and checks live in translate-core.mjs, shared with the Vercel Function.
// @ts-ignore - plain JavaScript module
import { translate } from "../../translate-core.mjs";

// First model that the gateway accepts wins. Set TRANSLATE_MODEL to force one.
const MODELS = [Netlify.env.get("TRANSLATE_MODEL"), "claude-sonnet-5-5", "claude-sonnet-4-5-20250929"].filter(
  (m): m is string => !!m,
);

export default async (req: Request) => {
  if (!Netlify.env.get("ANTHROPIC_BASE_URL")) {
    return Response.json({ error: "AI Gateway is not active for this site yet." }, { status: 503 });
  }
  const client = new Anthropic(); // credentials come from the AI Gateway
  return translate(req, client, MODELS);
};

export const config: Config = {
  path: "/api/translate",
  method: "POST",
  rateLimit: { action: "rate_limit", aggregateBy: ["ip", "domain"], windowSize: 60, windowLimit: 20 },
};
