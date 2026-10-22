# Motivation · Design & Component Specification

Status: specification v0.1. Extracted from the supplied 390 × 844 prototype; additions below are implementation requirements, not claims of completed features. Product UI and all example copy default to English.

## Direction

Preserve the warm ivory surfaces, literary serif headings, thin borders, compact 4 px corners, restrained monochrome controls, and generous negative space. The application shell stays light. Wallpaper artwork should move toward dark, artistic, solitary, literary, atmospheric imagery. Do not turn the entire interface into a dark theme or replace the existing visual language.

This phase specifies existing components only. Menu destinations and other pages come later.

## Foundations

| Token | Value | Usage |
| --- | --- | --- |
| surface/page | #F5EFE9 | App and sheet background |
| surface/input | rgba(255,255,255,.5) | Text fields and selected idea cards |
| surface/category | #F7F1EA | Unselected category chips |
| ink/primary | #1A1918 | Main text, primary buttons, selected borders |
| ink/secondary | #625F5D | Secondary text |
| ink/quote-input | #C4BFBA | User-specified quote placeholder and entered text color |
| border/default | #E6E0DA | Dividers and component boundaries |
| border/focus | #625F5D | Proposed visible keyboard focus outline |
| handle | #C4BFBA | Sheet grabber |
| artwork/ink | #F5EFE9 | Proposed quote color over dark images |
| artwork/source | #E6E0DA | Proposed attribution color over dark images |
| feedback/error | #9C3B32 | Proposed inline error text |
| radius/component | 4 px | Buttons, inputs, thumbnails and cards |
| radius/circle | 50% | Bookmark and share buttons |
| space/base | 4 px | Spacing scale: 4, 8, 12, 16, 24, 32 |
| gutter | 24 px | Main content inset at reference width |
| sheet/shadow | 0 0 40px rgba(128,64,0,.10) | Sheet elevation |

The original 10 px grid gaps and 18 px section gaps may remain where necessary to preserve the composition. Avoid arbitrary new spacing values. Decorative borders need not carry state alone; selection and focus must remain identifiable.

### Typography

| Role | Family | Size / line height | Weight/style |
| --- | --- | --- | --- |
| Brand | Amiri | 32 / 32 px | 700 |
| Wallpaper quote | Amiri | 28 / 42 px at reference preview | 700 |
| Wallpaper source | Amiri | 16 / 20 px | italic 400; 20 px line height is a proposed correction to prevent clipping |
| Entry / field labels | Amiri | 16 / 20 px | 700; use natural line boxes |
| Editor tabs | Amiri | 18 / 24 px | 700 |
| Idea quote | Amiri | 16 / 24 px | 400 |
| Idea source | Amiri | 12 / 18 px | italic 400 |
| Form value | System sans | 16 / 24 px | 400 |
| Chip | System sans | 14 / 20 px | 400 |
| Primary action | System sans | 18 / 24 px | 700 |
| Helper / feedback | System sans | 13 / 20 px | 400 / 500 |

Use Amiri with Georgia and Times New Roman fallbacks; system sans uses Apple system, BlinkMacSystemFont, Helvetica Neue, sans-serif. Load a verified font before exporting images. No added font chooser in this version.

## Responsive composition

Reference: 390 × 844. Home preview is 342 × 486 at x24/y112; entry cards are approximately 107 × 103 with 10–11 px gaps; Save is 342 × 56. These are reference measurements, not absolute viewport coordinates for production.

Use fluid width with 24 px side gutters, three equal entry columns, and a fixed preview aspect ratio of 342:486 for the current composition. At narrow widths, reduce gutters to 16 px before shrinking tap targets. Allow vertical scrolling on short screens. Support 320, 375, 390 and 430 px widths without horizontal overflow. Use real browser safe-area insets and dynamic viewport height. Fake iOS status bars, home indicators and external Chinese demo controls belong only to the archived prototype.

The mini preview must render the same composition, typography and crop at approximately .432 scale (147.78 × 210). Use a shared renderer/model for home preview, mini preview, favorites and export. Do not independently position attribution at a fixed y-coordinate: place it below the actual quote with a consistent gap to prevent overlap with longer copy.

