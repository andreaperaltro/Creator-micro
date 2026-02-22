# Creator Micro Web Mapper

Simple static web app to design key assignments for a **Work Louder Creator Micro**
using **VIA/QMK-style keycodes**.

The interface lets you:

- assign each key with friendly names (Italian-oriented labels), without typing `KC_*`
- build shortcuts visually with modifiers (for example `Ctrl + Maiusc + S`)
- define macros with a visual step composer (key, shortcut, text, delay) plus quick presets
- map knob/encoder rotation (CCW/CW), including mouse wheel scroll up/down
- export/import your profile as JSON
- save/load your profile in browser local storage

## Quick start

No build step is required.

1. Open `index.html` directly in your browser
2. Or serve it locally:

   ```bash
   python3 -m http.server 8080
   ```

3. Browse to `http://localhost:8080`

## Deploy on Vercel

This repo is a static site, so Vercel should serve files directly from the repo root.

Recommended Vercel project settings:

- **Framework Preset**: `Other`
- **Root Directory**: `.`
- **Build Command**: *(empty)*
- **Output Directory**: *(empty)*
- **Install Command**: *(empty)*

Also ensure Vercel deploys the branch that contains the app (`index.html`, `app.js`, `styles.css`).
If your production branch is `main`, merge these changes into `main` first.

## How to use

1. Choose a layer.
2. Click a key in the layout grid.
3. In **Key Editor**, choose action type:
   - **Tasto singolo**: choose a key from readable labels
   - **Scorciatoia**: select modifiers + base key
   - **Macro**: choose one of the macros from the macro panel
4. Add/edit macros in the **Macros** panel with visual steps.
5. Configure **Knobs / Encoders** for CCW/CW actions (for example `Scroll su` / `Scroll giu`).
6. Export JSON when done.

## About VIA compatibility

VIA does not provide a fully standardized browser write API for every board, but
this app keeps the configuration in a VIA-friendly structure:

- keycodes are stored as QMK/VIA keycode strings
- shortcuts are rendered as wrapped keycodes
- macro mappings are exposed in `viaPreview.layers` as `QK_MACRO_n`

You can use the exported JSON as a profile source of truth and copy values into
VIA when needed.

## Project structure

- `index.html` - user interface
- `styles.css` - layout and styling
- `app.js` - state management, macro editor, import/export logic