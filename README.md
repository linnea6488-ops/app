# Motivation

Mobile web wallpaper editor, based on the supplied literary UI prototype.

## Run

From the repository root, use Python 3:

```sh
python3 -m http.server 8080 --bind 0.0.0.0
```

Open `index.html` through that server in your browser. No build or package install
is needed. Background images and Amiri fonts are served locally. Favorites and language are stored on this device, scoped to the browser origin.
Each new visit or return from the background shows fresh random inspiration
and artwork. Internal navigation retains your current edits.

The current implementation covers home and Image / Type / Ideas editing.
Settings navigation, local favorite restore/removal and feedback copying are available.
Eight interface languages are available with a persisted preference. Built-in
ideas follow the selected language; user-authored text stays unchanged. The demo
feedback address is explicitly fictitious; messages can be copied, not sent.
Demo 0.1 includes a factual privacy notice. Quote/source input is bounded by
actual fixed-size layout, including pasted text and IME composition. Live AI generation
and image export/share are not implemented.
Their controls do not report successful operations. Export ratio remains deferred.
The demo includes 12 AI-written original English quotes and 12 user-supplied dark
backgrounds plus nine AI-generated rich-color artworks. The quote copy is pre-generated built-in content; no live AI endpoint is called.

## Review and validation

Screenshots: [Home](docs/previews/home.png), [Image](docs/previews/image.png),
[Type](docs/previews/type.png), [Empty fields](docs/previews/empty-type.png),
[Ideas](docs/previews/ideas.png).

With the server running, the browser smoke check requires Python Playwright and
Chromium at `/usr/bin/chromium` (both available in the current cloud environment):

```sh
python3 tests/ui_smoke.py
python3 tests/settings_limits_smoke.py
python3 tests/fresh_home_smoke.py
python3 tests/ideas_layout_smoke.py
python3 tests/mobile_layout_smoke.py
```

This checks actual browser rendering, responsive overflow, editing, local state,
favorites, category filtering, dragging, keyboard behavior and failure feedback.
Screenshots from a fresh run are written to `/tmp/motivation-review/`. Real iOS
Safari and software-keyboard behavior still require device validation.

## Project references

- [Design specification](docs/DESIGN_SYSTEM.md)
- [Project continuation record](docs/PROJECT_STATUS.md)
- [Project design Skill](.agents/skills/motivation-design/SKILL.md)
- [Untouched supplied prototype](prototypes/motivation-original.html)
- [Asset provenance and font license](assets/README.md)

New or uncertain design rules require user confirmation before adoption.

## Phone demo hosting

This static site is ready for GitHub Pages. In repository Settings → Pages,
choose Deploy from a branch, branch `main`, folder `/(root)`, then Save.
Wait for GitHub to finish deployment and use the URL displayed by Pages.
The environment cannot enable Pages through the GitHub API because that
endpoint currently returns Forbidden. The presence of source files is not proof
that the site has been published. Save and Share are intentionally not enabled
in this clickable demo.

Build the optional portable review file with `python3 scripts/build_preview.py`.
The generated HTML is ignored by Git to avoid duplicating the artwork.

## Add to an iPhone home screen

Open the published HTTPS site in Safari, then choose Share → Add to Home Screen.
Keep the name Motivation and enable Open as Web App if that option is shown.
The website includes the supplied black-and-white home icon, an Apple touch icon,
and a manifest with standalone launch configuration under the `/app/` project path.
Installation on a real iPhone still requires manual verification. No offline
service worker is included.