## Components

| Component | Anatomy and dimensions | Required states and behavior |
| --- | --- | --- |
| Brand/header | Serif wordmark, trailing menu icon | Preserve the supplied trailing menu location. Visible icon may be 28 px, interactive target at least 44 × 44 px. Brand returns home. Menu label: “Open menu”. |
| Wallpaper preview | Image crop, quote, optional attribution | Same current design everywhere. Dark artwork uses light text and a subtle scrim where needed. Text must not overlap actions or crop outside export bounds. Empty quote shows artwork only; never export placeholder text. |
| Circular action | 44 × 44 px, ivory fill, 28 px icon box | Default, pressed, focus, selected (bookmark), busy (share). Accessible labels “Add to favorites” / “Remove from favorites”, “Share wallpaper”. Toggle updates persistent full-wallpaper snapshot. |
| Feature entry | Three equal bordered tiles, icon/thumbnail, serif label | “Background”, “Typography”, “Inspiration”. Default, pressed, focus. Background thumbnail follows selection. Each opens corresponding sheet tab. |
| Primary button | Full content width, 56 px height, 4 px radius | “Save”; busy “Exporting…”; error with retry. Disable duplicate exports during processing. Successful export must precede success feedback. |
| Editor sheet | Ivory surface, grabber, tab header, scrolling body | Standard and expanded positions; Standard height remains 59% of viewport; expanded top is 20 px plus actual safe-area inset after removing the simulated 54 px iOS status area. Adaptive positions must leave an operable close path. Header stays fixed while content scrolls. |
| Sheet grabber | 46 × 4 px visible line | At least 44 px high target, click and keyboard toggle as drag alternative. Accessible label “Expand editor” / “Collapse editor”. |
| Editor tabs | Image / Type / Ideas; 48 px header; 48 × 4 px indicator | One selected tab; selection indicated by underline and aria-selected. Each full tab hit area at least 44 px high. Switching tabs preserves edits and sheet height. |
| Background thumbnail | Three columns, 10 px gap, 107:190 reference ratio | Loading, ready, selected, failed. Selected has stable inset outline plus small check indicator so dark artwork cannot conceal state. Failure offers retry. Decorative artwork descriptions supplied as accessible names. No upload control. |
| Text field | Label, bordered ivory-white surface, 16 px value, 18 px horizontal inset | Empty/placeholder, filled, focus, invalid. Quote minimum height 116 px; Source 68 px. Fields can grow or scroll without clipping. Quote placeholder and entered quote text both use #C4BFBA per explicit user instruction; source values retain primary ink. Labels remain visible. |
| Alignment segmented control | 56 px height, three equal segments, selected inset surface | Left / Center / Right labels for assistive technology; selected state via aria-pressed or radio semantics. Changes update preview and local draft immediately. |
| Category chip | 36 px visual height, 4 px radius, horizontal strip | Recommended / Philosophy / Motivation / Love / Family. 44 px interaction height, visible selected fill, focus. Real filtering; selection is not merely decorative. Preserve scroll position sensibly. |
| Inspiration card | Two columns, 10 px gap, 18 px internal padding | Natural content height, quote, divider, source. Default, selected, focus. Never duplicate text to fill space. Selection changes quote and attribution only; background and alignment remain unchanged. |
| Toast | Dark translucent surface, light 13 px text, bottom safe-area offset | Short nonblocking status, roughly 2–3 seconds, polite live region. Errors requiring action stay visible inline with retry. Never use a success toast as a substitute for performing an operation. |

### Type panel copy

| Element | English copy |
| --- | --- |
| Quote label | Quote |
| Empty quote placeholder | Please enter what you want to describe. |
| Source label | Source |
| Empty source placeholder | Add an author or source (optional) |
| Alignment label | Alignment |
| Export failure | Couldn’t export your wallpaper. Try again. |
| Favorites feedback | Added to favorites / Removed from favorites |
| Export feedback | Wallpaper downloaded |
| Share fallback | Sharing isn’t available here. Download your wallpaper instead. |
| Persistence failure | Your changes couldn’t be saved on this device. |

