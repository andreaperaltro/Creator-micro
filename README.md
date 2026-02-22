# Creator Micro Web Mapper

Simple static web app to design key assignments for a **Work Louder Creator Micro**
using **VIA/QMK-style keycodes**.

The interface lets you:

- assign each key to a keycode (`KC_A`, `KC_MUTE`, etc.)
- build shortcuts with modifiers (for example `LCTL(LSFT(KC_S))`)
- define macros and map keys to those macros
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

## How to use

1. Choose a layer.
2. Click a key in the layout grid.
3. In **Key Editor**, choose action type:
   - **Keycode**: enter a VIA/QMK keycode (`KC_A`, `KC_TAB`, ...)
   - **Shortcut**: select modifiers + base keycode
   - **Macro**: choose one of the macros from the macro panel
4. Add/edit macros in the **Macros** panel.
5. Export JSON when done.

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