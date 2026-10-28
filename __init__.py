"""
ComfyUI-Draftsman — styling and layout tools for the ComfyUI graph (formerly ComfyUI-NodeTheme).

* separate header / body colours for nodes and groups, format painter, colour rules, themes;
* alignment guides, spacing magnet, align / line up / same size / fit group, arrow-key nudging.

Frontend-only extension: it adds no Python nodes, it only serves JS.
"""

NODE_CLASS_MAPPINGS = {}
NODE_DISPLAY_NAME_MAPPINGS = {}
WEB_DIRECTORY = "./web"

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