Placeholders appear only for empty fields. Existing quote text remains editable in the user-specified #C4BFBA; do not show a placeholder as real input or erase the current design just to reveal instructions. Do not block saving on an empty optional source.

### Sheet interaction contract

Drag the handle/header using pointer capture, distinguish taps from drags, and snap to standard or expanded position. Downward drag from expanded collapses; downward drag from standard dismisses. Click the exposed preview to close. Do not display a close icon. Use handle collapse and downward dismissal; Escape remains available for keyboard users. Escape closes on desktop; focus returns to the initiating entry. Sheet focus must remain within the active editor controls and preview dismissal target.

Scrolling content must not accidentally drag the sheet. Restrict direct dragging to header/handle in the initial implementation. Respect reduced-motion preferences; transitions otherwise use 180–240 ms and the existing ease curve. The software keyboard must not cover the focused input; allow content scrolling and keep edits when closing the sheet.

## Image and content rules

Only built-in backgrounds. Desired collection: dark paintings, quiet night scenes, solitary figures, atmospheric landscapes, literary still life, muted cinematic imagery. Use assets with verified redistribution rights; record source and license before adding new images. Original embedded images remain unchanged until deliberately replaced. Asset changes are a later step.

Quote color is chosen by the artwork preset for legibility, not exposed as a new user control. Verify at least 4.5:1 text contrast where practical; test the actual text area, not average image brightness. Keep attribution readable too.

Built-in quotes require accurate attribution; generated original text must not be attributed to a real author. AI must have loading, failure/retry, and unavailable states, and be visibly identified as AI-generated. Do not simulate an AI response with built-in text while claiming generation succeeded. Provider and server-side credential setup remain unresolved; never embed API keys in browser code. AI interface placement is deferred until the current component foundation is approved through normal iteration.

## Export, sharing and local state

Save downloads a high-resolution wallpaper image, without app controls, status bars or watermarks. Sharing uses that same rendered image via file sharing when available, with a truthful download fallback. The user explicitly deferred export size/aspect ratio until after component specification work. It remains a product decision: the supplied preview is 342:486, which differs from a typical full-screen phone wallpaper. Do not silently crop or claim a final resolution before choosing that contract.

Persist quote, source, alignment, background identifier, language choice and complete favorite designs on this device. Update active draft on selection and debounce text input briefly; flush on pagehide where supported. No undo/redo, account, cloud synchronization, subscription or separate editable-works library. Handle unavailable storage without falsely reporting successful persistence. Favorites are local full-design snapshots, not just quote IDs.

## Later navigation scope — no new pages in this phase

Confirmed menu items: Language, Favorites, Feedback, version information, and Privacy Policy. The user explicitly deferred the previously mentioned “用户didi” item; exclude it for now. Do not add login or profile functionality. Default English is confirmed, but supported alternative languages, feedback destination and actual privacy text are not yet supplied. Do not invent legal promises, contact addresses or operational links.

## Acceptance checklist for implementation

- Preserve the supplied home composition and warm literary styling.
- All production labels, placeholders, toasts and accessible names default to English.
- At 320–430 px widths no horizontal clipping, and controls remain operable with the keyboard open.
- Every actionable component has visible focus and a practical 44 px touch target.
- Quote/source changes remain synchronized across preview sizes; long text does not collide with attribution.
- Selecting an idea preserves background and alignment; categories actually filter.
- Local draft and favorite designs survive reload; storage failure is explicit.
- Sheet drag, click toggle, preview close, keyboard close and scroll coexist.
- Real export/share failure paths are tested; success messages correspond to actual outcomes.
- AI integration is not called complete until a real provider request works securely.


## Confirmed platform and delivery direction

Prioritize mobile web for iPhone Safari. The delivery target is an accessible HTTPS site with real high-resolution image export; a downloaded HTML snapshot is only an interim review artifact. Add home-screen/PWA support later. Native iOS and WeChat mini-program implementations are outside the current plan.

