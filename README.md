# PLOTR // Studio

Static browser-side generative studio. No build step. `dist/index.html` loads the original four engines and the poster compositor.

## Poster edition

- Existing engines, seeds, animation, formats, palettes, favorites and SVG downloads remain available.
- Type Playground: repeated patterns or a single multiline composition, tracking, horizontal scale, line spacing, size, slant and alignment.
- Poster tab: up to six independent multiline vector text blocks, visibility, field participation, color, stroke width, position, alignment, rotation and double-line style.
- Overlay, reserve and repulsion work with all four engines. Emission starts Flow Field paths on sampled letter strokes. Switching to another engine changes emission to repulsion.
- Three starter compositions: Editorial, Emission, Optical. Templates replace current parameters; favorites preserve full state including animation phase.
- A3 portrait/landscape added to square and A4 formats.

## Geometry and exports

Coordinates and SVG physical dimensions are in millimeters. Poster and Type Playground share the original single-line alphabet plus locally bundled Archivo Black, Bebas Neue, Roboto (400), and Space Grotesk (500). Real font outlines preserve Latin accents and case; the original monoline transliterates accents and uppercases text. Unsupported characters fall back to `?`. All artwork exports as contours with no runtime font dependency. The Corps control measures capital height in mm to keep the families visually comparable.

Repulsion uses a sampled distance/force field around actual glyph strokes. Flow integrates this force into line trajectories; other engines displace sampled paths. Reserve clips line fragments around strokes. Field sampling is 2 mm, with glyph samples at most 1.5 mm apart; this is an artistic interaction rather than exact geometric offsetting.

Artwork is clipped to safe margins. Preview and export share the same final path list. Each text block exports to its own labeled SVG layer with its own ink and stroke width; thickness simulates a pen and does not physically vary a plotter nib. Export includes serialized composition metadata. Favorites are local to the browser and old favorites acquire defaults on restoration.

No user-imported fonts, full DTP shaping, automatic word wrapping, PDF export or physical plotter control is implemented. Enter line breaks explicitly. Partial overlap merging is not implemented; cleanup removes matching segments and optimizes travel by a nearest-endpoint heuristic.

## Typography edition

- Independent repeat-mode capital height (1–80 mm) and row count (1–120). Compose mode retains its own size. A fit action sets row count using 1.4 × capital height.
- Legacy favorites without repeat size acquire their former automatic size when opened. Font choice is preserved per poster block and in Type Playground favorites.
- Original fonts and SIL OFL notices are bundled in `dist/fonts`. `scripts/build-font-outlines.py` compiles Latin glyph contours and GPOS kerning pairs; source URLs and source SHA-256 are embedded in `font-data.js`. Rebuild with Python/fontTools. Roboto is instantiated at weight 400 / width 100, Space Grotesk at weight 500.
- Quadratic/cubic outlines are flattened to deterministic polylines with 0.001 capital-height tolerance, then normalized coordinates are rounded to 4 decimal places. Letters are outlined for plotting, not automatically filled. Font previews use the locally hosted TTFs.
- Dense repeated layouts cap at 18,000 characters across all rows and show an explicit notice if truncated. Large exports use spatial buckets before local nearest-endpoint ordering to avoid quadratic full-page routing costs.
