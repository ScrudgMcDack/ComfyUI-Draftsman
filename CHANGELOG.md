# Changelog

<p align="center"><b>English</b> · <a href="CHANGELOG.ru.md">Русский</a></p>

All notable changes to Draftsman. Versions follow [Semantic Versioning](https://semver.org/).

## [1.2.1] — 2026-11-14
### Changed
- Highlighted links: the centre markers of a link (the points that add a reroute) and the reroute dots take the colour
  of the highlight. ComfyUI draws the markers white on a highlighted link, and the bright line covered only their
  middle.

### Documentation
- README: animated GIFs of the highlighted links and the comets — a selected node, links through reroutes, hovering a
  slot.
- Russian README brought in line with the English one: pictures, the Colors details, Nodes 2.0, setting tooltips.

## [1.2.0] — 2026-11-12
### Added
- **Group shape ▸** in the group menu: square (stock), round or card corners for groups; kept in the workflow and
  undone with Ctrl+Z.
- **Node collapse button:** the dot in the node header is drawn as a button — a chevron on a dark backing (default),
  plus / minus or the stock dot (Settings → Draftsman → Nodes).
- Drafting-compass icon on the Draftsman menu title and an icon for the Draftsman settings section.

### Changed
- The Draftsman block of a context menu stays in one piece when other extensions add their items to the same menu.
- Group menu items renamed to “Color frame of group…” and “Color nodes in group…”.

## [1.1.0] — 2026-11-04
### Added
- **Link focus:** the links of the selected nodes are drawn bright and on top, the others are dimmed; incoming links
  blue, outgoing orange; hovering an input or output highlights only its links (Settings → Draftsman → Links).
- **Comets:** a bright head with a fading tail runs along each highlighted link from the output to the input, through
  reroutes; drawn on their own layer at the screen rate.
- **Styled output tooltips:** nodes that describe their outputs (e.g. Rigstools) get a short title and coloured lines
  about the current value; an API for node authors (`getStyledOutputTooltip`).
- The node description tooltip is hidden while a node, a group or the canvas is dragged.
- Release and release date badges in the README.

## [1.0.0] — 2026-10-29
First public version.
- Separate header and body colors for nodes and groups, the color dialog, format painter, color rules and theme files,
  optional copy / paste of colors.
- Layout: align, line up in a row / column, same size, fit group to nodes — all in grid cells; arrow keys move the
  selection.
- Alignment guides and the spacing magnet.
- English and Russian UI.

[1.2.1]: https://github.com/ScrudgMcDack/ComfyUI-Draftsman/releases/tag/v1.2.1
[1.2.0]: https://github.com/ScrudgMcDack/ComfyUI-Draftsman/releases/tag/v1.2.0
[1.1.0]: https://github.com/ScrudgMcDack/ComfyUI-Draftsman/releases/tag/v1.1.0
[1.0.0]: https://github.com/ScrudgMcDack/ComfyUI-Draftsman/releases/tag/v1.0.0