For iPhone saving, detect supported image-file sharing and let the user choose Save Image in the system share sheet where available. Provide a viewable/downloadable image fallback. Do not promise direct Photos-library writes or automatic wallpaper changes. Real-device Safari validation is required before claiming that saving flow works. Export aspect ratio and resolution remain deferred pending user confirmation.


## Confirmed demo content direction

The user requests AI-created quote copy and background imagery. The current demo uses three pre-generated dark literary artworks and 12 original AI-written English lines. Label them as AI-created originals; do not attribute them to historical authors or imply live generation. The supplied prototype remains archived. This replaces the prior temporary decision to retain its artwork and quotes in the active demo, without changing component structure.


## Latest background source update

The user supplied an updated HTML containing 12 dark backgrounds to replace the separately generated set. Use all 12 supplied images in the active demo; stop further image generation unless requested. Retain AI-original English quote copy. This supersedes the previous three-image demo content choice.


## Confirmed UI revision from user screenshots

- Remove the artificial iOS status-bar space in the website: use only the actual browser safe-area inset, without an extra fixed top spacer. No fake clock, signal, battery or home indicator.
- Expanded sheet reaches 20 px below the actual safe-area top (74 minus the original simulated 54 px status bar); the tab header remains fixed while artwork scrolls underneath. Keep the three-column gallery and existing artwork geometry.
- Quote placeholder is exactly “Please enter what you want to describe.” Both placeholder and entered quote text use #C4BFBA, matching the user's two explicit color values. Source field styling is unchanged.
- Remove the “Original words · AI-created” heading above inspiration cards. This does not change the source of generated content or authorize false author attributions.
- Remove the visible sheet close icon. Preview click, handle toggle, downward drag and Escape remain.
- Typography and Inspiration icon replacements are pending user-supplied assets; keep current icons until received. Preferred transparent SVG with the same 39 × 39 logical canvas for both icons, or 3× transparent PNG at 117 × 117. Preserve internal whitespace; do not crop the supplied artwork.


## Current settings and text-boundary work

The user authorizes Settings implementation. Reuse existing ivory surfaces, thin dividers, serif titles and sans-serif operational labels. Favorites restore or remove full locally stored designs. Feedback copy must never imply submission. Language range, feedback destination and privacy/version copy await user replies; current placeholders are not completed features.

The latest annotated screenshot specifies 24 px top/left/right in the reference wallpaper and at least 10 px between attribution and action buttons. Scale that shared reference composition for mini/favorite previews. Overflow behavior (input limit versus font fitting) requires user confirmation before adopting a new rule.


## Confirmed settings and text-limit decisions (2026-10-21)

- Available interface languages: English (default), Traditional Chinese, French, German, Italian, Dutch, Korean and Japanese. Save the preference locally; switching interface language must preserve wallpaper content and favorite designs.
- Feedback uses the explicitly fictitious address feedback@motivation.example. Label it as a demo placeholder without a receiving inbox. Support copying the typed message; never report delivery.
- Version is Demo 0.1. Privacy copy describes browser-local draft/favorites/language storage, no account sync, local bundled imagery and AI-written content, clipboard-only feedback, and GitHub Pages as the host. It is a demo notice to update before adding other collection.
- Keep wallpaper typography fixed. Stop input when its rendered quote plus attribution would exceed the 24 px top/side bounds and the 10 px separation above actions. Limit by measured layout, not an arbitrary universal character count: letters, languages and newlines occupy different space.
- Long paste inserts only a fitting portion, preserving existing surrounding text. Composition input is evaluated on commit, and grapheme segmentation avoids splitting emoji. Source edits share the same layout budget. Previously oversized stored text is fitted when restored, with feedback.
- The main, mini and favorite previews share reference-space layout; the offscreen measurement reference uses the same fonts and dimensions. No scrollable wallpaper text or auto-shrinking is used.


## Confirmed entry icons and toast UI (2026-10-21)

Use the supplied unmodified SVGs: Typography `Group 22.svg` at 39×39 and Inspiration `Group 29.svg` at 42×42. Preserve complete viewBoxes and internal whitespace. A common 42px layout slot keeps the entry labels aligned, with each asset rendered at its specified size. This supersedes the earlier identical export-size guidance.

