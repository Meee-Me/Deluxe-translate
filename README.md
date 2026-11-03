# Deluxe Translate

Translate typed text or photos of signs, menus, documents and handwriting between more than 100 languages.

## Features

- Text translation with automatic source-language detection, plus an "Other…" option for any language not on the list
- Photo translation: take a photo with the phone camera, choose an image, or drop/paste one. The page reads the text in the photo and shows the original beside the translation
- Copy, swap languages, reuse a translation as new input
- Recent text translations kept in the browser
- Light and dark themes, built for phone screens first
- Full-screen credits (directed by Shivad Sujith, AI support by Claude, powered by Netlify)
- "More by Deluxelord" screen linking to Deluxe Convert and YouTube Guider AI

## Files

- `public/index.html`: the whole front end in one file (HTML, CSS and JavaScript, no build step)
- `netlify/functions/translate.mts`: the `/api/translate` function that does the translating
- `netlify.toml`, `package.json`: Netlify configuration and function dependencies

## How translation works

On Netlify, the page sends text (or a downsized JPEG of the photo) to `/api/translate`. The function builds the translation prompt itself and calls Claude through [Netlify AI Gateway](https://docs.netlify.com/build/ai-gateway/overview/), so no API key is stored in the repo. The AI Gateway only starts working after the site has had one production deploy, and it uses your Netlify credits.

The function limits input to 5,000 characters or one photo, and is rate limited to 20 requests per minute per visitor. Adjust `windowLimit` in `translate.mts` if you need more or less.

The same `public/index.html` also works as a Claude Artifact, where it calls Claude directly through the artifact `sample` capability and does not use the function.

## Notes

Translations are written by an AI model and can contain mistakes. Check anything important, such as medical, legal or travel documents, with a qualified person.
