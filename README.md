# Creative Developments

A minimal placeholder website (black background, white text) meant to be the default landing page for any domain that doesn't yet have its own project deployed.

## Files

- `index.html` — page markup
- `style.css` — styling
- `script.js` — sets the current year in the footer

## Usage

Point any unused domain's DNS at wherever this is hosted (e.g. Vercel, Netlify, GitHub Pages, or a simple static host). No build step required — it's plain HTML/CSS/JS.

### Quick local preview

```bash
open index.html
```

or serve it locally:

```bash
python3 -m http.server 8000
```

then visit `http://localhost:8000`.