Toast styling follows the user's supplied example: #1A1918 background, white left-aligned 18/24px copy, 4px corners, 12px inner padding and 12px icon gap. Short messages hug their contents; long messages wrap with at least 24px clearance from both edges of the app, including at narrow widths. Use the supplied 28×28 SVGs: `Group 24.svg` for reminders and `Group 24 (1).svg` for success. Keep existing bottom placement and 3-second dismissal. Respect reduced motion and expose the text through an atomic polite live region.

Use success only after persistence or copying actually succeeds. Input limits, unavailable saving/sharing and failed storage use reminders. Identical visible messages are not repeatedly restarted while the user keeps typing at the limit. Do not show multiple stacked runtime notifications; the design reference demonstrates variants.


## Latest visit, toast and editor transition rules (2026-10-21)

- A fresh visit shows a randomly selected built-in idea and background instead of restoring custom text. Avoid the immediately preceding quote and artwork; retain saved favorite designs and language preference. Internal editor/settings navigation preserves in-progress edits. Resume from a hidden page or BFCache also refreshes the home design once, without duplicate refresh events.
- Toasts appear at the top, 24px plus the actual safe-area inset, with no border. Keep the existing 24px side clearance, 4px corners, supplied icons, wrapping and auto-dismissal. This supersedes the previous bottom placement and border.
- Opening any of the three home entries scales the wallpaper smoothly from its main card to the mini preview while the sheet rises from the bottom. Close reverses the transition. Use a shared composition clone so text does not reflow mid-transition. Duration 360ms with the established easing curve; respect reduced-motion by opening/closing immediately. Clean up animation overlays after completion or interruption.


## Screenshot corrections: localized ideas, card flow and source guidance (2026-10-21)

- Translate all 12 built-in ideas and their AI-original captions into the chosen interface language. A selected built-in idea updates consistently on home, mini preview, idea cards and Type input when language changes. Identify built-in entries with stable IDs; never translate user-authored quotes or sources. Saved favorites remain snapshots.
- Built-in idea strings contain no forced line breaks. Let each surface wrap naturally at its own width. Preserve line breaks explicitly entered by users.
- Pack the ideas into two independently flowing columns, placing successive ideas alternately left/right. Each column has a strict 10px vertical gap; a taller card must not create extra blank space below its shorter neighbor.
- Newly selected/generated built-in designs have no prefilled Source. Source shows the localized “Enter an author or source…” placeholder until the user writes one. Source placeholder and value use #C4BFBA, matching Quote. AI-original labels remain localized on inspiration cards; they are not inserted as the user’s attribution.
- Remove the rectangular focus outline from Image/Type/Ideas tabs, including programmatic touch focus. Preserve selection underlines and a text-underline keyboard-focus cue. Other controls retain visible focus styles.


## Input focus and full sheet dismissal (2026-10-21)

Focusing either Quote or Source raises the sheet to its highest position before scrolling the focused field into view. Feedback-page input does not expand the editor sheet. On a deliberate downward handle gesture from the highest position, fully dismiss the editor instead of snapping to the intermediate height. A short accidental movement returns to the highest snap. Clicking the handle while expanded also dismisses it; clicking from standard height still expands it. Blur editor input when dismissing so keyboard focus is released, preserve the edited design within the visit, and retain the reverse wallpaper/sheet animation.


## First-open tab focus correction (2026-10-21)

Initial editor entry must not programmatically focus Image/Type/Ideas after the animation. Focus the neutral dialog container synchronously in the entry gesture, with no outline on the container. Keyboard users can still reach the tab list and use arrow navigation. Keep tab focus styling free of rectangular outlines. Test first and subsequent opens in fresh touch-enabled browser contexts, not only repeat clicks within one visit.


## Confirmed home-screen identity (2026-10-22)

Use the user-supplied black-and-white 编组.svg as the Motivation home-screen icon. Preserve the complete 512×512 square, black background, shapes and internal whitespace. Supply a 180px Apple touch PNG and 192/512px manifest PNGs rendered from the unmodified SVG; let the OS apply corner masking. Home-screen title is Motivation, with standalone launch and the existing ivory app theme. This adds install metadata only, not offline behavior or a new in-app installation flow.


