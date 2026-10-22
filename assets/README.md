# Assets

## Supplied dark backgrounds

The 12 `provided-night-*` files are decoded without image modification from the
user-supplied `motivation_ios_ui_interactive_prototype_390_844 (1).html`, archived
as `prototypes/motivation-dark-backgrounds.html`. Active demo backgrounds use
these files, not the three separately generated images. Source attribution and
licensing information were not included in the upload.

The generated originals remain in the cloud workspace’s generated_images folder.
The first supplied prototype is also unchanged.

## Font

Amiri Latin files are from `@fontsource/amiri` 5.2.8, obtained through npm with
normal integrity/TLS verification. The SIL Open Font License is in fonts/LICENSE.txt.
The demo does not request Google Fonts at runtime.

## User-supplied SVG icons

Files are byte-for-byte copies of the uploads, without cropping or recoloring:
- icons/typography.svg ← Group 22.svg (39×39)
- icons/inspiration.svg ← Group 29.svg (42×42)
- icons/toast-info.svg ← Group 24.svg (28×28)
- icons/toast-success.svg ← Group 24 (1).svg (28×28)

## Home-screen icon

`icons/app-icon.svg` is an unchanged byte-for-byte copy of the uploaded 编组.svg
(512×512 black canvas). The 180px Apple touch icon and 192/512px manifest PNGs
are browser rasterizations of that complete canvas, without recropping, recoloring
or added rounded corners. iOS applies its own icon mask. Rebuild with
`python3 scripts/render_app_icons.py` in the prepared development environment.

## Nine additional rich-color backgrounds

`rich-*.jpg` are nine AI-generated artworks made for this app on 2026-10-22.
Each is 1024×1536 with a different dark palette/composition. See
`generated-backgrounds.json` for titles and original generation filenames.
Original PNGs are retained in the workspace’s generated_images directory. The
served JPEGs are same-size browser encodings (quality 85), without cropping,
recoloring or content changes. The nine served files total about 1.8 MB.
`prepare_backgrounds.py` accepts a JSON array of {name, path} original PNG sources.

- `icons/favorites-empty.png`: user-uploaded `m_ic_pop_favorites.png.zip` illustration, preserved unchanged (480×453), exclusively for the Favorites empty state.
