# HabboRegistration

HTML5 Canvas replacements for the original Flash-based `HabboRegistration.swf` avatar editor. Both versions are written in TypeScript, built with Vite, and render entirely on `<canvas>` with no Flash dependency.

*Part of a series on various Habbo SWF files converted to HTML5*

See the following projects:
- [HabboLanding](https://github.com/Quackster/HabboLanding)
- [HabboBadgeEditor](https://github.com/Quackster/HabboBadgeEditor)
- [HabboRegistration](https://github.com/Quackster/HabboRegistration)

## Versions

### [Version 1.0](version-1.0/)

Port of the original `HabboRegistration.swf` (v38, 2007). Uses the legacy numeric figure string format (`1750118022210132810129003`) and the older `figure_data_xml.xml` / `figure_editor.xml` data files that shipped with that SWF. Sprites and UI assets are extracted directly from the decompiled SWF via a bundled `extract-assets.ts` script.

### [Version 2.0](version-2.0/)

Port of the later `HabboRegistration.swf` (v0.916). Uses the dot-delimited figure string format (`hd-180-1.ch-215-82.lg-270-82`) and the restructured `figuredata.xml` / `draworder.xml` data files. Includes Habbo Club item filtering, serialisable menu state, full localisation support, and a more complete callback interface via `window.HabboEditor`. Sprites are sourced from a separate `avatars_big` SWF.

## Licence

See [LICENSE](LICENSE).