## Six requested gallery/layout adjustments (2026-10-22)

- Remove the background-panel helper sentence entirely.
- Add nine AI-generated rich dark artworks with distinct palettes, retaining the 12 supplied backgrounds and their indices. New entries: burgundy vineyard, indigo coast, emerald woodland, copper canyon, violet still life, golden autumn, teal lagoon, slate lighthouse and rose rooftops. Use same-size JPEG encodings for mobile delivery; do not alter the original generation files.
- The user explicitly confirmed that Quote and Source placeholders must be exactly the same text: “Enter an author or source…”, localized identically in all eight languages. Do not clear current quote values merely to expose a placeholder. This supersedes the prior separate Quote hint.
- Begin expansion on Quote/Source pointer-down, before Safari opens the keyboard; retain focus-based expansion for keyboard/assistive input.
- Align the top edge of the mini wallpaper with the top edge of the main wallpaper at rest, with no extra centering offset. Preserve the existing shrinking-card transition.
- Halve the gap between wallpaper and the three home entry cards from 18px to 9px. The gap between entry cards and Save stays unchanged.

## Confirmed home corrections (2026-10-22)
- Header-to-wallpaper gap is 8px (previously16); wallpaper-to-three-entries is18px, not9. Mini preview matches the same card top.
- Remove Share. The existing bookmark is the sole bottom-right wallpaper action, retaining its44px target and18px inset.
- Refresh sits immediately left of More, randomizes both background and idea excluding previous selections, retains favorites/language.
- Built-in ideas display their localized AI original attribution on home, mini preview and Type; manual source edits remain literal. Empty inputs retain their guidance.
- Uploaded m_ic_pop_favorites.png is exclusively the Favorites empty-state illustration, preserved byte-for-byte and displayed160px wide at its original480:453 aspect ratio. Empty-state title/subtitle gap is6px.

## Header, saved wallpapers and Type refinement (2026-10-22)
- Refresh uses a joined arc/arrow at28px; More strokes are24px wide, both retain44px hit targets.
- Favorites empty title/subtitle gap3px and subtitle15px. Saved wallpaper removal is a filled bookmark circle overlaid bottom-right, using the home symbol and no visible Remove label.
- Quote and Source entered values use primary ink #1A1918; native placeholders remain #C4BFBA and disappear when values exist. Existing wallpaper content is real text, not a placeholder, and is not silently deleted.
- Type hides app header and raises mini wallpaper to safe-area top. Switching to Image/Ideas restores their established header/preview position; closing restores home.

## Custom field guidance correction (2026-10-22)
- Quote and Source show “Add your custom text / quote” when not customized, placeholder #C4BFBA; do not prefill built-in quote/AI attribution as editable field values. Wallpaper retains its built-in content until an actual edit. Custom field values use #1A1918 and remain when reopening within the visit. Guidance localizes in all eight languages.
- Type explicitly hides header visually and from accessibility; switching away/closing restores it. Refresh icon increases28→30px.

- Refresh icon remains30px but stroke is exactly1.5px with SVG non-scaling-stroke; enlargement must not thicken lines.

## Type preview spacing and entry return (2026-10-22)
- Normal Type sheet preview top is24px plus actual safe area, with exactly18px between wallpaper bottom and sheet top. Preview scales proportionally to the available vertical space, replacing the old fixed38% width. Highest editor still covers preview when entering text.
- All three home entries remain plain1px-border actions on return, without black focus outline/selected border. Keyboard focus uses label underline.
- Rendering a home route with editor closed clears stale header hiding/inert state, so refresh/menu return after editor/settings navigation. Refresh still30px with fixed1.5px stroke.

## Type preview follows sheet geometry (2026-10-22)
- Do not calculate preview size from a fixed41% viewport region. Measure actual sheet offsetTop and available width; top24px+safe area and bottom18px define maximum proportional wallpaper size. ResizeObserver follows sheet/viewport resizing and dragging. Width and height both change together; never stretch artwork. At the highest input position no preview space remains.
