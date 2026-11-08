// Deluxe Translate's /api/translate as a Vercel Function.
//
// Claude is reached through Vercel AI Gateway (Anthropic Messages API), paid
// with the Vercel account's AI Gateway credits, so no API key has to be kept:
// the project's own OIDC token is used. AI_GATEWAY_API_KEY works too, and
// ANTHROPIC_API_KEY calls Anthropic directly instead.
import Anthropic from "@anthropic-ai/sdk";
import { getVercelOidcToken } from "@vercel/oidc";
import { translate } from "../translate-core.mjs";

const GATEWAY = "https://ai-gateway.vercel.sh";

// First model the gateway accepts wins. TRANSLATE_MODEL forces one.
const GATEWAY_MODELS = [process.env.TRANSLATE_MODEL, "anthropic/claude-sonnet-5.5", "anthropic/claude-sonnet-5"].filter(Boolean);
const DIRECT_MODELS = [process.env.TRANSLATE_MODEL, "claude-sonnet-5-5"].filter(Boolean);

// 20 requests a minute per visitor, as on Netlify. Kept per function
// instance, which is enough to stop one page from hammering the model.
const WINDOW_MS = 60_000;
const WINDOW_LIMIT = 20;
const seen = new Map();
function tooMany(ip) {
  const now = Date.now();
  const entry = seen.get(ip);
  if (!entry || entry.until <= now) {
    seen.set(ip, { count: 1, until: now + WINDOW_MS });
    if (seen.size > 5000) for (const [k, v] of seen) if (v.until <= now) seen.delete(k);
    return false;
  }
  entry.count += 1;
  return entry.count > WINDOW_LIMIT;
}

async function makeClient() {
  if (process.env.ANTHROPIC_API_KEY) return { client: new Anthropic(), models: DIRECT_MODELS };
  let apiKey = process.env.AI_GATEWAY_API_KEY;
  if (!apiKey) {
    try {
      apiKey = await getVercelOidcToken();
    } catch {
      apiKey = "";
    }
  }
  if (!apiKey) return null;
  return { client: new Anthropic({ apiKey, baseURL: GATEWAY }), models: GATEWAY_MODELS };
}

export async function POST(req) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (tooMany(ip)) {
    return Response.json({ error: "Too many translations at once. Wait a minute and try again." }, { status: 429 });
  }
  const made = await makeClient();
  if (!made) {
    return Response.json({ error: "AI Gateway is not active for this site yet." }, { status: 503 });
  }
  return translate(req, made.client, made.models);
}
