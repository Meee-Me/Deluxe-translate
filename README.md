# Deluxe Translate

Translate typed text or photos of signs, menus, documents and handwriting between more than 100 languages.

## Features

- Text translation with automatic source-language detection, plus an "Other…" option for any language not on the list
- Photo translation: take a photo with the phone camera, choose an image, or drop/paste one. The page reads the text in the photo and shows the original beside the translation
- Copy, swap languages, reuse a translation as new input
- Recent text translations kept in the browser
- Light and dark themes, built for phone screens first
- Full-screen credits (directed by Shivad Sujith, AI support by Claude, powered by Netlify)
- "More by Deluxelord" screen linking to Deluxe Drive, Deluxe Docs, Deluxe Convert and YouTube Guider AI

## Deluxe Drive

**Connect Deluxe Drive** (next to Credits) links Translate to your Deluxe Drive, with the same steps as Deluxe
Docs and Deluxe Convert: in Deluxe Drive, account menu → **Connect Deluxe Translate** → **Generate link ID** →
**Open Deluxe Translate** (or type the code into Translate). After that every translation has **Save to Deluxe
Drive**, which saves the original text (or the text found in a photo) and the translation as a `.txt` file in a
**Deluxe Translate** folder in the drive. The key Translate gets can only add files: it cannot see or change the
rest of the drive. It lasts 30 days and is kept in this browser; **Disconnect** ends it.

## Files

- `public/index.html`: the whole front end in one file (HTML, CSS and JavaScript, no build step)
- `translate-core.mjs`: the translating itself (prompts, checks, model fallback), shared by both hosts
- `api/translate.mjs`: `/api/translate` on **Vercel** (the live site, https://deluxe-translate-app.vercel.app)
- `netlify/functions/translate.mts`: `/api/translate` on Netlify
- `vercel.json`, `netlify.toml`, `package.json`: host settings and function dependencies

## How translation works

**On Vercel** (the live site), `/api/translate` calls Claude through [Vercel AI Gateway](https://vercel.com/docs/ai-gateway)
with the project's own OIDC token, so no API key is stored anywhere and it uses the Vercel account's AI Gateway
credits. `AI_GATEWAY_API_KEY` works instead of OIDC, and `ANTHROPIC_API_KEY` calls Anthropic directly. It is limited
to 20 requests per minute per visitor. `TRANSLATE_MODEL` forces a model.

**On Netlify**:

On Netlify, the page sends text (or a downsized JPEG of the photo) to `/api/translate`. The function builds the translation prompt itself and calls Claude through [Netlify AI Gateway](https://docs.netlify.com/build/ai-gateway/overview/), so no API key is stored in the repo. The AI Gateway only starts working after the site has had one production deploy, and it uses your Netlify credits.

The function limits input to 5,000 characters or one photo, and is rate limited to 20 requests per minute per visitor. Adjust `windowLimit` in `translate.mts` if you need more or less.

The same `public/index.html` also works as a Claude Artifact, where it calls Claude directly through the artifact `sample` capability and does not use the function.

## Notes

Translations are written by an AI model and can contain mistakes. Check anything important, such as medical, legal or travel documents, with a qualified person.
