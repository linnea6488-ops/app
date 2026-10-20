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
| ink/placeholder | #827B74 | Proposed lighter placeholder; verify contrast on composited input surface |
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
| Editor sheet | Ivory surface, grabber, tab header, scrolling body | Standard and expanded positions; preserve y346 and y74 on reference artboard. Adaptive positions must leave an operable close path. Header stays fixed while content scrolls. |
| Sheet grabber | 46 × 4 px visible line | At least 44 px high target, click and keyboard toggle as drag alternative. Accessible label “Expand editor” / “Collapse editor”. |
| Editor tabs | Image / Type / Ideas; 48 px header; 48 × 4 px indicator | One selected tab; selection indicated by underline and aria-selected. Each full tab hit area at least 44 px high. Switching tabs preserves edits and sheet height. |
| Background thumbnail | Three columns, 10 px gap, 107:190 reference ratio | Loading, ready, selected, failed. Selected has stable inset outline plus small check indicator so dark artwork cannot conceal state. Failure offers retry. Decorative artwork descriptions supplied as accessible names. No upload control. |
| Text field | Label, bordered ivory-white surface, 16 px value, 18 px horizontal inset | Empty/placeholder, filled, focus, invalid. Quote minimum height 116 px; Source 68 px. Fields can grow or scroll without clipping. Values use primary ink, placeholders lighter; labels always remain visible. |
| Alignment segmented control | 56 px height, three equal segments, selected inset surface | Left / Center / Right labels for assistive technology; selected state via aria-pressed or radio semantics. Changes update preview and local draft immediately. |
| Category chip | 36 px visual height, 4 px radius, horizontal strip | Recommended / Philosophy / Motivation / Love / Family. 44 px interaction height, visible selected fill, focus. Real filtering; selection is not merely decorative. Preserve scroll position sensibly. |
| Inspiration card | Two columns, 10 px gap, 18 px internal padding | Natural content height, quote, divider, source. Default, selected, focus. Never duplicate text to fill space. Selection changes quote and attribution only; background and alignment remain unchanged. |
| Toast | Dark translucent surface, light 13 px text, bottom safe-area offset | Short nonblocking status, roughly 2–3 seconds, polite live region. Errors requiring action stay visible inline with retry. Never use a success toast as a substitute for performing an operation. |

### Type panel copy

| Element | English copy |
| --- | --- |
| Quote label | Quote |
| Empty quote placeholder | Write your own words… |
| Source label | Source |
| Empty source placeholder | Add an author or source (optional) |
| Alignment label | Alignment |
| Export failure | Couldn’t export your wallpaper. Try again. |
| Favorites feedback | Added to favorites / Removed from favorites |
| Export feedback | Wallpaper downloaded |
| Share fallback | Sharing isn’t available here. Download your wallpaper instead. |
| Persistence failure | Your changes couldn’t be saved on this device. |

Placeholders appear only for empty fields. Existing quote text must stay editable at normal contrast; do not show a placeholder as real input or erase the current design just to reveal instructions. Do not block saving on an empty optional source.

### Sheet interaction contract

Drag the handle/header using pointer capture, distinguish taps from drags, and snap to standard or expanded position. Downward drag from expanded collapses; downward drag from standard dismisses. Click the exposed preview to close. In expanded mode offer an accessible close action even if the preview is covered. Escape closes on desktop; focus returns to the initiating entry. Sheet focus must remain within active editor controls and its close action.

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
