# Deluxe Translate

Translate typed text or photos of signs, menus, documents and handwriting between more than 100 languages.

## Features

- Text translation with automatic source-language detection, plus an "Other…" option for any language not on the list
- Photo translation: take a photo with the phone camera, choose an image, or drop/paste one. The page reads the text in the photo and shows the original beside the translation
- Copy, swap languages, reuse a translation as new input
- Recent text translations kept in the browser (nothing is sent to any server of ours)
- Light and dark themes, built for phone screens first
- Credits screen (directed by Shivad Sujith, AI support by Claude, powered by Netlify)
- "More by Deluxelord" screen linking to Deluxe Convert and YouTube Guider AI

## Files

- `index.html`: the whole app in one file (HTML, CSS and JavaScript, no build step)

## How translation works

The page calls Claude through the `sample` runtime capability that Claude Artifacts provide (`claude.use("sample")` with `images: true` for photos). Translations run on the viewer's own Claude usage, and the first call asks for permission.

Because of that, the app works when published as a Claude Artifact (declare `capabilities: {"sample": {"images": true}}`). Opened as a plain static page, for example on GitHub Pages, it loads but shows a notice that translation needs Claude access, since `window.claude` does not exist there.

To host it outside Claude, replace the `sample(...)` calls in `index.html` with calls to your own backend that forwards the prompt (and image) to a translation model. Keep any API key on the server, never in the page.

## Notes

Translations are written by an AI model and can contain mistakes. Check anything important, such as medical, legal or travel documents, with a qualified person.
