---
name: motivation-design
description: Design, implement, and review Motivation mobile web UI using its established warm literary visual system. Use for Motivation components, component showcases, editor interactions, English product copy, and later pages that must match the supplied prototype.
---

# Motivation design

## Scope and sources

Apply this skill when building or reviewing Motivation UI, or when the user explicitly invokes `$motivation-design`. This is a project design skill, not a Figma connector or image generator. It does not require Figma access.

Before making UI decisions, read [the component specification](references/design-system.md). Its extracted measurements describe the original prototype; proposed improvements are requirements for future implementation, not evidence of already working features.

The repository root is three directories above this skill directory. Read `docs/PROJECT_STATUS.md` there for current decisions. The untouched visual baseline is `prototypes/motivation-original.html`. Preserve that original and implement changes in separate files. Do not assume an application framework already exists: inspect the repository first.

The latest explicit user instructions take precedence. If requirements change, update this skill’s reference and `docs/DESIGN_SYSTEM.md` together, then record the decision in `docs/PROJECT_STATUS.md`. Keep the two specification copies identical.

## Non-negotiable product decisions

- Build a mobile browser experience for iPhone Safari first, delivered through HTTPS with real image export. Add PWA/home-screen support later; do not switch to native iOS or WeChat mini-program development. Default product copy, feedback and accessible names to English, even when the conversation is Chinese.
- Retain the supplied visual composition: warm ivory UI, literary serif typography, thin borders, 4 px corners, monochrome actions and quiet spacing.
- Keep the app shell light. Prefer dark, artistic, solitary, literary and atmospheric built-in wallpaper imagery. Do not add uploads or unrelated visual styles.
- Quote editing includes quote, optional source and alignment. Do not add font, size or color controls unless requested.
- Ideas combine a built-in library with real AI generation. Applying an idea changes quote and source only.
- Favorites store the complete wallpaper locally. Auto-save the current design on this device. No login, cross-device sync, subscriptions, undo/redo or separate editable-works library.
- Save exports a high-resolution image; Share shares the image. Final export ratio and resolution are explicitly deferred. Do not silently decide them.
- Menu scope is Language, Favorites, Feedback, version information and Privacy Policy. Omit the deferred “用户didi” item. Eight interface languages, a clearly marked fictitious feedback address and demo privacy text are now confirmed; see the latest reference.
- Settings pages are now explicitly authorized. Reuse the established visual system; use the latest confirmed eight-language options, placeholder-only feedback address, Demo 0.1 privacy notice and fixed-size input limits in the reference.

## Workflow

1. Inspect the current repository, changes and requested scope. Read the reference and current project status. Preserve unrelated work and existing Skills.
2. Reuse the original palette, type roles and component geometry. Replace rigid viewport coordinates with responsive layout while preserving the reference composition.
3. For a visual specification request, build a browser-viewable component showcase using actual HTML/CSS components. Show named variants and interactive states, rather than only writing prose or generating a static picture. Keep showcase labels in English. Do not invent new app pages to fill the showcase.
4. Include default, selected, pressed, focus, loading, empty and error states where relevant. Include the lighter empty-field placeholders, real text values in their specified colors, optional attribution, and long-content cases.
5. Implement only authorized behaviors. Sheet dragging needs a click/keyboard alternative, scrolling must not drag the sheet accidentally, and the exposed preview closes the editor. Preserve edits across panel switches.
6. Use one composition model for main preview, mini preview, favorites and eventual export. Attribution follows the quote; long text must not overlap. Placeholders never become wallpaper text.
7. Validate the actual rendered UI when browser tools are available. Test 320, 375, 390 and 430 px widths, keyboard focus, minimum 44 px touch targets, long quotes and reduced motion. If visual tools are unavailable, state that limitation; do not claim visual validation from code inspection alone.
8. Verify real behavior before reporting success. AI requires a secure backend/provider, never client-side keys or simulated success. Download, share and storage failures need truthful feedback. Defer unresolved integrations explicitly while completing independent UI work.
9. Record what changed, how it was checked and what remains unresolved in the project status. Link to the concrete artifact for review. Distinguish a specification, a visual implementation and tested product functionality.

## Quick visual checks

- Surface #F5EFE9; primary ink #1A1918; secondary ink #625F5D; borders #E6E0DA.
- Amiri for brand, quote and literary labels; system sans for fields and operational copy.
- Reference width 390 px with 24 px gutters; 16 px gutters may be used at narrow widths.
- Main Save button 56 px high; circular actions 44 px; component radius 4 px.
- Empty Quote: “Please enter what you want to describe.” (placeholder and entered quote text #C4BFBA); empty Source: “Add an author or source (optional)”.
- Selected dark thumbnails need a clear outline/check; dark artwork needs readable light quote and source text.
- English toasts must describe an operation that actually happened. A toast alone does not implement save, share, feedback or AI generation.

See the reference for complete tokens, measurements, component contracts and acceptance checks. No external messaging, publishing or deployment is authorized merely by applying this skill.

User-confirmed UI revision: no simulated iOS status-area spacer, no visible sheet close icon, and no “Original words · AI-created” heading. See the latest reference section for screenshot geometry and input color. Use the latest supplied icon assets documented in the reference.

The latest supplied entry icons render at their original 39×39 (Typography) and 42×42 (Inspiration) dimensions, with internal whitespace preserved and aligned layout slots. Toasts use the supplied success/reminder SVGs and the latest 24px side-clearance specification.
