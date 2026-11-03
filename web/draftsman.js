// ComfyUI-Draftsman (formerly ComfyUI-NodeTheme)
//  • separate header / body colours for nodes AND groups — single item or batch,
//    format painter, colour rules by category, theme export / import
//  • dashed alignment guides for the selection + magnet on release
//  • spacing magnet: keeps an exact gap (in grid cells) between neighbouring nodes,
//    with its own gap for nodes of neighbouring groups
//  • layout tools: align, line up with the configured gap, same size, fit group by cells, arrow-key nudging
//  • UI in English and Russian (falls back to English)
//
// Storage:
//   node  header → node.color,  body → node.bgcolor            (stock LiteGraph fields)
//   group header → group.color, body → group.flags.dm_body     (serialised with the group;
//                                                               old NodeTheme key nt_body is still read)

import { app } from "../../scripts/app.js";

const EXT_NAME = "Tentencode.Draftsman";
const P = "Draftsman";
const GROUP_BODY = "dm_body";
const GROUP_BODY_LEGACY = "nt_body"; // NodeTheme (old name of the extension)

// ───────────────────────────── i18n ─────────────────────────────

const STR = {
  en: {
    dlgNodes: "Node colors",
    dlgGroups: "Group colors",
    applyTo: "Apply to",
    scSelNodes: "Selected nodes",
    scType: "All nodes of type “{type}”",
    scGroupNodes: "All nodes in group “{title}”",
    scAllNodes: "All nodes in the graph",
    scSelGroups: "Selected groups",
    scOneGroup: "Group “{title}”",
    scAllGroups: "All groups in the graph",
    preview: "Preview",
    header: "Header",
    body: "Body",
    keep: "Keep",
    keepTip: "Leave this part unchanged",
    reset: "Reset",
    resetTip: "Back to the default color",
    custom: "custom color",
    fromHeader: "from header",
    fromHeaderTip: "Body = header color shifted in lightness",
    pairs: "Pairs",
    save: "+ Save",
    saveTip: "Save current header and body as a pair",
    pairTip: "header {h}, body {b}",
    pairDel: "Right-click / × to delete",
    mixed: "mixed",
    cancel: "Cancel",
    cancelEsc: "Cancel (Esc)",
    apply: "Apply",
    nothingSave: "Nothing to save",
    nothingSaveD: "set header and body colors first",
    noSel: "Nothing selected",
    noSelD: "select one or more nodes or groups",
    copied: "Colors copied",
    copiedD: "header {h}, body {b}",
    mNodeColors: "Header & body colors…{n}",
    mCopy: "Copy colors",
    mPaste: "Paste colors{n}",
    mReset: "Reset colors{n}",
    mGroupColors: "Group colors “{title}”…",
    mGroupNodes: "Color nodes in group “{title}”…",
    mGroupCopy: "Copy group colors",
    mGroupPaste: "Paste colors to group",
    mGroupReset: "Reset group colors",
    mSelNodes: "Colors of selected nodes…",
    mSelGroups: "Colors of selected groups…",
    menuTitle: "Draftsman",
    pairsKeepTip: "Leave header and body unchanged",
    pairsResetTip: "Reset header and body to defaults",
    mGuidesHide: "Hide alignment guides",
    mGuidesShow: "Show alignment guides",
    mGapOff: "Turn spacing magnet off",
    mGapOn: "Turn spacing magnet on",
    cells: "{n} cells",
    cell1: "1 cell",
    mPainter: "Format painter",
    mPainterGroup: "Format painter from group",
    painterOn: "Format painter: click nodes or groups · Esc / right-click — exit",
    painterNoSrc: "Select a node or group to take the style from",
    mLayout: "Layout{n}",
    alLeft: "Align left edges",
    alHCenter: "Align horizontal centers",
    alRight: "Align right edges",
    alTop: "Align top edges",
    alVCenter: "Align vertical centers",
    alBottom: "Align bottom edges",
    dsRow: "Line up in a row (gap from settings)",
    dsCol: "Line up in a column (gap from settings)",
    szW: "Same width (largest)",
    szH: "Same height (largest)",
    szWH: "Same size (largest)",
    szWRef: "Width as “{title}”",
    szHRef: "Height as “{title}”",
    szWHRef: "Size as “{title}”",
    mFitGroup: "Fit group to nodes (grid)",
    mFitGroups: "Fit selected groups to nodes (grid)",
    mTheme: "Theme & color rules…",
    thTitle: "Theme & color rules",
    thRules: "Color rules",
    thRulesHint: "Category (or its beginning) or node type; the longest match wins.",
    thAdd: "+ Rule",
    thFromSel: "+ From selection",
    thFromSelTip: "Take category and colors of the selected node",
    thPattern: "category, e.g. loaders",
    thAuto: "Color new nodes automatically",
    thEmpty: "No rules yet",
    thFile: "Theme file",
    thFileHint: "Palette, saved pairs and color rules",
    thExport: "Export…",
    thImport: "Import…",
    thApply: "Apply to all nodes",
    thClose: "Close",
    thApplied: "Rules applied",
    thAppliedD: "nodes recolored: {n}",
    thImported: "Theme imported",
    thBadFile: "Not a Draftsman theme file",
    delTip: "Delete",
  },
  ru: {
    dlgNodes: "Цвета нод",
    dlgGroups: "Цвета групп",
    applyTo: "Кому",
    scSelNodes: "Выделенные ноды",
    scType: "Все ноды типа «{type}»",
    scGroupNodes: "Все ноды группы «{title}»",
    scAllNodes: "Все ноды графа",
    scSelGroups: "Выделенные группы",
    scOneGroup: "Группа «{title}»",
    scAllGroups: "Все группы графа",
    preview: "Предпросмотр",
    header: "Шапка",
    body: "Тело",
    keep: "Не менять",
    keepTip: "Не трогать эту часть",
    reset: "Сброс",
    resetTip: "Вернуть цвет по умолчанию",
    custom: "свой цвет",
    fromHeader: "из шапки",
    fromHeaderTip: "Тело = цвет шапки, сдвинутый по яркости",
    pairs: "Пары",
    save: "+ Сохранить",
    saveTip: "Сохранить текущие шапку и тело как пару",
    pairTip: "шапка {h}, тело {b}",
    pairDel: "ПКМ / × — удалить",
    mixed: "разные",
    cancel: "Отмена",
    cancelEsc: "Отмена (Esc)",
    apply: "Применить",
    nothingSave: "Нечего сохранять",
    nothingSaveD: "сначала задайте цвет шапки и тела",
    noSel: "Ничего не выделено",
    noSelD: "выделите одну или несколько нод или групп",
    copied: "Цвета скопированы",
    copiedD: "шапка {h}, тело {b}",
    mNodeColors: "Цвета шапки и тела…{n}",
    mCopy: "Копировать цвета",
    mPaste: "Вставить цвета{n}",
    mReset: "Сбросить цвета{n}",
    mGroupColors: "Цвета группы «{title}»…",
    mGroupNodes: "Раскрасить ноды группы «{title}»…",
    mGroupCopy: "Копировать цвета группы",
    mGroupPaste: "Вставить цвета в группу",
    mGroupReset: "Сбросить цвета группы",
    mSelNodes: "Цвета выделенных нод…",
    mSelGroups: "Цвета выделенных групп…",
    menuTitle: "Draftsman",
    pairsKeepTip: "Не трогать ни шапку, ни тело",
    pairsResetTip: "Сбросить шапку и тело к умолчанию",
    mGuidesHide: "Скрыть направляющие",
    mGuidesShow: "Показать направляющие",
    mGapOff: "Выключить магнит интервалов",
    mGapOn: "Включить магнит интервалов",
    cells: "{n} кл.",
    cell1: "1 кл.",
    mPainter: "Кисть формата",
    mPainterGroup: "Кисть формата с группы",
    painterOn: "Кисть формата: кликайте по нодам и группам · Esc / ПКМ — выход",
    painterNoSrc: "Выделите ноду или группу, с которой брать стиль",
    mLayout: "Раскладка{n}",
    alLeft: "Выровнять по левому краю",
    alHCenter: "Выровнять по центру (по горизонтали)",
    alRight: "Выровнять по правому краю",
    alTop: "Выровнять по верхнему краю",
    alVCenter: "Выровнять по центру (по вертикали)",
    alBottom: "Выровнять по нижнему краю",
    dsRow: "Выстроить в ряд (интервал из настроек)",
    dsCol: "Выстроить в столбец (интервал из настроек)",
    szW: "Одинаковая ширина (по самой широкой)",
    szH: "Одинаковая высота (по самой высокой)",
    szWH: "Одинаковый размер (по самой большой)",
    szWRef: "Ширина как у «{title}»",
    szHRef: "Высота как у «{title}»",
    szWHRef: "Размер как у «{title}»",
    mFitGroup: "Подогнать группу по нодам (по клеткам)",
    mFitGroups: "Подогнать выделенные группы по нодам (по клеткам)",
    mTheme: "Тема и правила раскраски…",
    thTitle: "Тема и правила раскраски",
    thRules: "Правила раскраски",
    thRulesHint: "Категория (или её начало) либо тип ноды; побеждает самое длинное совпадение.",
    thAdd: "+ Правило",
    thFromSel: "+ Из выделенной",
    thFromSelTip: "Взять категорию и цвета выделенной ноды",
    thPattern: "категория, напр. loaders",
    thAuto: "Красить новые ноды автоматически",
    thEmpty: "Правил пока нет",
    thFile: "Файл темы",
    thFileHint: "Палитра, сохранённые пары и правила раскраски",
    thExport: "Экспорт…",
    thImport: "Импорт…",
    thApply: "Применить ко всем нодам",
    thClose: "Закрыть",
    thApplied: "Правила применены",
    thAppliedD: "перекрашено нод: {n}",
    thImported: "Тема импортирована",
    thBadFile: "Это не файл темы Draftsman",
    delTip: "Удалить",
  },
};

function rawSetting(id) {
  try {
    const sm = app.extensionManager?.setting;
    return sm?.get ? sm.get(id) : app.ui?.settings?.getSettingValue?.(id);
  } catch {
    return undefined;
  }
}

function lang() {
  const loc = String(rawSetting("Comfy.Locale") || document.documentElement.lang || navigator.language || "en").toLowerCase();
  const base = loc.split(/[-_]/)[0];
  return STR[base] ? base : "en";
}

function t(key, vars = {}) {
  const s = STR[lang()]?.[key] ?? STR.en[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ""));
}

// ───────────────────────────── settings ─────────────────────────────

const S = {
  GUIDES_ON: `${P}.Guides.Enabled`,
  GUIDES_MODE: `${P}.Guides.Mode`,
  GUIDES_DRAG_ONLY: `${P}.Guides.DragOnly`,
  GUIDES_THRESHOLD: `${P}.Guides.Threshold`,
  GUIDES_CENTERS: `${P}.Guides.Centers`,
  GUIDES_GROUPS: `${P}.Guides.Groups`,
  GUIDES_SNAP: `${P}.Guides.Snap`,
  GUIDES_COLOR: `${P}.Guides.Color`,
  GUIDES_MATCH_COLOR: `${P}.Guides.MatchColor`,
  GAP_ON: `${P}.Spacing.Enabled`,
  GAP_RADIUS: `${P}.Spacing.Radius`,
  GAP_CELL: `${P}.Spacing.CellSize`,
  GAP_NODE_X: `${P}.Spacing.NodeX`,
  GAP_NODE_Y: `${P}.Spacing.NodeY`,
  GAP_GROUP_X: `${P}.Spacing.GroupX`,
  GAP_GROUP_Y: `${P}.Spacing.GroupY`,
  GAP_COLOR: `${P}.Spacing.Color`,
  PALETTE: `${P}.Colors.Palette`,
  BODY_SHIFT: `${P}.Colors.BodyShift`,
  PRESETS: `${P}.Colors.Presets`,
  AUTO_COLOR: `${P}.Colors.AutoColor`,
  COPY_PASTE: `${P}.Colors.CopyPaste`,
  RULES: `${P}.Colors.Rules`,
  NUDGE_ON: `${P}.Layout.Nudge`,
  NUDGE_BIG: `${P}.Layout.NudgeBig`,
  GROUP_PAD: `${P}.Layout.GroupPadding`,
  TIPS_ON: `${P}.Tooltips.Styled`,
  LINKS_FOCUS: `${P}.Links.Focus`,
  LINKS_DIM: `${P}.Links.Dim`,
  LINKS_ANIM: `${P}.Links.Animate`,
  LINKS_SPEED: `${P}.Links.Speed`,
  LINKS_INOUT: `${P}.Links.InOutColors`,
  LINKS_IN_COLOR: `${P}.Links.InColor`,
  LINKS_OUT_COLOR: `${P}.Links.OutColor`,
  MIGRATED: `${P}.Migrated`,
};

const DEFAULTS = {
  [S.GUIDES_ON]: true,
  [S.GUIDES_MODE]: "both",
  [S.GUIDES_DRAG_ONLY]: false,
  [S.GUIDES_THRESHOLD]: 8,
  [S.GUIDES_CENTERS]: true,
  [S.GUIDES_GROUPS]: true,
  [S.GUIDES_SNAP]: true,
  [S.GUIDES_COLOR]: "#4ea1ff",
  [S.GUIDES_MATCH_COLOR]: "#ff4fd8",
  [S.GAP_ON]: true,
  [S.GAP_RADIUS]: 24,
  [S.GAP_CELL]: 0,
  [S.GAP_NODE_X]: 3,
  [S.GAP_NODE_Y]: 3,
  [S.GAP_GROUP_X]: 3,
  [S.GAP_GROUP_Y]: 6,
  [S.GAP_COLOR]: "#ffb238",
  [S.PALETTE]:
    "#1e1e1e, #2b2b2b, #3a3a3a, #4d4d4d, #6b6b6b, " +
    "#5c2626, #8a3434, #a0522d, #8c6d1f, #6b7a22, " +
    "#2f6b3a, #1f6b5c, #1f5f7a, #27408b, #4b3a8c, " +
    "#6b2f7a, #8a2f5f, #000000",
  [S.BODY_SHIFT]: -35,
  [S.PRESETS]: "[]",
  [S.AUTO_COLOR]: false,
  [S.COPY_PASTE]: false,
  [S.RULES]: "[]",
  [S.NUDGE_ON]: true,
  [S.NUDGE_BIG]: 5,
  [S.GROUP_PAD]: 1,
  [S.MIGRATED]: false,
  [S.TIPS_ON]: true,
  [S.LINKS_FOCUS]: true,
  [S.LINKS_DIM]: 25,
  [S.LINKS_ANIM]: true,
  [S.LINKS_SPEED]: 220,
  [S.LINKS_INOUT]: true,
  [S.LINKS_IN_COLOR]: "#4fc3ff",
  [S.LINKS_OUT_COLOR]: "#ffab40",
};

const LS_KEY = "Draftsman.settings";
let legacyStore = null;
function lsLoad() {
  if (legacyStore) return legacyStore;
  try { legacyStore = JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { legacyStore = {}; }
  return legacyStore;
}

function getSetting(id) {
  let v = rawSetting(id);
  if (v === undefined || v === null) v = lsLoad()[id];
  return v === undefined || v === null ? DEFAULTS[id] : v;
}

async function setSetting(id, value) {
  try {
    const sm = app.extensionManager?.setting;
    if (sm?.set) return await sm.set(id, value);
    if (app.ui?.settings?.setSettingValue) return app.ui.settings.setSettingValue(id, value);
  } catch (e) {
    console.warn("[Draftsman] setting save failed, falling back to localStorage", e);
  }
  const st = lsLoad();
  st[id] = value;
  try { localStorage.setItem(LS_KEY, JSON.stringify(st)); } catch {}
}

const redraw = () => app.canvas?.setDirty?.(true, true);
const CAT = "Draftsman";

// Names are English; Russian comes from locales/ru/*.json (ComfyUI i18n).
const SETTINGS_DEF = [
  { id: S.GUIDES_ON, category: [CAT, "Guides", "1"], name: "Show alignment guides",
    type: "boolean", defaultValue: DEFAULTS[S.GUIDES_ON], onChange: redraw },
  { id: S.GUIDES_MODE, category: [CAT, "Guides", "2"], name: "Guides mode",
    type: "combo", defaultValue: DEFAULTS[S.GUIDES_MODE], onChange: redraw,
    options: [
      { text: "Matches + edge extensions", value: "both" },
      { text: "Matches with other nodes only", value: "smart" },
      { text: "Selection edge extensions only", value: "extended" },
    ] },
  { id: S.GUIDES_DRAG_ONLY, category: [CAT, "Guides", "3"], name: "Show guides only while dragging",
    type: "boolean", defaultValue: DEFAULTS[S.GUIDES_DRAG_ONLY], onChange: redraw },
  { id: S.GUIDES_THRESHOLD, category: [CAT, "Guides", "4"], name: "Alignment threshold (screen px)",
    tooltip: "How close (in screen pixels) an edge or centre must come to another one for the pink alignment line to appear and for the node to snap to it on release.\nThe pull to an exact gap between nodes is set separately: Spacing → Spacing magnet radius.",
    type: "slider", attrs: { min: 2, max: 60, step: 1 }, defaultValue: DEFAULTS[S.GUIDES_THRESHOLD], onChange: redraw },
  { id: S.GUIDES_CENTERS, category: [CAT, "Guides", "5"], name: "Align by node centers too",
    type: "boolean", defaultValue: DEFAULTS[S.GUIDES_CENTERS], onChange: redraw },
  { id: S.GUIDES_GROUPS, category: [CAT, "Guides", "6"], name: "Align to group edges too",
    type: "boolean", defaultValue: DEFAULTS[S.GUIDES_GROUPS], onChange: redraw },
  { id: S.GUIDES_SNAP, category: [CAT, "Guides", "7"], name: "Snap on release (hold Shift to skip)",
    type: "boolean", defaultValue: DEFAULTS[S.GUIDES_SNAP] },
  { id: S.GUIDES_COLOR, category: [CAT, "Guides", "8"], name: "Edge extension color (#hex)",
    type: "text", defaultValue: DEFAULTS[S.GUIDES_COLOR], onChange: redraw },
  { id: S.GUIDES_MATCH_COLOR, category: [CAT, "Guides", "9"], name: "Match color (#hex)",
    type: "text", defaultValue: DEFAULTS[S.GUIDES_MATCH_COLOR], onChange: redraw },

  { id: S.GAP_ON, category: [CAT, "Spacing", "1"], name: "Spacing magnet: pull nodes to an exact gap",
    type: "boolean", defaultValue: DEFAULTS[S.GAP_ON], onChange: redraw },
  { id: S.GAP_RADIUS, category: [CAT, "Spacing", "2"], name: "Spacing magnet radius (screen px)",
    tooltip: "How far (in screen pixels) from the exact gap a node may be released and still be pulled to it. The orange dimension line shows that the magnet has caught.\nAlignment of edges is set separately: Guides → Alignment threshold.",
    type: "slider", attrs: { min: 2, max: 80, step: 1 }, defaultValue: DEFAULTS[S.GAP_RADIUS], onChange: redraw },
  { id: S.GAP_CELL, category: [CAT, "Spacing", "3"], name: "Grid cell size (px)",
    tooltip: "Sets the cell size in px at 100% zoom.\nValue above 0 — the cell is exactly this size. For example, with 20 a gap of “3 cells” = 60 px.\nValue 0 — no own size is set, the cell is taken from the ComfyUI setting “Snap to grid size” (Settings → Lite Graph → Canvas, key Comfy.SnapToGrid.GridSize). It is 10 by default. If ComfyUI does not provide this value, 10 is used.",
    type: "number", attrs: { min: 0, max: 500, step: 1 }, defaultValue: DEFAULTS[S.GAP_CELL], onChange: redraw },
  { id: S.GAP_NODE_X, category: [CAT, "Spacing", "4"], name: "Gap between nodes, horizontal (cells)",
    type: "number", attrs: { min: 0, max: 100, step: 1 }, defaultValue: DEFAULTS[S.GAP_NODE_X], onChange: redraw },
  { id: S.GAP_NODE_Y, category: [CAT, "Spacing", "5"], name: "Gap between nodes, vertical (cells)",
    type: "number", attrs: { min: 0, max: 100, step: 1 }, defaultValue: DEFAULTS[S.GAP_NODE_Y], onChange: redraw },
  { id: S.GAP_GROUP_X, category: [CAT, "Spacing", "6"], name: "Gap between nodes of side-by-side groups (cells)",
    tooltip: "Measured between the nodes closest to the facing group edges",
    type: "number", attrs: { min: 0, max: 100, step: 1 }, defaultValue: DEFAULTS[S.GAP_GROUP_X], onChange: redraw },
  { id: S.GAP_GROUP_Y, category: [CAT, "Spacing", "7"], name: "Gap between nodes of stacked groups (cells)",
    tooltip: "Measured between the nodes closest to the facing group edges; includes the group header",
    type: "number", attrs: { min: 0, max: 100, step: 1 }, defaultValue: DEFAULTS[S.GAP_GROUP_Y], onChange: redraw },
  { id: S.GAP_COLOR, category: [CAT, "Spacing", "8"], name: "Spacing indicator color (#hex)",
    type: "text", defaultValue: DEFAULTS[S.GAP_COLOR], onChange: redraw },

  { id: S.PALETTE, category: [CAT, "Colors", "1"], name: "Swatch palette (#hex, comma separated)",
    type: "text", defaultValue: DEFAULTS[S.PALETTE] },
  { id: S.BODY_SHIFT, category: [CAT, "Colors", "2"], name: "Body lightness shift vs header, % (“from header” mode)",
    type: "slider", attrs: { min: -80, max: 80, step: 1 }, defaultValue: DEFAULTS[S.BODY_SHIFT] },
  { id: S.AUTO_COLOR, category: [CAT, "Colors", "3"], name: "Color new nodes by color rules",
    tooltip: "Rules are edited in the canvas menu: Draftsman → Theme & color rules…",
    type: "boolean", defaultValue: DEFAULTS[S.AUTO_COLOR] },
  { id: S.COPY_PASTE, category: [CAT, "Colors", "4"], name: "Show “Copy / Paste colors” in context menus",
    tooltip: "Extended mode. The format painter covers clicking nodes one by one; Copy / Paste also pastes a style into the whole selection at once and keeps it between workflow tabs.",
    type: "boolean", defaultValue: DEFAULTS[S.COPY_PASTE] },
  { id: S.PRESETS, category: [CAT, "Colors", "4"], name: "Saved pairs", type: "hidden", defaultValue: DEFAULTS[S.PRESETS] },
  { id: S.RULES, category: [CAT, "Colors", "5"], name: "Color rules", type: "hidden", defaultValue: DEFAULTS[S.RULES] },

  { id: S.NUDGE_ON, category: [CAT, "Layout", "1"], name: "Move selection with arrow keys (1 cell; Shift — big step)",
    type: "boolean", defaultValue: DEFAULTS[S.NUDGE_ON] },
  { id: S.NUDGE_BIG, category: [CAT, "Layout", "2"], name: "Big arrow step with Shift (cells)",
    type: "number", attrs: { min: 1, max: 50, step: 1 }, defaultValue: DEFAULTS[S.NUDGE_BIG] },
  { id: S.GROUP_PAD, category: [CAT, "Layout", "3"], name: "Group padding around nodes for “Fit group” (cells)",
    tooltip: "Plus the group header on top. With 1 cell and 1 cell between groups, nodes of neighbouring groups end up 3 cells apart side by side and 6 cells apart stacked",
    type: "number", attrs: { min: 0, max: 20, step: 1 }, defaultValue: DEFAULTS[S.GROUP_PAD] },
  { id: S.LINKS_FOCUS, category: [CAT, "Links", "1"], name: "Highlight the links of the selection and of the hovered slot",
    tooltip: "The links of the selected nodes are drawn bright and on top, the other links are dimmed. Hovering an input or output highlights only its links.",
    type: "boolean", defaultValue: DEFAULTS[S.LINKS_FOCUS], onChange: redraw },
  { id: S.LINKS_DIM, category: [CAT, "Links", "2"], name: "Opacity of the other links meanwhile, %",
    type: "slider", attrs: { min: 0, max: 100, step: 5 }, defaultValue: DEFAULTS[S.LINKS_DIM], onChange: redraw },
  { id: S.LINKS_ANIM, category: [CAT, "Links", "3"], name: "Animate the highlighted links (a comet from output to input)",
    tooltip: "The comets are drawn on their own transparent layer at the screen rate; the graph is not redrawn for them. Turn it off if even that is too much for the computer.",
    type: "boolean", defaultValue: DEFAULTS[S.LINKS_ANIM], onChange: redraw },
  { id: S.LINKS_SPEED, category: [CAT, "Links", "4"], name: "Animation speed (px per second)",
    type: "slider", attrs: { min: 20, max: 600, step: 20 }, defaultValue: DEFAULTS[S.LINKS_SPEED] },
  { id: S.LINKS_INOUT, category: [CAT, "Links", "5"], name: "Different colors for incoming and outgoing links",
    tooltip: "Off — the highlighted links keep the color of their data type.",
    type: "boolean", defaultValue: DEFAULTS[S.LINKS_INOUT], onChange: redraw },
  { id: S.LINKS_IN_COLOR, category: [CAT, "Links", "6"], name: "Incoming links color (#hex)",
    type: "text", defaultValue: DEFAULTS[S.LINKS_IN_COLOR], onChange: redraw },
  { id: S.LINKS_OUT_COLOR, category: [CAT, "Links", "7"], name: "Outgoing links color (#hex)",
    type: "text", defaultValue: DEFAULTS[S.LINKS_OUT_COLOR], onChange: redraw },
  { id: S.TIPS_ON, category: [CAT, "Tooltips", "1"], name: "Styled tooltips for node outputs",
    tooltip: "Nodes that describe their outputs (e.g. Rigstools) get a short title and coloured lines about the current value in the output tooltip: green — what comes out, amber — a substitute or a problem, grey — a note. Other tooltips are not changed.",
    type: "boolean", defaultValue: DEFAULTS[S.TIPS_ON] },
  { id: S.MIGRATED, category: [CAT, "Layout", "9"], name: "Settings migrated from NodeTheme", type: "hidden",
    defaultValue: DEFAULTS[S.MIGRATED] },
];

// keep the declared order inside each section (higher sortOrder is shown first)
SETTINGS_DEF.forEach((s, i) => { s.sortOrder = 1000 - i; });

// ───────────────────────────── color utils ─────────────────────────────

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
let _cctx = null;

function parseColor(str) {
  if (!str || typeof str !== "string") return null;
  let s = str.trim();
  if (s[0] !== "#") {
    _cctx ??= document.createElement("canvas").getContext("2d");
    _cctx.fillStyle = "#010203";
    _cctx.fillStyle = s;
    s = _cctx.fillStyle;
    if (s === "#010203" && str.trim().toLowerCase() !== "#010203") return null;
    if (s[0] !== "#") {
      const m = s.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const p = m[1].split(",").map(parseFloat);
      return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 };
    }
  }
  s = s.slice(1);
  if (s.length === 3 || s.length === 4) s = s.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(s)) return null;
  return {
    r: parseInt(s.slice(0, 2), 16),
    g: parseInt(s.slice(2, 4), 16),
    b: parseInt(s.slice(4, 6), 16),
    a: s.length === 8 ? parseInt(s.slice(6, 8), 16) / 255 : 1,
  };
}

const toHex = ({ r, g, b }) =>
  "#" + [r, g, b].map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0")).join("");
const normHex = (str) => { const c = parseColor(str); return c ? toHex(c) : null; };

function rgb2hsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return { h, s, l };
}

function hsl2rgb({ h, s, l }) {
  if (s === 0) return { r: l * 255, g: l * 255, b: l * 255 };
  const hue = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return { r: hue(p, q, h + 1 / 3) * 255, g: hue(p, q, h) * 255, b: hue(p, q, h - 1 / 3) * 255 };
}

/** pct < 0 — darker, pct > 0 — lighter. */
function shiftLightness(hex, pct) {
  const c = parseColor(hex);
  if (!c) return hex;
  const hsl = rgb2hsl(c);
  const k = clamp(pct, -100, 100) / 100;
  hsl.l = k < 0 ? hsl.l * (1 + k) : hsl.l + (1 - hsl.l) * k;
  return toHex(hsl2rgb(hsl));
}

function relLum(hex) {
  const c = parseColor(hex);
  if (!c) return 0;
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
}
const readableText = (hex) => (relLum(hex) > 0.35 ? "#111" : "#eee");

function withAlpha(hex, a, fallback = "#888888") {
  const c = parseColor(hex) || parseColor(fallback);
  return `rgba(${c.r | 0},${c.g | 0},${c.b | 0},${a})`;
}

// ───────────────────────────── graph helpers ─────────────────────────────

const LG = () => globalThis.LiteGraph ?? {};
const canvasOf = () => app.canvas;
const graphOf = () => app.canvas?.graph ?? app.graph;
const allNodes = (g = graphOf()) => (g?._nodes ?? g?.nodes ?? []).filter(Boolean);
const allGroups = (g = graphOf()) => (g?._groups ?? g?.groups ?? []).filter(Boolean);
const isGroup = (it) => !!it && typeof it.recomputeInsideNodes === "function";
const isNode = (it) => !!it && !isGroup(it) && Array.isArray(it.inputs ?? it.outputs) && !!it.size;

function getSelectedNodes(canvas = canvasOf()) {
  const sel = canvas?.selected_nodes;
  let nodes = sel ? Object.values(sel) : [];
  if (!nodes.length && canvas?.selectedItems) nodes = [...canvas.selectedItems].filter(isNode);
  return nodes.filter(Boolean);
}

function getSelectedGroups(canvas = canvasOf()) {
  if (canvas?.selectedItems) return [...canvas.selectedItems].filter(isGroup);
  return canvas?.selected_group ? [canvas.selected_group] : [];
}

const _tmp = new Float32Array(4);
function nodeRect(node) {
  // measure() is computed from pos/size right now; cached bounding rects lag a frame
  // and are empty for nodes that were never rendered (off-screen / just created).
  if (typeof node.measure === "function" && !node.flags?.collapsed) {
    try {
      const out = [0, 0, 0, 0];
      node.measure(out);
      if (Number.isFinite(out[2]) && out[2] > 0) return out;
    } catch {}
  }
  try {
    if (typeof node.getBounding === "function") {
      const r = node.getBounding(_tmp);
      if (r && Number.isFinite(r[2])) return [r[0], r[1], r[2], r[3]];
    }
  } catch {}
  try {
    const r = node.boundingRect;
    if (r && Number.isFinite(r[2])) return [r[0], r[1], r[2], r[3]];
  } catch {}
  const th = LG().NODE_TITLE_HEIGHT ?? 30;
  const collapsed = node.flags?.collapsed;
  const w = collapsed ? node._collapsed_width || 80 : node.size[0];
  const h = collapsed ? 0 : node.size[1];
  return [node.pos[0], node.pos[1] - th, w, h + th];
}

function groupRect(g) {
  try {
    const r = g.boundingRect ?? g._bounding;
    if (r && Number.isFinite(r[2])) return [r[0], r[1], r[2], r[3]];
  } catch {}
  return [g.pos[0], g.pos[1], g.size[0], g.size[1]];
}

const intersects = (a, b) => a[0] <= b[0] + b[2] && a[0] + a[2] >= b[0] && a[1] <= b[1] + b[3] && a[1] + a[3] >= b[1];
const centreInside = (r, g) => {
  const cx = r[0] + r[2] / 2, cy = r[1] + r[3] / 2;
  return cx >= g[0] && cx <= g[0] + g[2] && cy >= g[1] && cy <= g[1] + g[3];
};
const containsRect = (a, b) => b[0] >= a[0] && b[1] >= a[1] && b[0] + b[2] <= a[0] + a[2] && b[1] + b[3] <= a[1] + a[3];
const overlap1 = (a0, a1, b0, b1) => Math.min(a1, b1) - Math.max(a0, b0);

/** Innermost group (from `groups`) containing the centre of rect r. */
function innermostGroup(r, groups) {
  let best = null, area = Infinity;
  for (const g of groups) {
    const gr = groupRect(g);
    if (centreInside(r, gr) && gr[2] * gr[3] < area) { best = g; area = gr[2] * gr[3]; }
  }
  return best;
}

const nodesInGroup = (group) => { const gr = groupRect(group); return allNodes().filter((n) => centreInside(nodeRect(n), gr)); };
const groupOfNode = (node) => (node ? innermostGroup(nodeRect(node), allGroups()) : null);

function groupChildren(g) {
  if (g._children instanceof Set && g._children.size) return [...g._children];
  if (Array.isArray(g._nodes) && g._nodes.length) return [...g._nodes];
  return nodesInGroup(g);
}

function beginChange() { try { graphOf()?.beforeChange?.(); } catch {} }
function endChange() {
  try { graphOf()?.afterChange?.(); } catch {}
  try {
    const ct = app.extensionManager?.workflow?.activeWorkflow?.changeTracker;
    if (ct?.captureCanvasState) ct.captureCanvasState();
    else ct?.checkState?.();
  } catch {}
  redraw();
}

function toast(summary, detail, severity = "info") {
  try {
    if (app.extensionManager?.toast?.add) {
      app.extensionManager.toast.add({ severity, summary, detail, life: 2500 });
      return;
    }
  } catch {}
  console.info(`[Draftsman] ${summary}${detail ? ": " + detail : ""}`);
}

// ───────────────────────────── color targets (nodes / groups) ─────────────────────────────

function setNodeField(node, key, value) {
  if (value === undefined || value === null) {
    node[key] = undefined;
    if (Object.prototype.hasOwnProperty.call(node, key)) delete node[key];
  } else node[key] = value;
}

const groupDefault = () => LG().LGraphGroup?.defaultColour ?? "#3f789e";

/** Group body colour; also reads the key written by the old NodeTheme version. */
const groupBody = (g) => g.flags?.[GROUP_BODY] ?? g.flags?.[GROUP_BODY_LEGACY];

const KINDS = {
  nodes: {
    get: (o, part) => (part === "head" ? o.color : o.bgcolor),
    set: (o, part, v) => setNodeField(o, part === "head" ? "color" : "bgcolor", v),
    shownDefault: (o, part) => (part === "head" ? LG().NODE_DEFAULT_COLOR ?? "#353535" : LG().NODE_DEFAULT_BGCOLOR ?? "#353535"),
  },
  groups: {
    get: (o, part) => (part === "head" ? o.color : groupBody(o)),
    set: (o, part, v) => {
      if (part === "head") { o.color = v ?? undefined; return; }
      if (o.flags) delete o.flags[GROUP_BODY_LEGACY];
      if (v === undefined || v === null) { if (o.flags) delete o.flags[GROUP_BODY]; }
      else { o.flags = o.flags || {}; o.flags[GROUP_BODY] = v; }
    },
    // stock look: the body uses the header color
    shownDefault: (o, part) => (part === "head" ? groupDefault() : o?.color ?? groupDefault()),
  },
};

function builtinPairs() {
  const nc = canvasOf()?.constructor?.node_colors ?? globalThis.LGraphCanvas?.node_colors ?? {};
  return Object.entries(nc)
    .filter(([, v]) => v && v.color && v.bgcolor)
    .map(([name, v]) => ({ name, h: normHex(v.color) ?? v.color, b: normHex(v.bgcolor) ?? v.bgcolor, builtin: true }));
}

function userPairs() {
  try {
    const raw = getSetting(S.PRESETS);
    const arr = typeof raw === "string" ? JSON.parse(raw || "[]") : raw;
    return Array.isArray(arr) ? arr.filter((p) => p && p.h && p.b) : [];
  } catch {
    return [];
  }
}
const saveUserPairs = (arr) => setSetting(S.PRESETS, JSON.stringify(arr));
const paletteList = () => String(getSetting(S.PALETTE) || "").split(/[\s,;]+/).map(normHex).filter(Boolean);

// ── clipboard / quick actions ──
let colorClipboard = null;

function copyColors(kind, obj) {
  const k = KINDS[kind];
  colorClipboard = { head: k.get(obj, "head"), body: k.get(obj, "body") };
  toast(t("copied"), t("copiedD", { h: colorClipboard.head ?? "—", b: colorClipboard.body ?? "—" }));
}

function pasteColors(kind, items) {
  if (!colorClipboard || !items.length) return;
  const k = KINDS[kind];
  beginChange();
  for (const o of items) { k.set(o, "head", colorClipboard.head); k.set(o, "body", colorClipboard.body); }
  endChange();
}

function resetColors(kind, items) {
  if (!items.length) return;
  const k = KINDS[kind];
  beginChange();
  for (const o of items) { k.set(o, "head", undefined); k.set(o, "body", undefined); }
  endChange();
}

// ───────────────────────────── group rendering (separate header / body) ─────────────────────────────

function drawGroupCustom(g, gc, ctx, body) {
  const L = LG();
  const G = g.constructor;
  const TH = L.NODE_TITLE_HEIGHT ?? 30;
  const fs = L.GROUP_TEXT_SIZE ?? g.font_size ?? 24;
  const [x, y] = g._pos ?? g.pos;
  const [w, hgt] = g._size ?? g.size;
  const ea = gc?.editor_alpha ?? 1;
  const head = g.color || G.defaultColour || "#3f789e";
  const rl = G.resizeLength ?? 10;

  ctx.save();
  // body (below the header) — same 25% tint the stock group uses
  ctx.globalAlpha = 0.25 * ea;
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.rect(x + 0.5, y + 0.5 + TH, w, Math.max(0, hgt - TH));
  ctx.fill();
  // header — stock header is two 25% layers ≈ 44%
  ctx.globalAlpha = 0.4375 * ea;
  ctx.fillStyle = head;
  ctx.beginPath();
  ctx.rect(x + 0.5, y + 0.5, w, TH);
  ctx.fill();
  // frame + resize handle in the body color
  ctx.globalAlpha = ea;
  ctx.strokeStyle = body;
  ctx.beginPath();
  ctx.rect(x + 0.5, y + 0.5, w, hgt);
  ctx.stroke();
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(x + w, y + hgt);
  ctx.lineTo(x + w - rl, y + hgt);
  ctx.lineTo(x + w, y + hgt - rl);
  ctx.fill();
  // title
  const c = parseColor(head);
  const lum255 = c ? 0.299 * c.r + 0.587 * c.g + 0.114 * c.b : 255;
  ctx.font = `${fs}px ${L.GROUP_FONT ?? "Arial"}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = lum255 < (G.darkBgLuminanceThreshold ?? 80) ? shiftLightness(head, 55) : head;
  ctx.fillText((g.title ?? "") + (g.pinned ? "📌" : ""), x + fs / 2, y + TH / 2 + 1);
  ctx.textBaseline = "alphabetic";
  // selection outline like the stock one
  if ((L.highlight_selected_group ?? true) && g.selected) {
    const pad = G.padding ?? 4;
    const b = groupRect(g);
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = L.NODE_BOX_OUTLINE_COLOR ?? "#fff";
    ctx.beginPath();
    ctx.rect(b[0] - pad, b[1] - pad, b[2] + 2 * pad, b[3] + 2 * pad);
    ctx.stroke();
  }
  ctx.restore();
}

function patchGroupDraw() {
  const G = LG().LGraphGroup ?? globalThis.LGraphGroup ?? allGroups()[0]?.constructor;
  const proto = G?.prototype;
  if (!proto?.draw || proto.draw.__nt) return;
  const orig = proto.draw;
  const wrapped = function (gc, ctx) {
    const body = groupBody(this);
    if (!body) return orig.apply(this, arguments);
    try { drawGroupCustom(this, gc, ctx, body); }
    catch (e) { console.error("[Draftsman] group draw", e); return orig.apply(this, arguments); }
  };
  wrapped.__nt = true;
  proto.draw = wrapped;
}

// ───────────────────────────── dialog ─────────────────────────────

const CSS = `
.node-tooltip .dm-tip-lines{margin-top:6px;display:flex;flex-direction:column;gap:3px;white-space:normal}
.node-tooltip .dm-tip-line{display:flex;gap:6px;align-items:flex-start}
.node-tooltip .dm-tip-line svg{flex:0 0 auto;margin-top:2px}

.dm-dlg{position:fixed;z-index:10050;width:340px;max-width:calc(100vw - 16px);max-height:calc(100vh - 16px);overflow:hidden;
  display:flex;flex-direction:column;
  background:var(--comfy-menu-bg,#202020);color:var(--fg-color,#ddd);border:1px solid var(--border-color,#444);
  border-radius:10px;box-shadow:0 10px 32px rgba(0,0,0,.45);font:13px/1.35 system-ui,-apple-system,Segoe UI,sans-serif;user-select:none}
.dm-dlg *{box-sizing:border-box}
.dm-dlg:focus{outline:none}
.dm-head{display:flex;align-items:center;gap:8px;padding:9px 12px;cursor:move;border-bottom:1px solid var(--border-color,#444);font-weight:600}
.dm-head span{flex:1}
.dm-x{background:none;border:0;color:inherit;font-size:18px;cursor:pointer;opacity:.7;line-height:1}
.dm-x:hover{opacity:1}
.dm-body{padding:10px 12px;display:flex;flex-direction:column;gap:12px;overflow:auto;min-height:0;flex:1 1 auto}
.dm-head,.dm-foot{flex:none}
.dm-row{display:flex;align-items:center;gap:8px}
.dm-row label{opacity:.75;white-space:nowrap}
.dm-dlg select,.dm-dlg input[type=text]{background:var(--comfy-input-bg,#151515);color:inherit;border:1px solid var(--border-color,#444);
  border-radius:6px;padding:4px 6px;font:inherit;min-width:0}
.dm-dlg select{flex:1}
.dm-pv{border-radius:8px;overflow:hidden;border:1px solid rgba(0,0,0,.4);box-shadow:0 2px 8px rgba(0,0,0,.3)}
.dm-pv.dm-pv-g{border-radius:2px;background:#161616;box-shadow:none}
.dm-pv-t{padding:6px 10px;font-weight:600;display:flex;align-items:center;gap:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dm-pv-t i{width:9px;height:9px;border-radius:50%;background:currentColor;opacity:.6;flex:none}
.dm-pv-g .dm-pv-t i{display:none}
.dm-pv-b{padding:8px 10px;display:flex;flex-direction:column;gap:5px}
.dm-pv-b div{height:14px;border-radius:7px;background:rgba(0,0,0,.25)}
.dm-pv-g .dm-pv-b div{height:22px;border-radius:4px;background:#2a2a2a;width:46%}
.dm-pv-b div:nth-child(2){width:70%}
.dm-sec{display:flex;flex-direction:column;gap:6px}
.dm-sec.dm-off .dm-sw,.dm-sec.dm-off .dm-cust{opacity:.35;pointer-events:none}
.dm-sh{display:flex;align-items:center;gap:8px}
.dm-sh b{font-weight:600}
.dm-sp{flex:1}
/* buttons use the ComfyUI design tokens, so they match Run / dialogs in any theme */
.dm-btn{background:var(--secondary-background,#262729);color:var(--base-foreground,#fff);border:0;border-radius:8px;
  padding:4px 9px;font:inherit;font-size:12px;cursor:pointer;white-space:nowrap;transition:background-color .15s}
.dm-btn:hover{background:var(--secondary-background-hover,#313235)}
.dm-btn:focus-visible{outline:none;box-shadow:0 0 0 1px var(--border-default,#494a50)}
.dm-btn.dm-pri{background:var(--primary-background,#0b8ce9);color:var(--base-foreground,#fff)}
.dm-btn.dm-pri:hover{background:var(--primary-background-hover,#31b9f4)}
.dm-sw{display:grid;grid-template-columns:repeat(9,1fr);gap:5px}
.dm-c{aspect-ratio:1;border-radius:5px;cursor:pointer;border:1px solid rgba(255,255,255,.12);position:relative}
.dm-c:hover{transform:scale(1.12)}
.dm-c.dm-on{outline:2px solid var(--fg-color,#fff);outline-offset:1px}
.dm-cust{display:flex;gap:6px;align-items:center}
/* "custom color" button: rainbow wheel with the current color inside; the native picker sits on top, invisible */
.dm-wheel{position:relative;flex:none;width:26px;height:26px;border-radius:50%;cursor:pointer;
  background:conic-gradient(#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00);display:flex;align-items:center;justify-content:center;
  transition:transform .12s}
.dm-wheel:hover{transform:scale(1.1)}
.dm-wheel::after{content:"";width:12px;height:12px;border-radius:50%;background:var(--comfy-menu-bg,#202020);pointer-events:none}
.dm-wheel input[type=color]{position:absolute;inset:0;width:100%;height:100%;opacity:0;padding:0;border:0;cursor:pointer}
.dm-hexbox{position:relative;display:flex;align-items:center}
.dm-cust .dm-hexbox input[type=text]{width:112px;padding-left:26px;font-family:ui-monospace,Consolas,monospace}
.dm-chip{position:absolute;left:6px;top:50%;transform:translateY(-50%);width:14px;height:14px;border-radius:3px;
  border:1px solid rgba(255,255,255,.12);pointer-events:none;background:transparent}
.dm-chip.dm-chip-none{background:repeating-conic-gradient(#555 0 25%,#333 0 50%) 0 0/6px 6px}
.dm-link{display:flex;align-items:center;gap:8px;font-size:12px}
.dm-link label{display:flex;align-items:center;gap:6px;white-space:nowrap;cursor:pointer}
/* slider + number field in the style of ComfyUI Settings */
.dm-sl{position:relative;flex:1;min-width:60px;height:14px;display:flex;align-items:center;cursor:pointer;touch-action:none}
.dm-sl-track{position:relative;width:100%;height:2px;border-radius:9999px;
  background:color-mix(in srgb,var(--muted-foreground,#8a8a8a) 20%,transparent)}
.dm-sl-range{position:absolute;top:0;bottom:0;left:0;background:var(--muted-foreground,#8a8a8a)}
.dm-sl-thumb{position:absolute;top:50%;width:14px;height:14px;border-radius:9999px;transform:translate(-50%,-50%);
  background:var(--muted-foreground,#8a8a8a);box-shadow:0 1px 3px rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);cursor:grab;
  transition:box-shadow .15s}
.dm-sl:hover .dm-sl-thumb,.dm-sl-thumb:focus-visible{box-shadow:0 0 0 2px var(--base-foreground,#fff);outline:none}
.dm-sl.dm-drag .dm-sl-thumb{cursor:grabbing}
.dm-num{display:flex;align-items:center;height:32px;width:100px;flex:none;border-radius:8px;
  background:var(--secondary-background,#262729);color:var(--base-foreground,#fff)}
.dm-num:hover{background:var(--secondary-background-hover,#313235)}
.dm-num:focus-within{box-shadow:0 0 0 1px var(--border-default,#494a50)}
.dm-num button{flex:none;width:24px;height:100%;border:0;background:transparent;color:var(--muted-foreground,#8a8a8a);
  cursor:pointer;font-size:15px;line-height:1;padding:0}
.dm-num button:first-child{border-radius:8px 0 0 8px}.dm-num button:last-child{border-radius:0 8px 8px 0}
.dm-num button:hover{background:var(--secondary-background-hover,#313235);color:var(--base-foreground,#fff)}
.dm-dlg .dm-num input{flex:1;min-width:0;width:100%;height:100%;border:0;background:transparent;color:inherit;
  text-align:center;font:inherit;font-size:13px;padding:0;outline:none}
.dm-pr{display:grid;grid-template-columns:repeat(9,1fr);gap:5px}
.dm-p{aspect-ratio:1;border-radius:5px;overflow:hidden;cursor:pointer;border:1px solid rgba(255,255,255,.15);display:flex;flex-direction:column;position:relative}
.dm-p.dm-on{outline:2px solid var(--fg-color,#fff);outline-offset:1px}
.dm-btn.dm-plus{width:24px;padding:3px 0;font-size:14px;line-height:1;text-align:center}
.dm-p span:first-child{height:40%}.dm-p span:last-child{flex:1}
.dm-p:hover{transform:scale(1.1)}
.dm-p .dm-del{position:absolute;top:-1px;right:1px;font-size:11px;line-height:1;color:#fff;text-shadow:0 0 2px #000;display:none}
.dm-p:hover .dm-del{display:block}
.dm-foot{display:flex;justify-content:flex-end;gap:8px;padding:10px 12px;border-top:1px solid var(--border-color,#444)}
.dm-foot .dm-btn{padding:5px 14px;font-size:13px}
.dm-hint{font-size:11px;opacity:.55}
.dm-ring{display:inline-block;flex:none;width:14px;height:14px;border-radius:50%;
  background:radial-gradient(circle,var(--comfy-menu-bg,#202020) 0 38%,transparent 40%),conic-gradient(#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)}
.litemenu-entry.dm-mi-ring::before{content:"";display:inline-block;width:12px;height:12px;margin-right:6px;border-radius:50%;
  vertical-align:-1px;background:radial-gradient(circle,var(--comfy-menu-bg,#222) 0 36%,transparent 38%),conic-gradient(#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)}
/* section label, in the spirit of rgthree's menu labels: darker band, bold text */
.litegraph.litecontextmenu .litemenu-entry.dm-mi-title,.litemenu-entry.dm-mi-title{opacity:1 !important;cursor:default;pointer-events:none;
  font-weight:700;color:#dde !important;background-color:#212121 !important;margin:0;padding:4px 6px}
.dm-badge{position:fixed;z-index:10060;pointer-events:none;display:flex;align-items:center;gap:6px;padding:4px 8px;border-radius:6px;
  background:var(--comfy-menu-bg,#202020);color:var(--fg-color,#ddd);border:1px solid var(--border-color,#444);
  font:12px system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.4);white-space:nowrap}
.dm-theme{width:400px}
.dm-rules{display:flex;flex-direction:column;gap:6px}
.dm-rule{display:flex;align-items:center;gap:6px}
.dm-rule input[type=text]{flex:1;min-width:0;font-family:ui-monospace,Consolas,monospace}
.dm-rsample{width:22px;height:22px;flex:none;border-radius:4px;overflow:hidden;display:flex;flex-direction:column;border:1px solid rgba(255,255,255,.15)}
.dm-rsample span:first-child{height:40%}.dm-rsample span:last-child{flex:1}
.dm-empty{padding:6px 0}
.dm-suggest{position:fixed;z-index:10070;overflow-y:auto;padding:4px;border-radius:8px;
  background:var(--comfy-menu-bg,#202020);border:1px solid var(--border-color,#444);box-shadow:0 8px 24px rgba(0,0,0,.45);
  font:12px ui-monospace,Consolas,monospace;color:var(--fg-color,#ddd)}
.dm-sg{padding:4px 8px;border-radius:5px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dm-sg.dm-on{background:var(--secondary-background-hover,#313235)}
.litemenu-entry.dm-hk{display:flex;align-items:center}
.litemenu-entry.dm-hk::after{margin-left:auto;padding-left:18px;opacity:.5;font-size:.92em;white-space:nowrap}
.litemenu-entry.dm-mi-icon::before{content:"";display:inline-block;width:14px;height:14px;margin-right:5px;vertical-align:-2px;
  background:center/contain no-repeat}
`;

// menu icons drawn by us (emoji differ per OS: grey set-square, vertical magnet on Windows)
const svgUrl = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
const setSquare = (c, ticks) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">` +
  `<path fill="${c}" fill-rule="evenodd" d="M1.5 1.5v13h13zM4 7.6v4.4h4.4z"/>` +
  `<path stroke="${ticks}" stroke-width="1" d="M1.5 4.5h1.6M1.5 7h1M1.5 9.5h1.6M1.5 12h1"/></svg>`;
const magnet = (body, tips) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">` +
  `<path stroke="${body}" stroke-width="3.2" d="M11 3.6H7a4.4 4.4 0 0 0 0 8.8h4"/>` +
  `<path stroke="${tips}" stroke-width="3.2" d="M11 3.6h3.4M11 12.4h3.4"/></svg>`;
const alignIcon = (c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">` +
  `<path stroke="${c}" stroke-width="1.6" stroke-linecap="round" d="M2 1.5v13"/>` +
  `<rect x="4.2" y="3" width="9.5" height="3.6" rx="1" fill="${c}"/><rect x="4.2" y="9.4" width="6" height="3.6" rx="1" fill="${c}"/></svg>`;
const fitIcon = (c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round">` +
  `<path d="M1.5 5V1.5H5M11 1.5h3.5V5M14.5 11v3.5H11M5 14.5H1.5V11"/><rect x="4.5" y="4.5" width="7" height="7" rx="1" fill="${c}" stroke="none"/></svg>`;
const brushIcon = (c, tip) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">` +
  `<path stroke="${c}" stroke-width="2.2" d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/>` +
  `<path fill="${tip}" stroke="${tip}" stroke-width="1.6" d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg>`;
// Lucide "drafting-compass" — same outline style as the other Settings sidebar icons
const DRAFTING_COMPASS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" ` +
  `stroke-linecap="round" stroke-linejoin="round"><path d="m12.99 6.74 1.93 3.44"/><path d="M19.136 12a10 10 0 0 1-14.271 0"/>` +
  `<path d="m21 21-2.16-3.84"/><path d="m3 21 8.02-14.26"/><circle cx="12" cy="5" r="2"/></svg>`;
const MENU_ICON_CSS = `
.litemenu-entry.dm-mi-layout::before{background-image:${svgUrl(alignIcon("#7fb2ff"))}}
.litemenu-entry.dm-mi-fit::before{background-image:${svgUrl(fitIcon("#7fb2ff"))}}
.litemenu-entry.dm-mi-brush::before{background-image:${svgUrl(brushIcon("#c9a26b", "#ff4fd8"))}}
/* settings sidebar: replace the generic folder icon of our category */
[data-nav-id="root/Draftsman"] > i{-webkit-mask-image:${svgUrl(DRAFTING_COMPASS)} !important;mask-image:${svgUrl(DRAFTING_COMPASS)} !important}
body.dm-painting canvas,body.dm-painting [data-node-id]{cursor:url("data:image/svg+xml,${encodeURIComponent(brushIcon("#ddd", "#ff4fd8").replace('viewBox="0 0 24 24"', 'viewBox="0 0 24 24" width="22" height="22"'))}") 2 20, copy !important}
.litemenu-entry.dm-mi-guides-on::before{background-image:${svgUrl(setSquare("#f5c518", "#7a5c00"))}}
.litemenu-entry.dm-mi-guides-off::before{background-image:${svgUrl(setSquare("#8a8a8a", "#4a4a4a"))}}
.litemenu-entry.dm-mi-gap-on::before{background-image:${svgUrl(magnet("#e5484d", "#d0d0d0"))}}
.litemenu-entry.dm-mi-gap-off::before{background-image:${svgUrl(magnet("#8a8a8a", "#5e5e5e"))}}
`;

function injectCss() {
  if (document.getElementById("dm-style")) return;
  const st = document.createElement("style");
  st.id = "dm-style";
  st.textContent = CSS + MENU_ICON_CSS;
  document.head.appendChild(st);
}

const lastPointer = { x: innerWidth / 2, y: innerHeight / 3 };
addEventListener("pointermove", (e) => { lastPointer.x = e.clientX; lastPointer.y = e.clientY; }, { passive: true, capture: true });

const h = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") el.className = v;
    else if (k === "style") el.style.cssText = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (v !== undefined && v !== null && v !== false) el.setAttribute(k, v === true ? "" : v);
  }
  for (const kid of kids.flat()) if (kid !== null && kid !== undefined) el.append(kid);
  return el;
};

/** Slider + "− value +" number field, styled like the ComfyUI Settings slider. */
function makeSlider({ min, max, step = 1, value, onInput, onCommit }) {
  let v = clamp(Math.round(value / step) * step, min, max);
  const range = h("div", { class: "dm-sl-range" });
  const thumb = h("div", { class: "dm-sl-thumb", role: "slider", tabindex: "0", "aria-valuemin": min, "aria-valuemax": max });
  const slider = h("div", { class: "dm-sl" }, h("div", { class: "dm-sl-track" }, range), thumb);
  const input = h("input", { type: "text", inputmode: "numeric", spellcheck: "false" });

  const paint = () => {
    const pct = ((v - min) / (max - min)) * 100;
    range.style.width = `${pct}%`;
    thumb.style.left = `calc(${pct}% + ${7 - (pct / 100) * 14}px)`; // keep the thumb inside the track
    thumb.setAttribute("aria-valuenow", v);
    if (document.activeElement !== input) input.value = String(v);
  };
  const set = (nv, commit = false) => {
    nv = Math.round(Number(nv) / step) * step;
    if (!Number.isFinite(nv)) nv = v;
    nv = clamp(nv, min, max);
    const changed = nv !== v;
    v = nv;
    paint();
    if (changed) onInput?.(v);
    if (commit) onCommit?.(v);
  };
  const fromEvent = (e) => {
    const r = slider.getBoundingClientRect();
    return min + clamp((e.clientX - r.left) / r.width, 0, 1) * (max - min);
  };

  slider.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    slider.setPointerCapture?.(e.pointerId);
    slider.classList.add("dm-drag");
    thumb.focus({ preventScroll: true });
    set(fromEvent(e));
    const move = (ev) => set(fromEvent(ev));
    const up = (ev) => {
      slider.classList.remove("dm-drag");
      slider.removeEventListener("pointermove", move);
      slider.removeEventListener("pointerup", up);
      slider.removeEventListener("pointercancel", up);
      set(fromEvent(ev), true);
    };
    slider.addEventListener("pointermove", move);
    slider.addEventListener("pointerup", up);
    slider.addEventListener("pointercancel", up);
  });
  thumb.addEventListener("keydown", (e) => {
    const d = { ArrowLeft: -step, ArrowDown: -step, ArrowRight: step, ArrowUp: step, PageDown: -10 * step, PageUp: 10 * step }[e.key];
    if (d !== undefined) { e.preventDefault(); set(v + d, true); }
    else if (e.key === "Home") { e.preventDefault(); set(min, true); }
    else if (e.key === "End") { e.preventDefault(); set(max, true); }
  });

  input.addEventListener("input", () => { if (/^-?\d+$/.test(input.value.trim())) set(input.value); });
  input.addEventListener("change", () => { set(input.value, true); input.value = String(v); });
  input.addEventListener("blur", () => { input.value = String(v); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      set(v + (e.key === "ArrowUp" ? step : -step), true);
      input.value = String(v);
    }
  });
  const btn = (txt, d, label) => h("button", {
    type: "button", tabindex: "-1", "aria-label": label,
    onclick: () => { set(v + d, true); input.value = String(v); },
  }, txt);
  const number = h("div", { class: "dm-num", role: "group" }, btn("−", -step, "Decrement"), input, btn("+", step, "Increment"));

  paint();
  return { slider, number, get value() { return v; }, set };
}

let activeDialog = null;

class ColorDialog {
  /**
   * @param {{kind?: "nodes"|"groups", items?: any[], group?: any, scope?: string}} opts
   *   kind  — what is being colored
   *   items — explicit set (otherwise the current selection)
   *   group — context group (nodes: "all nodes of the group" scope; groups: the group itself)
   */
  constructor({ kind = "nodes", items, group, scope } = {}) {
    injectCss();
    this.kind = kind;
    this.k = KINDS[kind];
    if (kind === "nodes") {
      this.selection = items ?? getSelectedNodes();
      this.primary = this.selection[0] ?? (group ? nodesInGroup(group)[0] : null) ?? null;
      this.group = group ?? groupOfNode(this.primary);
      this.scope = scope ?? (group && !this.selection.length ? "group" : "selected");
    } else {
      this.selection = items ?? getSelectedGroups();
      if (!this.selection.length && group) this.selection = [group];
      this.primary = this.selection[0] ?? null;
      this.group = group ?? this.primary;
      this.scope = scope ?? "selected";
    }
    this.part = { head: { action: "keep", value: null }, body: { action: "keep", value: null } };
    this.link = false;
    this.shift = Number(getSetting(S.BODY_SHIFT)) || 0;
    this.snap = new Map();

    beginChange();
    this.build();
    this.refresh();
  }

  targets() {
    if (this.kind === "groups") return this.scope === "all" ? allGroups() : this.selection;
    switch (this.scope) {
      case "type": return this.primary ? allNodes().filter((n) => n.type === this.primary.type) : [];
      case "group": return this.group ? nodesInGroup(this.group) : [];
      case "all": return allNodes();
      default: return this.selection;
    }
  }

  resolve(part, snap) {
    const p = this.part[part];
    if (p.action === "set") return p.value;
    if (p.action === "reset") return undefined;
    return snap[part];
  }

  apply() {
    const k = this.k;
    const targets = new Set(this.targets());
    for (const [obj, s] of this.snap) {
      if (!targets.has(obj)) { k.set(obj, "head", s.head); k.set(obj, "body", s.body); this.snap.delete(obj); }
    }
    for (const o of targets) {
      if (!this.snap.has(o)) this.snap.set(o, { head: k.get(o, "head"), body: k.get(o, "body") });
      const s = this.snap.get(o);
      const head = this.resolve("head", s);
      let body = this.resolve("body", s);
      if (this.link) {
        const base = head ?? k.shownDefault(o, "head");
        body = base ? shiftLightness(base, this.shift) : body;
      }
      k.set(o, "head", head);
      k.set(o, "body", body);
    }
    redraw();
  }

  restore() {
    for (const [obj, s] of this.snap) { this.k.set(obj, "head", s.head); this.k.set(obj, "body", s.body); }
    this.snap.clear();
    redraw();
  }

  build() {
    const scopeSel = h("select", { onchange: (e) => { this.scope = e.target.value; this.refresh(); } });
    const add = (value, text, enabled = true) => { if (enabled) scopeSel.append(h("option", { value }, text)); };
    if (this.kind === "nodes") {
      add("selected", t("scSelNodes"), this.selection.length > 0);
      add("type", t("scType", { type: this.primary?.type ?? "" }), !!this.primary);
      add("group", t("scGroupNodes", { title: this.group?.title ?? "" }), !!this.group);
      add("all", t("scAllNodes"));
    } else {
      add("selected", this.selection.length === 1 ? t("scOneGroup", { title: this.selection[0].title ?? "" }) : t("scSelGroups"),
        this.selection.length > 0);
      add("all", t("scAllGroups"));
    }
    scopeSel.value = this.scope;
    if (scopeSel.value !== this.scope) this.scope = scopeSel.value;
    const previewTitle = h("div", { class: "dm-sh" }, h("b", {}, t("preview")));

    const title = this.primary?.title ?? (this.kind === "groups" ? "Group" : "Node");
    this.pvTitle = h("div", { class: "dm-pv-t" }, h("i"), h("span", {}, title));
    this.pvBody = h("div", { class: "dm-pv-b" }, h("div"), h("div"));
    this.pvInner = h("div", {}, this.pvTitle, this.pvBody);
    const preview = h("div", { class: "dm-pv" + (this.kind === "groups" ? " dm-pv-g" : "") }, this.pvInner);
    this.preview = preview;

    this.sec = { head: this.buildPart("head", t("header")), body: this.buildPart("body", t("body")) };

    this.linkBox = h("input", { type: "checkbox", onchange: (e) => { this.link = e.target.checked; this.refresh(); } });
    const slider = makeSlider({
      min: -80, max: 80, step: 1, value: this.shift,
      onInput: (v) => { this.shift = v; this.refresh(); },
      onCommit: (v) => setSetting(S.BODY_SHIFT, v),
    });
    this.sec.body.root.insertBefore(
      h("div", { class: "dm-link", title: t("fromHeaderTip") },
        h("label", {}, this.linkBox, t("fromHeader")), slider.slider, slider.number),
      this.sec.body.root.children[1],
    );

    this.presetsEl = h("div", { class: "dm-pr" });
    const presets = h("div", { class: "dm-sec" },
      h("div", { class: "dm-sh" }, h("b", {}, t("pairs")), h("span", { class: "dm-sp" }),
        h("button", { class: "dm-btn dm-plus", title: t("saveTip"), onclick: () => this.savePair() }, "+"),
        h("button", { class: "dm-btn", title: t("pairsKeepTip"), onclick: () => this.setBoth("keep") }, t("keep")),
        h("button", { class: "dm-btn", title: t("pairsResetTip"), onclick: () => this.setBoth("reset") }, t("reset"))),
      this.presetsEl);

    const head = h("div", { class: "dm-head" }, h("i", { class: "dm-ring" }), h("span", {}, t(this.kind === "groups" ? "dlgGroups" : "dlgNodes")),
      h("button", { class: "dm-x", title: t("cancelEsc"), onclick: () => this.close(false) }, "×"));

    this.el = h("div", { class: "dm-dlg", tabindex: "-1" },
      head,
      h("div", { class: "dm-body" },
        h("div", { class: "dm-row" }, h("label", {}, t("applyTo")), scopeSel),
        h("div", { class: "dm-sec" }, previewTitle, preview),
        this.sec.head.root,
        this.sec.body.root,
        presets),
      h("div", { class: "dm-foot" },
        h("button", { class: "dm-btn", onclick: () => this.close(false) }, t("cancel")),
        h("button", { class: "dm-btn dm-pri", onclick: () => this.close(true) }, t("apply"))));

    this.renderPresets();
    document.body.append(this.el);
    this.place();
    this.makeDraggable(head);

    this.onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); this.close(false); }
      else if (e.key === "Enter" && e.target?.tagName !== "BUTTON") { e.preventDefault(); e.stopPropagation(); this.close(true); }
    };
    document.addEventListener("keydown", this.onKey, true);
    this.el.addEventListener("keydown", (e) => e.stopPropagation());
    this.el.addEventListener("pointerdown", (e) => e.stopPropagation());
    this.el.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });
    this.el.focus({ preventScroll: true });
  }

  buildPart(part, title) {
    const reset = h("button", { class: "dm-btn", title: t("resetTip"), onclick: () => this.setPart(part, "reset") }, t("reset"));
    const keep = h("button", { class: "dm-btn", title: t("keepTip"), onclick: () => this.setPart(part, "keep") }, t("keep"));
    const sw = h("div", { class: "dm-sw" });
    const swatches = paletteList().map((c) => {
      const el = h("div", { class: "dm-c", title: c, style: `background:${c}`, onclick: () => this.setPart(part, "set", c) });
      el.dataset.c = c;
      sw.append(el);
      return el;
    });
    const picker = h("input", { type: "color", oninput: (e) => this.setPart(part, "set", e.target.value, picker) });
    const wheel = h("label", { class: "dm-wheel", title: t("custom") }, picker);
    const chip = h("span", { class: "dm-chip" });
    const hex = h("input", {
      type: "text", placeholder: "#RRGGBB", spellcheck: "false",
      onchange: (e) => { const v = normHex(e.target.value); if (v) this.setPart(part, "set", v, hex); else e.target.value = ""; },
      oninput: (e) => {
        const raw = e.target.value.trim();
        if (/^#?[0-9a-f]{6}$/i.test(raw)) this.setPart(part, "set", normHex(raw.replace(/^#?/, "#")), hex);
      },
    });
    const root = h("div", { class: "dm-sec" },
      h("div", { class: "dm-sh" }, h("b", {}, title), h("span", { class: "dm-sp" }), keep, reset),
      sw,
      h("div", { class: "dm-cust" }, wheel, h("div", { class: "dm-hexbox" }, chip, hex), h("span", { class: "dm-hint" }, t("custom"))));
    return { root, swatches, picker, chip, hex };
  }

  setPart(part, action, value = null, source = null) {
    this.part[part] = { action, value };
    if (part === "body" && action !== "keep") { this.link = false; this.linkBox.checked = false; }
    this.refresh(source);
  }

  shown(part) {
    const first = this.targets()[0];
    if (!first) return this.part[part].value ?? undefined;
    return this.k.get(first, part) ?? this.k.shownDefault(first, part);
  }

  refresh(source = null) {
    this.apply();
    const targets = this.targets();

    const hc = this.shown("head");
    const bc = this.shown("body");
    if (this.kind === "groups") {
      // mimic the canvas rendering: translucent header & body over the dark background
      this.pvTitle.style.background = withAlpha(hc, 0.44);
      this.pvTitle.style.color = relLum(hc) < 0.1 ? shiftLightness(hc, 55) : hc;
      this.pvBody.style.background = withAlpha(bc, 0.25);
      this.preview.style.border = `1px solid ${bc}`;
    } else {
      this.pvTitle.style.background = hc;
      this.pvTitle.style.color = readableText(hc);
      this.pvBody.style.background = bc;
    }

    for (const part of ["head", "body"]) {
      const sec = this.sec[part];
      const p = this.part[part];
      const linked = part === "body" && this.link;
      sec.root.classList.toggle("dm-off", linked);
      const cur = normHex(part === "head" ? hc : bc);
      // current color goes to the hex field (placeholder when not explicitly set; "mixed" when targets differ)
      const vals = new Set(targets.map((o) => normHex(this.k.get(o, part) ?? this.k.shownDefault(o, part))));
      sec.hex.placeholder = p.action === "keep" && !linked && vals.size > 1 ? t("mixed") : (cur ?? "#RRGGBB");
      for (const s of sec.swatches) s.classList.toggle("dm-on", p.action === "set" && s.dataset.c === cur);
      if (cur && source !== sec.picker) sec.picker.value = cur;
      sec.chip.style.background = cur ?? "";
      sec.chip.classList.toggle("dm-chip-none", !cur);
      if (source !== sec.hex) sec.hex.value = p.action === "set" && !linked ? p.value : "";
    }
    if (this.presetsEl) this.markPairs();
  }

  renderPresets() {
    this.presetsEl.replaceChildren();
    const mk = (p, idx) => {
      const el = h("div", {
        class: "dm-p",
        title: `${p.name ? p.name + ": " : ""}${t("pairTip", { h: p.h, b: p.b })}${p.builtin ? "" : "\n" + t("pairDel")}`,
        onclick: () => {
          this.part.head = { action: "set", value: normHex(p.h) ?? p.h };
          this.part.body = { action: "set", value: normHex(p.b) ?? p.b };
          this.link = false; this.linkBox.checked = false;
          this.refresh();
        },
      }, h("span", { style: `background:${p.h}` }), h("span", { style: `background:${p.b}` }));
      el.dataset.h = normHex(p.h) ?? "";
      el.dataset.b = normHex(p.b) ?? "";
      if (!p.builtin) {
        const del = (e) => {
          e.preventDefault(); e.stopPropagation();
          const arr = userPairs(); arr.splice(idx, 1);
          saveUserPairs(arr).then(() => this.renderPresets());
        };
        el.addEventListener("contextmenu", del);
        el.append(h("span", { class: "dm-del", onclick: del }, "×"));
      }
      return el;
    };
    userPairs().forEach((p, i) => this.presetsEl.append(mk(p, i)));
    builtinPairs().forEach((p) => this.presetsEl.append(mk(p)));
    this.markPairs();
  }

  /** Outline the pair that matches the explicitly chosen header + body. */
  markPairs() {
    const hp = this.part.head, bp = this.part.body;
    const hh = hp.action === "set" ? normHex(hp.value) : null;
    const bb = bp.action === "set" && !this.link ? normHex(bp.value) : null;
    for (const el of this.presetsEl.children) {
      el.classList.toggle("dm-on", !!hh && !!bb && el.dataset.h === hh && el.dataset.b === bb);
    }
  }

  setBoth(action) {
    this.part.head = { action, value: null };
    this.part.body = { action, value: null };
    this.link = false;
    this.linkBox.checked = false;
    this.refresh();
  }

  async savePair() {
    const hc = normHex(this.shown("head"));
    const bc = normHex(this.shown("body"));
    if (!hc || !bc) { toast(t("nothingSave"), t("nothingSaveD"), "warn"); return; }
    const arr = userPairs().filter((p) => !(p.h === hc && p.b === bc));
    arr.unshift({ h: hc, b: bc });
    await saveUserPairs(arr.slice(0, 40));
    this.renderPresets();
  }

  place() {
    const r = this.el.getBoundingClientRect();
    this.el.style.left = `${clamp(lastPointer.x + 12, 8, innerWidth - r.width - 8)}px`;
    this.el.style.top = `${clamp(lastPointer.y - 20, 8, innerHeight - r.height - 8)}px`;
  }

  makeDraggable(handle) {
    handle.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button")) return;
      const r = this.el.getBoundingClientRect();
      const dx = e.clientX - r.left, dy = e.clientY - r.top;
      const move = (ev) => {
        this.el.style.left = `${clamp(ev.clientX - dx, 0, innerWidth - 40)}px`;
        this.el.style.top = `${clamp(ev.clientY - dy, 0, innerHeight - 30)}px`;
      };
      const up = () => { removeEventListener("pointermove", move); removeEventListener("pointerup", up); };
      addEventListener("pointermove", move);
      addEventListener("pointerup", up);
    });
  }

  close(commit) {
    if (this.closed) return;
    this.closed = true;
    if (!commit) this.restore();
    document.removeEventListener("keydown", this.onKey, true);
    this.el.remove();
    endChange();
    if (activeDialog === this) activeDialog = null;
  }
}

function openColorDialog(opts = {}) {
  activeDialog?.close(false);
  const kind = opts.kind ?? "nodes";
  const items = opts.items ?? (kind === "nodes" ? getSelectedNodes() : getSelectedGroups());
  if (!items.length && !opts.group && opts.scope !== "all") {
    toast(t("noSel"), t("noSelD"));
    return;
  }
  activeDialog = new ColorDialog({ ...opts, kind, items });
}

/** Hotkey: nodes if any are selected, otherwise selected groups. */
function openForSelection() {
  if (getSelectedNodes().length) return openColorDialog({ kind: "nodes" });
  if (getSelectedGroups().length) return openColorDialog({ kind: "groups" });
  toast(t("noSel"), t("noSelD"));
}

// ───────────────────────────── layout engine: alignment + spacing ─────────────────────────────

const drag = { down: false, active: false, start: new Map() };

const cellSize = () => {
  const own = Number(getSetting(S.GAP_CELL));
  if (own > 0) return own;
  return Number(LG().CANVAS_GRID_SIZE) || Number(rawSetting("Comfy.SnapToGrid.GridSize")) || 10;
};

/** What moves when the selection is dragged: selected nodes + everything inside selected groups. */
function movingSet(canvas) {
  const nodes = new Set(getSelectedNodes(canvas).filter((n) => !n.pinned && !n.flags?.pinned));
  const groups = new Set();
  const others = new Set(); // reroutes etc. inside groups
  const selGroups = getSelectedGroups(canvas).filter((g) => !g.pinned);
  for (const g of selGroups) {
    groups.add(g);
    for (const ch of groupChildren(g)) {
      if (isGroup(ch)) groups.add(ch);
      else if (isNode(ch)) nodes.add(ch);
      else others.add(ch);
    }
  }
  // nested groups that _children didn't report (legacy)
  for (const g of selGroups) {
    const gr = groupRect(g);
    for (const g2 of allGroups(canvas.graph)) if (g2 !== g && containsRect(gr, groupRect(g2))) groups.add(g2);
  }
  return { nodes: [...nodes], groups: [...groups], others: [...others] };
}

function unionRect(rects) {
  let l = Infinity, tp = Infinity, r = -Infinity, b = -Infinity;
  for (const q of rects) {
    l = Math.min(l, q[0]); tp = Math.min(tp, q[1]);
    r = Math.max(r, q[0] + q[2]); b = Math.max(b, q[1] + q[3]);
  }
  return { l, t: tp, r, b };
}

/**
 * For both axes finds the smallest correction d (graph units) that makes the moving
 * selection either aligned with something (edges/centres) or spaced at the exact gap.
 * Returns everything needed to draw the indicators for that correction.
 */
function computeLayout(canvas) {
  const ms = movingSet(canvas);
  if (!ms.nodes.length && !ms.groups.length) return null;
  const movingNodes = new Set(ms.nodes);
  const movingGroups = new Set(ms.groups);
  const mRects = ms.nodes.map(nodeRect);
  const box = unionRect([...mRects, ...ms.groups.map(groupRect)]);
  const scale = canvas.ds?.scale || 1;

  const va = canvas.visible_area;
  const view = va && va[2] > 0
    ? [va[0] - va[2] * 0.5, va[1] - va[3] * 0.5, va[2] * 2, va[3] * 2]
    : [-1e9, -1e9, 2e9, 2e9];

  const staticGroups = allGroups(canvas.graph).filter((g) => !movingGroups.has(g));
  const staticNodes = [];
  for (const n of allNodes(canvas.graph)) {
    if (movingNodes.has(n)) continue;
    const r = nodeRect(n);
    staticNodes.push({ n, r, vis: intersects(r, view) });
  }

  const res = { box, scale, x: [], y: [] };

  // ── alignment candidates ──
  const tolA = Number(getSetting(S.GUIDES_THRESHOLD)) / scale;
  const idx = getSetting(S.GUIDES_CENTERS) ? [0, 1, 2] : [0, 2];
  const aTargets = staticNodes.filter((s) => s.vis).map((s) => s.r);
  if (getSetting(S.GUIDES_GROUPS)) for (const g of staticGroups) { const r = groupRect(g); if (intersects(r, view)) aTargets.push(r); }
  const bx = [box.l, (box.l + box.r) / 2, box.r];
  const by = [box.t, (box.t + box.b) / 2, box.b];
  for (const r of aTargets) {
    const tx = [r[0], r[0] + r[2] / 2, r[0] + r[2]];
    const ty = [r[1], r[1] + r[3] / 2, r[1] + r[3]];
    for (const i of idx) for (const j of idx) {
      const dx = tx[j] - bx[i];
      if (Math.abs(dx) <= tolA) res.x.push({ type: "align", d: dx, pos: tx[j], lo: Math.min(r[1], box.t), hi: Math.max(r[1] + r[3], box.b), rect: r });
      const dy = ty[j] - by[i];
      if (Math.abs(dy) <= tolA) res.y.push({ type: "align", d: dy, pos: ty[j], lo: Math.min(r[0], box.l), hi: Math.max(r[0] + r[2], box.r), rect: r });
    }
  }

  // ── spacing candidates ──
  if (getSetting(S.GAP_ON) && ms.nodes.length) {
    const tolG = Number(getSetting(S.GAP_RADIUS)) / scale;
    const cell = cellSize();
    const gNX = Number(getSetting(S.GAP_NODE_X)) * cell;
    const gNY = Number(getSetting(S.GAP_NODE_Y)) * cell;
    const gGX = Number(getSetting(S.GAP_GROUP_X)) * cell;
    const gGY = Number(getSetting(S.GAP_GROUP_Y)) * cell;

    // contexts: the innermost group a node lives in (null = loose node)
    const staticCtx = new Map();
    const ext = new Map(); // group -> extremes of its static nodes
    const bump = (map, g, r) => {
      if (!g) return;
      let e = map.get(g);
      if (!e) { e = { l: Infinity, r: -Infinity, t: Infinity, b: -Infinity }; map.set(g, e); }
      e.l = Math.min(e.l, r[0]); e.r = Math.max(e.r, r[0] + r[2]);
      e.t = Math.min(e.t, r[1]); e.b = Math.max(e.b, r[1] + r[3]);
    };
    for (const s of staticNodes) {
      const g = innermostGroup(s.r, staticGroups);
      staticCtx.set(s, g);
      bump(ext, g, s.r);
    }
    const mGroupsArr = ms.groups;
    const moving = ms.nodes.map((n, i) => {
      const r = mRects[i];
      // a node that travels with a dragged group belongs to it; otherwise to the static group it is over
      const g = innermostGroup(r, mGroupsArr) ?? innermostGroup(r, staticGroups);
      return { n, r, g };
    });
    const mExt = new Map();
    for (const m of moving) bump(mExt, m.g, m.r);

    const related = (a, b) => a === b || (a && b && (containsRect(groupRect(a), groupRect(b)) || containsRect(groupRect(b), groupRect(a))));
    const E = 0.5;

    for (const m of moving) {
      const mr = m.r;
      const ml = mr[0], mR = mr[0] + mr[2], mt = mr[1], mB = mr[1] + mr[3];
      const mcx = (ml + mR) / 2, mcy = (mt + mB) / 2;
      for (const s of staticNodes) {
        if (!s.vis) continue;
        const sr = s.r;
        const sl = sr[0], sR = sr[0] + sr[2], st = sr[1], sB = sr[1] + sr[3];
        const cs = staticCtx.get(s);
        const same = related(m.g, cs);
        const CM = m.g ? groupRect(m.g) : mr;
        const CS = cs ? groupRect(cs) : sr;

        // ── horizontal neighbours ──
        {
          const ok = same ? overlap1(mt, mB, st, sB) > 0 : overlap1(CM[1], CM[1] + CM[3], CS[1], CS[1] + CS[3]) > 0;
          if (ok) {
            const right = (sl + sR) / 2 > mcx;
            const gap = same ? gNX : gGX;
            let good = true;
            if (!same) {
              // measured between the nodes closest to the facing group edges
              if (cs && Math.abs((right ? ext.get(cs).l : ext.get(cs).r) - (right ? sl : sR)) > E) good = false;
              if (m.g && Math.abs((right ? mExt.get(m.g).r : mExt.get(m.g).l) - (right ? mR : ml)) > E) good = false;
            }
            const dx = right ? sl - gap - mR : sR + gap - ml;
            if (good && !same && m.g && ext.has(m.g)) {
              // moving inside a static group: after the shift this node must still be its group's outermost one
              const e = ext.get(m.g);
              if (right ? e.r > mR + dx + E : e.l < ml + dx - E) good = false;
            }
            if (good && Math.abs(dx) <= tolG) {
              const ov0 = Math.max(mt, st), ov1 = Math.min(mB, sB);
              const yLine = ov1 > ov0 ? (ov0 + ov1) / 2 : (mcy + (st + sB) / 2) / 2;
              res.x.push({ type: "gap", d: dx, a: right ? sl - gap : sR, b: right ? sl : sR + gap, at: yLine, cells: gap / cell, rect: sr,
                dist: Math.abs(mcy - (st + sB) / 2) });
            }
          }
        }
        // ── vertical neighbours ──
        {
          const ok = same ? overlap1(ml, mR, sl, sR) > 0 : overlap1(CM[0], CM[0] + CM[2], CS[0], CS[0] + CS[2]) > 0;
          if (ok) {
            const below = (st + sB) / 2 > mcy;
            const gap = same ? gNY : gGY;
            let good = true;
            if (!same) {
              if (cs && Math.abs((below ? ext.get(cs).t : ext.get(cs).b) - (below ? st : sB)) > E) good = false;
              if (m.g && Math.abs((below ? mExt.get(m.g).b : mExt.get(m.g).t) - (below ? mB : mt)) > E) good = false;
            }
            const dy = below ? st - gap - mB : sB + gap - mt;
            if (good && !same && m.g && ext.has(m.g)) {
              const e = ext.get(m.g);
              if (below ? e.b > mB + dy + E : e.t < mt + dy - E) good = false;
            }
            if (good && Math.abs(dy) <= tolG) {
              const ov0 = Math.max(ml, sl), ov1 = Math.min(mR, sR);
              const xLine = ov1 > ov0 ? (ov0 + ov1) / 2 : (mcx + (sl + sR) / 2) / 2;
              res.y.push({ type: "gap", d: dy, a: below ? st - gap : sB, b: below ? st : sB + gap, at: xLine, cells: gap / cell, rect: sr,
                dist: Math.abs(mcx - (sl + sR) / 2) });
            }
          }
        }
      }
    }
  }

  // keep only the candidates that share the smallest correction per axis
  const pick = (list) => {
    if (!list.length) return { d: null, items: [] };
    let best = list[0].d;
    for (const c of list) if (Math.abs(c.d) < Math.abs(best)) best = c.d;
    const eps = 0.75 / scale;
    // one spacing indicator per gap: the pair whose centres are closest
    const gaps = new Map();
    const items = [];
    for (const c of list) {
      if (Math.abs(c.d - best) > eps) continue;
      if (c.type !== "gap") { items.push(c); continue; }
      const key = `${Math.round(c.a * 2)}|${Math.round(c.b * 2)}`;
      const prev = gaps.get(key);
      if (!prev || c.dist < prev.dist) gaps.set(key, c);
    }
    return { d: best, items: [...items, ...gaps.values()] };
  };
  res.x = pick(res.x);
  res.y = pick(res.y);
  res.moving = ms;
  return res;
}

function drawGuides(canvas, ctx, layer) {
  if (!getSetting(S.GUIDES_ON)) return;
  if (getSetting(S.GUIDES_DRAG_ONLY) && !drag.active) return;
  const L = computeLayout(canvas);
  if (!L) return;
  const { box, scale } = L;
  const mode = getSetting(S.GUIDES_MODE);
  const px = 1 / scale;
  const va = canvas.visible_area ?? [box.l - 2000, box.t - 2000, box.r - box.l + 4000, box.b - box.t + 4000];

  ctx.save();
  ctx.globalAlpha = 1;

  if (layer === "back" && (mode === "both" || mode === "extended")) {
    ctx.strokeStyle = withAlpha(getSetting(S.GUIDES_COLOR), 0.55, DEFAULTS[S.GUIDES_COLOR]);
    ctx.lineWidth = px;
    ctx.setLineDash([6 * px, 5 * px]);
    ctx.beginPath();
    const xs = [box.l, box.r];
    const ys = [box.t, box.b];
    if (getSetting(S.GUIDES_CENTERS)) { xs.push((box.l + box.r) / 2); ys.push((box.t + box.b) / 2); }
    for (const x of xs) { ctx.moveTo(x, va[1]); ctx.lineTo(x, va[1] + va[3]); }
    for (const y of ys) { ctx.moveTo(va[0], y); ctx.lineTo(va[0] + va[2], y); }
    ctx.stroke();
  }

  if (layer === "front") {
    const rects = new Set();
    // ── alignment matches ──
    if (mode === "both" || mode === "smart") {
      const col = getSetting(S.GUIDES_MATCH_COLOR);
      const pad = 16 * px;
      const ax = L.x.items.filter((c) => c.type === "align");
      const ay = L.y.items.filter((c) => c.type === "align");
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.5 * px;
      ctx.setLineDash([4 * px, 3 * px]);
      ctx.beginPath();
      for (const c of ax) { ctx.moveTo(c.pos, c.lo - pad); ctx.lineTo(c.pos, c.hi + pad); rects.add(c.rect); }
      for (const c of ay) { ctx.moveTo(c.lo - pad, c.pos); ctx.lineTo(c.hi + pad, c.pos); rects.add(c.rect); }
      ctx.stroke();
      ctx.setLineDash([]);
      const m = 3.5 * px;
      ctx.beginPath();
      for (const c of ax) for (const y of [c.lo - pad, c.hi + pad]) { ctx.moveTo(c.pos - m, y); ctx.lineTo(c.pos + m, y); }
      for (const c of ay) for (const x of [c.lo - pad, c.hi + pad]) { ctx.moveTo(x, c.pos - m); ctx.lineTo(x, c.pos + m); }
      ctx.stroke();
      ctx.strokeStyle = withAlpha(col, 0.45, DEFAULTS[S.GUIDES_MATCH_COLOR]);
      ctx.lineWidth = px;
      ctx.setLineDash([2 * px, 3 * px]);
      for (const r of rects) ctx.strokeRect(r[0] - 2 * px, r[1] - 2 * px, r[2] + 4 * px, r[3] + 4 * px);
    }
    // ── spacing indicators ──
    const gx = L.x.items.filter((c) => c.type === "gap");
    const gy = L.y.items.filter((c) => c.type === "gap");
    if (gx.length || gy.length) {
      const col = getSetting(S.GAP_COLOR);
      const tick = 5 * px;
      ctx.setLineDash([]);
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.5 * px;
      ctx.beginPath();
      for (const c of gx) {
        ctx.moveTo(c.a, c.at); ctx.lineTo(c.b, c.at);
        ctx.moveTo(c.a, c.at - tick); ctx.lineTo(c.a, c.at + tick);
        ctx.moveTo(c.b, c.at - tick); ctx.lineTo(c.b, c.at + tick);
      }
      for (const c of gy) {
        ctx.moveTo(c.at, c.a); ctx.lineTo(c.at, c.b);
        ctx.moveTo(c.at - tick, c.a); ctx.lineTo(c.at + tick, c.a);
        ctx.moveTo(c.at - tick, c.b); ctx.lineTo(c.at + tick, c.b);
      }
      ctx.stroke();
      // labels
      const fs = 11 * px;
      ctx.font = `600 ${fs}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const label = (c, x, y) => {
        const n = Math.round(c.cells * 10) / 10;
        const txt = n === 1 ? t("cell1") : t("cells", { n });
        const w = ctx.measureText(txt).width + 8 * px;
        const hh = fs + 6 * px;
        ctx.fillStyle = col;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x - w / 2, y - hh / 2, w, hh, 3 * px); else ctx.rect(x - w / 2, y - hh / 2, w, hh);
        ctx.fill();
        ctx.fillStyle = readableText(normHex(col) ?? "#ffb238");
        ctx.fillText(txt, x, y + 0.5 * px);
      };
      for (const c of gx) label(c, (c.a + c.b) / 2, c.at - 12 * px);
      for (const c of gy) label(c, c.at + 26 * px, (c.a + c.b) / 2);
    }
  }

  ctx.restore();
}

function snapSelection(canvas) {
  const L = computeLayout(canvas);
  if (!L) return;
  const dx = L.x.d ?? 0;
  const dy = L.y.d ?? 0;
  if (!dx && !dy) return;
  const { nodes, groups, others } = L.moving;
  for (const n of nodes) n.pos = [n.pos[0] + dx, n.pos[1] + dy];
  for (const g of groups) {
    const p = g._pos ?? g.pos;
    g.pos = [p[0] + dx, p[1] + dy]; // only the frame: children are moved above
  }
  for (const o of others) { try { o.move?.(dx, dy); } catch {} }
  endChange();
}

function installGuides(canvas) {
  const origFg = canvas.onDrawForeground;
  canvas.onDrawForeground = function (ctx, area) {
    const r = origFg?.apply(this, arguments);
    try { drawGuides(this, ctx, "front"); } catch (e) { console.error("[Draftsman] guides", e); }
    return r;
  };
  const origBg = canvas.onDrawBackground;
  canvas.onDrawBackground = function (ctx, area) {
    const r = origBg?.apply(this, arguments);
    try { drawGuides(this, ctx, "back"); } catch (e) { console.error("[Draftsman] guides", e); }
    return r;
  };

  if (!canvas.canvas) return;
  const takeStart = () => {
    const ms = movingSet(canvas);
    const m = new Map();
    for (const n of ms.nodes) m.set(n, [n.pos[0], n.pos[1]]);
    for (const g of ms.groups) { const p = g._pos ?? g.pos; m.set(g, [p[0], p[1]]); }
    return m;
  };
  const posOf = (o) => o._pos ?? o.pos;

  // Listen on window in the capture phase: LiteGraph stops propagation on <canvas>,
  // and with Vue nodes (Nodes 2.0) the press lands on the node's DOM element.
  // A drag is detected by the fact that the selection actually moved.
  const ignore = (tg) => tg?.closest?.("input, textarea, select, button, [contenteditable], .dm-dlg, .p-dialog, .p-menu, .litecontextmenu");
  const canvasDragging = () => {
    try { return !!(canvas.isDragging || canvas.node_dragged || canvas.state?.draggingItems); } catch { return false; }
  };
  addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || ignore(e.target)) return;
    drag.down = true;
    drag.active = false;
    drag.start = new Map();
    queueMicrotask(() => { if (drag.down && !drag.start.size) drag.start = takeStart(); });
  }, true);
  addEventListener("pointermove", (e) => {
    if (!drag.down) return;
    if (!(e.buttons & 1)) { drag.down = false; drag.active = false; return; }
    if (!drag.active) {
      if (!drag.start.size) drag.start = takeStart();
      for (const [o, p] of drag.start) {
        const q = posOf(o);
        if (q[0] !== p[0] || q[1] !== p[1]) { drag.active = true; break; }
      }
      if (!drag.active && drag.start.size && canvasDragging()) drag.active = true;
    }
    if (drag.active && getSetting(S.GUIDES_ON)) redraw();
  }, { passive: true, capture: true });
  addEventListener("pointerup", (e) => {
    if (!drag.down) return;
    const wasDrag = drag.active;
    drag.down = false;
    drag.active = false;
    drag.start = new Map();
    if (wasDrag && getSetting(S.GUIDES_ON) && getSetting(S.GUIDES_SNAP) && !e.shiftKey) {
      // after LiteGraph has finished its own handling (incl. snap-to-grid)
      setTimeout(() => snapSelection(canvas), 0);
    }
    redraw();
  }, true);
}

// ───────────────────────────── layout tools ─────────────────────────────

function moveRectTo(n, x, y) {
  const r = nodeRect(n);
  n.pos = [n.pos[0] + (x - r[0]), n.pos[1] + (y - r[1])];
}

function resizeNode(n, w, hgt) {
  let mw = 40, mh = 20;
  try { const m = n.computeSize?.(); if (m) { mw = m[0]; mh = m[1]; } } catch {}
  const size = [Math.max(w, mw), Math.max(hgt, mh)];
  if (typeof n.setSize === "function") n.setSize(size);
  else n.size = size;
}

function alignNodes(mode, nodes) {
  if (nodes.length < 2) return;
  const rects = nodes.map(nodeRect);
  const box = unionRect(rects);
  beginChange();
  nodes.forEach((n, i) => {
    const r = rects[i];
    let x = r[0], y = r[1];
    if (mode === "left") x = box.l;
    else if (mode === "right") x = box.r - r[2];
    else if (mode === "hcenter") x = (box.l + box.r) / 2 - r[2] / 2;
    else if (mode === "top") y = box.t;
    else if (mode === "bottom") y = box.b - r[3];
    else if (mode === "vcenter") y = (box.t + box.b) / 2 - r[3] / 2;
    moveRectTo(n, x, y);
  });
  endChange();
}

/** Gap from the spacing settings: node gap inside one context, group gap across groups. */
function gapBetween(a, b, axis, groups) {
  const same = innermostGroup(a, groups) === innermostGroup(b, groups);
  const key = axis === "x" ? (same ? S.GAP_NODE_X : S.GAP_GROUP_X) : (same ? S.GAP_NODE_Y : S.GAP_GROUP_Y);
  return Number(getSetting(key)) * cellSize();
}

function distributeNodes(axis, nodes) {
  if (nodes.length < 2) return;
  const groups = allGroups();
  const items = nodes.map((n) => ({ n, r: nodeRect(n) }));
  items.sort((a, b) => (axis === "x" ? a.r[0] - b.r[0] || a.r[1] - b.r[1] : a.r[1] - b.r[1] || a.r[0] - b.r[0]));
  const gaps = items.slice(1).map((it, i) => gapBetween(items[i].r, it.r, axis, groups));
  const first = items[0].r;
  let cursor = axis === "x" ? first[0] + first[2] : first[1] + first[3];
  beginChange();
  items.slice(1).forEach((it, i) => {
    if (axis === "x") { moveRectTo(it.n, cursor + gaps[i], first[1]); cursor += gaps[i] + it.r[2]; }
    else { moveRectTo(it.n, first[0], cursor + gaps[i]); cursor += gaps[i] + it.r[3]; }
  });
  endChange();
}

function sameSize(mode, nodes, ref) {
  if (nodes.length < 2) return;
  const target = ref && nodes.includes(ref)
    ? [ref.size[0], ref.size[1]]
    : [Math.max(...nodes.map((n) => n.size[0])), Math.max(...nodes.map((n) => n.size[1]))];
  beginChange();
  for (const n of nodes) {
    if (n === ref) continue;
    resizeNode(n, mode !== "h" ? target[0] : n.size[0], mode !== "w" ? target[1] : n.size[1]);
  }
  endChange();
}

/** Fit a group around its nodes with padding in grid cells (+ header on top). */
function fitGroupToNodes(g) {
  try { g.recomputeInsideNodes?.(); } catch {}
  const kids = groupChildren(g).filter((c) => isNode(c) || isGroup(c));
  if (!kids.length) return false;
  const box = unionRect(kids.map((c) => (isGroup(c) ? groupRect(c) : nodeRect(c))));
  const pad = Number(getSetting(S.GROUP_PAD)) * cellSize();
  const th = g.titleHeight ?? LG().NODE_TITLE_HEIGHT ?? 30;
  const x = box.l - pad, y = box.t - th - pad, w = box.r - box.l + 2 * pad, hgt = box.b - box.t + th + 2 * pad;
  if (typeof g.setBounds === "function") g.setBounds(x, y, w, hgt);
  else { g.pos = [x, y]; g.size = [w, hgt]; }
  try { g.recomputeInsideNodes?.(); } catch {}
  return true;
}

function fitGroups(groups) {
  if (!groups.length) return;
  beginChange();
  // inner groups first, so outer ones wrap the already fitted frames
  const sorted = [...groups].sort((a, b) => groupRect(a)[2] * groupRect(a)[3] - groupRect(b)[2] * groupRect(b)[3]);
  for (const g of sorted) fitGroupToNodes(g);
  endChange();
}

// ── arrow-key nudging ──
let nudgeTimer = null;
function nudge(dxCells, dyCells) {
  if (!getSetting(S.NUDGE_ON)) return;
  const canvas = canvasOf();
  const ms = movingSet(canvas);
  if (!ms.nodes.length && !ms.groups.length) return;
  const c = cellSize();
  const dx = dxCells * c, dy = dyCells * c;
  if (!nudgeTimer) beginChange();
  for (const n of ms.nodes) n.pos = [n.pos[0] + dx, n.pos[1] + dy];
  for (const g of ms.groups) { const p = g._pos ?? g.pos; g.pos = [p[0] + dx, p[1] + dy]; }
  for (const o of ms.others) { try { o.move?.(dx, dy); } catch {} }
  redraw();
  clearTimeout(nudgeTimer);
  nudgeTimer = setTimeout(() => { nudgeTimer = null; endChange(); }, 400);
}
const bigStep = () => Math.max(1, Number(getSetting(S.NUDGE_BIG)) || 5);

// ───────────────────────────── format painter ─────────────────────────────

const painter = { on: false, colors: null, badge: null, eatContext: false };

function startPainter(kind, obj) {
  if (!obj) { toast(t("painterNoSrc")); return; }
  const k = KINDS[kind];
  injectCss();
  stopPainter();
  painter.colors = { head: k.get(obj, "head"), body: k.get(obj, "body") };
  painter.on = true;
  document.body.classList.add("dm-painting");
  painter.badge = h("div", { class: "dm-badge" }, h("i", { class: "dm-ring" }), h("span", {}, t("painterOn")));
  document.body.append(painter.badge);
  movePainterBadge(lastPointer.x, lastPointer.y);
}

function stopPainter() {
  if (!painter.on) return;
  painter.on = false;
  document.body.classList.remove("dm-painting");
  painter.badge?.remove();
  painter.badge = null;
}

function movePainterBadge(x, y) {
  if (painter.badge) { painter.badge.style.left = `${x + 18}px`; painter.badge.style.top = `${y + 18}px`; }
}

function painterHit(e) {
  const canvas = canvasOf();
  const graph = canvas?.graph;
  if (!graph) return null;
  const domNode = e.target?.closest?.("[data-node-id]");
  if (domNode) {
    const n = graph.getNodeById?.(domNode.getAttribute("data-node-id")) ?? graph.getNodeById?.(Number(domNode.getAttribute("data-node-id")));
    if (n) return { kind: "nodes", obj: n };
  }
  if (e.target !== canvas.canvas) return undefined; // not on the canvas at all
  let pos;
  try { pos = canvas.convertEventToCanvasOffset?.(e); } catch {}
  if (!pos) {
    const r = canvas.canvas.getBoundingClientRect();
    pos = canvas.ds.convertOffsetToCanvas([e.clientX - r.left, e.clientY - r.top]);
  }
  const node = graph.getNodeOnPos?.(pos[0], pos[1], graph._nodes ?? graph.nodes);
  if (node) return { kind: "nodes", obj: node };
  const grp = graph.getGroupOnPos?.(pos[0], pos[1]);
  if (grp) return { kind: "groups", obj: grp };
  return null;
}

function installPainter() {
  addEventListener("pointermove", (e) => { if (painter.on) movePainterBadge(e.clientX, e.clientY); }, { passive: true, capture: true });
  addEventListener("pointerdown", (e) => {
    if (!painter.on) return;
    if (e.target?.closest?.(".dm-dlg, .litecontextmenu, .p-dialog")) return;
    const hit = painterHit(e);
    if (hit === undefined) return; // toolbar, sidebar etc.
    e.preventDefault();
    e.stopImmediatePropagation();
    if (e.button !== 0 || !hit) { if (e.button === 2) painter.eatContext = true; stopPainter(); return; }
    const k = KINDS[hit.kind];
    beginChange();
    k.set(hit.obj, "head", painter.colors.head);
    k.set(hit.obj, "body", painter.colors.body);
    endChange();
  }, true);
  addEventListener("contextmenu", (e) => {
    if (painter.on || painter.eatContext) { painter.eatContext = false; e.preventDefault(); e.stopImmediatePropagation(); stopPainter(); }
  }, true);
  addEventListener("keydown", (e) => { if (painter.on && e.key === "Escape") { e.preventDefault(); e.stopPropagation(); stopPainter(); } }, true);
}

function painterFromSelection() {
  const n = getSelectedNodes()[0];
  if (n) return startPainter("nodes", n);
  const g = getSelectedGroups()[0];
  if (g) return startPainter("groups", g);
  toast(t("painterNoSrc"));
}

// ───────────────────────────── color rules + theme file ─────────────────────────────

function getRules() {
  try {
    const raw = getSetting(S.RULES);
    const arr = typeof raw === "string" ? JSON.parse(raw || "[]") : raw;
    return Array.isArray(arr) ? arr.filter((r) => r && typeof r.match === "string") : [];
  } catch { return []; }
}
const saveRules = (rules) => setSetting(S.RULES, JSON.stringify(rules));

function nodeCategory(n) {
  const c = n.constructor?.category ?? LG().registered_node_types?.[n.type]?.category ?? n.constructor?.nodeData?.category ?? n.category ?? "";
  return String(c).toLowerCase();
}

function ruleFor(n, rules = getRules()) {
  const cat = nodeCategory(n);
  const type = String(n.type ?? "").toLowerCase();
  let best = null, len = -1;
  for (const r of rules) {
    const p = r.match.trim().toLowerCase();
    if (!p || !(cat.startsWith(p) || type === p)) continue;
    if (p.length > len) { best = r; len = p.length; }
  }
  return best;
}

function applyRules(nodes) {
  const rules = getRules();
  let count = 0;
  beginChange();
  for (const n of nodes) {
    const r = ruleFor(n, rules);
    if (!r) continue;
    setNodeField(n, "color", normHex(r.h) ?? undefined);
    setNodeField(n, "bgcolor", normHex(r.b) ?? undefined);
    count++;
  }
  endChange();
  return count;
}

function knownCategories() {
  const set = new Set();
  for (const T of Object.values(LG().registered_node_types ?? {})) {
    const c = T?.category;
    if (!c) continue;
    const parts = String(c).split("/");
    for (let i = 1; i <= parts.length; i++) set.add(parts.slice(0, i).join("/"));
  }
  return [...set].sort();
}

function exportTheme() {
  const data = {
    format: "draftsman-theme", version: 1,
    palette: getSetting(S.PALETTE), bodyShift: Number(getSetting(S.BODY_SHIFT)),
    pairs: userPairs(), rules: getRules(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = h("a", { href: URL.createObjectURL(blob), download: "draftsman-theme.json" });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function importTheme(done) {
  const input = h("input", { type: "file", accept: ".json,application/json", style: "display:none" });
  input.addEventListener("change", async () => {
    const f = input.files?.[0];
    input.remove();
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      if (data?.format !== "draftsman-theme") throw new Error("format");
      if (typeof data.palette === "string") await setSetting(S.PALETTE, data.palette);
      if (Number.isFinite(Number(data.bodyShift))) await setSetting(S.BODY_SHIFT, Number(data.bodyShift));
      if (Array.isArray(data.pairs)) await saveUserPairs(data.pairs.filter((p) => p && p.h && p.b));
      if (Array.isArray(data.rules)) await saveRules(data.rules.filter((r) => r && typeof r.match === "string"));
      toast(t("thImported"));
      done?.();
    } catch {
      toast(t("thBadFile"), "", "warn");
    }
  });
  document.body.append(input);
  input.click();
}

// compact, scrollable suggestion list (the native <datalist> can be taller than the screen)
let activeSuggest = null;
function attachSuggest(input, onPick) {
  let box = null, items = [], active = -1;
  const all = knownCategories();
  const close = () => { box?.remove(); box = null; active = -1; if (activeSuggest?.input === input) activeSuggest = null; };
  const pick = (v) => { input.value = v; onPick(v); close(); input.focus(); };
  const mark = () => {
    if (!box) return;
    [...box.children].forEach((el, i) => el.classList.toggle("dm-on", i === active));
    box.children[active]?.scrollIntoView({ block: "nearest" });
  };
  const render = () => {
    const q = input.value.trim().toLowerCase();
    items = q
      ? all.filter((c) => c.toLowerCase().includes(q))
        .sort((a, b) => (b.toLowerCase().startsWith(q) - a.toLowerCase().startsWith(q)) || a.localeCompare(b))
      : all.filter((c) => !c.includes("/"));
    items = items.slice(0, 200);
    if (!items.length) { close(); return; }
    if (!box) {
      box = h("div", { class: "dm-suggest" });
      box.addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); }); // keep focus in the input
      box.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });
      document.body.append(box);
      activeSuggest = { input, close };
    }
    box.replaceChildren(...items.map((c, i) => h("div", { class: "dm-sg", title: c, onclick: () => pick(c), onpointermove: () => { active = i; mark(); } }, c)));
    const r = input.getBoundingClientRect();
    const below = innerHeight - r.bottom - 8, above = r.top - 8;
    const up = below < 160 && above > below;
    box.style.left = `${r.left}px`;
    box.style.width = `${Math.max(r.width, 200)}px`;
    box.style.maxHeight = `${Math.min(240, up ? above : below)}px`;
    box.style.top = up ? "" : `${r.bottom + 2}px`;
    box.style.bottom = up ? `${innerHeight - r.top + 2}px` : "";
    active = -1;
  };
  input.addEventListener("focus", render);
  input.addEventListener("input", render);
  input.addEventListener("blur", () => setTimeout(close, 120));
  input.addEventListener("keydown", (e) => {
    if (!box) { if (e.key === "ArrowDown") { e.preventDefault(); render(); } return; }
    if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(items.length - 1, active + 1); mark(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(0, active - 1); mark(); }
    else if (e.key === "Enter" && active >= 0) { e.preventDefault(); pick(items[active]); }
  });
}

class ThemeDialog {
  constructor() {
    injectCss();
    this.rules = getRules();
    this.build();
  }

  save() {
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => saveRules(this.rules), 250);
  }

  colorButton(value, onInput) {
    const input = h("input", { type: "color", value, oninput: (e) => onInput(e.target.value) });
    return h("label", { class: "dm-wheel", title: t("custom") }, input);
  }

  renderRules() {
    this.list.replaceChildren();
    if (!this.rules.length) { this.list.append(h("div", { class: "dm-hint dm-empty" }, t("thEmpty"))); return; }
    this.rules.forEach((r, i) => {
      const pat = h("input", {
        type: "text", value: r.match, placeholder: t("thPattern"), spellcheck: "false", autocomplete: "off",
        oninput: (e) => { r.match = e.target.value; this.save(); },
      });
      attachSuggest(pat, (v) => { r.match = v; this.save(); });
      const sample = h("div", { class: "dm-rsample" }, h("span", { style: `background:${r.h}` }), h("span", { style: `background:${r.b}` }));
      const paint = () => { sample.children[0].style.background = r.h; sample.children[1].style.background = r.b; };
      this.list.append(h("div", { class: "dm-rule" },
        pat,
        sample,
        this.colorButton(r.h, (v) => { r.h = v; paint(); this.save(); }),
        this.colorButton(r.b, (v) => { r.b = v; paint(); this.save(); }),
        h("button", { class: "dm-btn dm-plus", title: t("delTip"), onclick: () => { this.rules.splice(i, 1); this.save(); this.renderRules(); } }, "×")));
    });
  }

  addRule(rule) {
    const h0 = rule?.h ?? paletteList()[13] ?? "#27408b";
    this.rules.push({ match: rule?.match ?? "", h: h0, b: rule?.b ?? shiftLightness(h0, Number(getSetting(S.BODY_SHIFT)) || -35) });
    this.save();
    this.renderRules();
    this.list.querySelector(".dm-rule:last-child input[type=text]")?.focus();
  }

  fromSelection() {
    const n = getSelectedNodes()[0];
    if (!n) { toast(t("noSel"), t("noSelD")); return; }
    const k = KINDS.nodes;
    this.addRule({
      match: nodeCategory(n) || String(n.type ?? ""),
      h: normHex(k.get(n, "head") ?? k.shownDefault(n, "head")),
      b: normHex(k.get(n, "body") ?? k.shownDefault(n, "body")),
    });
  }

  build() {
    this.list = h("div", { class: "dm-rules" });
    const auto = h("input", { type: "checkbox", checked: !!getSetting(S.AUTO_COLOR), onchange: (e) => setSetting(S.AUTO_COLOR, e.target.checked) });
    const head = h("div", { class: "dm-head" }, h("i", { class: "dm-ring" }), h("span", {}, t("thTitle")),
      h("button", { class: "dm-x", title: t("thClose"), onclick: () => this.close() }, "×"));
    this.el = h("div", { class: "dm-dlg dm-theme", tabindex: "-1" },
      head,
      h("div", { class: "dm-body" },
        h("div", { class: "dm-sec" },
          h("div", { class: "dm-sh" }, h("b", {}, t("thRules")), h("span", { class: "dm-sp" }),
            h("button", { class: "dm-btn", title: t("thFromSelTip"), onclick: () => this.fromSelection() }, t("thFromSel")),
            h("button", { class: "dm-btn", onclick: () => this.addRule() }, t("thAdd"))),
          h("div", { class: "dm-hint" }, t("thRulesHint")),
          this.list,
          h("label", { class: "dm-link" }, auto, t("thAuto"))),
        h("div", { class: "dm-sec" },
          h("div", { class: "dm-sh" }, h("b", {}, t("thFile")), h("span", { class: "dm-sp" }),
            h("button", { class: "dm-btn", onclick: () => exportTheme() }, t("thExport")),
            h("button", { class: "dm-btn", onclick: () => importTheme(() => { this.rules = getRules(); this.renderRules(); }) }, t("thImport"))),
          h("div", { class: "dm-hint" }, t("thFileHint")))),
      h("div", { class: "dm-foot" },
        h("button", { class: "dm-btn", onclick: () => {
          saveRules(this.rules);
          const n = applyRules(allNodes());
          toast(t("thApplied"), t("thAppliedD", { n }));
        } }, t("thApply")),
        h("button", { class: "dm-btn dm-pri", onclick: () => this.close() }, t("thClose"))));
    this.renderRules();
    document.body.append(this.el);
    const r = this.el.getBoundingClientRect();
    this.el.style.left = `${clamp(lastPointer.x + 12, 8, innerWidth - r.width - 8)}px`;
    this.el.style.top = `${clamp(lastPointer.y - 20, 8, innerHeight - r.height - 8)}px`;
    ColorDialog.prototype.makeDraggable.call(this, head);
    this.onKey = (e) => {
      if (e.key !== "Escape") return;
      e.preventDefault(); e.stopPropagation();
      if (activeSuggest) activeSuggest.close(); else this.close();
    };
    document.addEventListener("keydown", this.onKey, true);
    this.el.addEventListener("keydown", (e) => e.stopPropagation());
    this.el.addEventListener("pointerdown", (e) => e.stopPropagation());
    this.el.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });
  }

  close() {
    activeSuggest?.close();
    clearTimeout(this.saveTimer);
    saveRules(this.rules);
    document.removeEventListener("keydown", this.onKey, true);
    this.el.remove();
    if (themeDialog === this) themeDialog = null;
  }
}

let themeDialog = null;
function openThemeDialog() {
  themeDialog?.close();
  themeDialog = new ThemeDialog();
}

// auto-colour newly created nodes (not the ones restored from a workflow)
let loadingGraph = false;
function onNodeCreated(node) {
  if (loadingGraph || !getSetting(S.AUTO_COLOR)) return;
  setTimeout(() => {
    if (!node.graph || node.color !== undefined || node.bgcolor !== undefined) return; // pasted with its own colors
    const r = ruleFor(node);
    if (!r) return;
    setNodeField(node, "color", normHex(r.h) ?? undefined);
    setNodeField(node, "bgcolor", normHex(r.b) ?? undefined);
    redraw();
  }, 0);
}

// ───────────────────────────── settings migration (NodeTheme → Draftsman) ─────────────────────────────

async function migrateSettings() {
  try {
    if (getSetting(S.MIGRATED)) return;
    for (const d of SETTINGS_DEF) {
      if (d.id === S.MIGRATED) continue;
      const old = rawSetting(d.id.replace(/^Draftsman\./, "NodeTheme."));
      if (old !== undefined && old !== null) await setSetting(d.id, old);
    }
    await setSetting(S.MIGRATED, true);
  } catch (e) {
    console.warn("[Draftsman] settings migration failed", e);
  }
}

// ───────────────────────────── hotkey hints in menus ─────────────────────────────

const DEFAULT_KEYS = [
    { combo: { key: "c", alt: true, shift: true }, commandId: "Draftsman.OpenColors" },
    { combo: { key: "g", alt: true, shift: true }, commandId: "Draftsman.ToggleGuides" },
    { combo: { key: "p", alt: true, shift: true }, commandId: "Draftsman.FormatPainter" },
    { combo: { key: "ArrowLeft" }, commandId: "Draftsman.NudgeLeft" },
    { combo: { key: "ArrowRight" }, commandId: "Draftsman.NudgeRight" },
    { combo: { key: "ArrowUp" }, commandId: "Draftsman.NudgeUp" },
    { combo: { key: "ArrowDown" }, commandId: "Draftsman.NudgeDown" },
    { combo: { key: "ArrowLeft", shift: true }, commandId: "Draftsman.NudgeLeftBig" },
    { combo: { key: "ArrowRight", shift: true }, commandId: "Draftsman.NudgeRightBig" },
    { combo: { key: "ArrowUp", shift: true }, commandId: "Draftsman.NudgeUpBig" },
    { combo: { key: "ArrowDown", shift: true }, commandId: "Draftsman.NudgeDownBig" },
];

const sameCombo = (a, b) => a && b && String(a.key).toLowerCase() === String(b.key).toLowerCase() &&
  !!a.ctrl === !!b.ctrl && !!a.alt === !!b.alt && !!a.shift === !!b.shift && !!a.meta === !!b.meta;

/** Current combo for a command, honouring the user's changes in Settings → Keybinding. */
function comboFor(commandId) {
  const arr = (v) => (Array.isArray(v) ? v : []);
  const custom = arr(rawSetting("Comfy.Keybinding.NewBindings")).find((k) => k?.commandId === commandId);
  if (custom?.combo) return custom.combo;
  const def = DEFAULT_KEYS.find((k) => k.commandId === commandId);
  if (!def) return null;
  const unset = arr(rawSetting("Comfy.Keybinding.UnsetBindings")).some((k) => k?.commandId === commandId && sameCombo(k.combo, def.combo));
  return unset ? null : def.combo;
}

function comboText(c) {
  if (!c) return "";
  const k = String(c.key);
  const key = k.length === 1 ? k.toUpperCase() : k.replace(/^Arrow/, "");
  return [c.ctrl && "Ctrl", c.alt && "Alt", c.shift && "Shift", c.meta && "Meta", key].filter(Boolean).join("+");
}

// One CSS rule per command, regenerated when a menu is built (bindings can change at any time)
const hkRules = new Map();
function hkClass(commandId) {
  const txt = comboText(comboFor(commandId));
  if (!txt) return "";
  const cls = "dm-hk-" + commandId.replace(/\W/g, "_");
  hkRules.set(cls, txt);
  let st = document.getElementById("dm-hk-style");
  if (!st) { st = document.createElement("style"); st.id = "dm-hk-style"; document.head.appendChild(st); }
  st.textContent = [...hkRules].map(([c, t]) => `.litemenu-entry.${c}::after{content:${JSON.stringify(t)}}`).join("\n");
  return `dm-hk ${cls}`;
}
const withKey = (item, commandId) => {
  const cls = hkClass(commandId);
  return cls ? { ...item, className: [item.className, cls].filter(Boolean).join(" ") } : item;
};

// ───────────────────────────── menus ─────────────────────────────

const countSuffix = (n) => (n > 1 ? ` (${n})` : "");

const menuTitle = () => ({ content: t("menuTitle"), disabled: true, className: "dm-mi-title" });
const ring = (item) => ({ ...item, className: [item.className, "dm-mi-ring"].filter(Boolean).join(" ") });

function toggleItems() {
  const on = getSetting(S.GUIDES_ON);
  const gap = getSetting(S.GAP_ON);
  return [
    null,
    withKey({ content: on ? t("mGuidesHide") : t("mGuidesShow"), className: `dm-mi-icon dm-mi-guides-${on ? "on" : "off"}`,
      callback: () => setSetting(S.GUIDES_ON, !on).then(redraw) }, "Draftsman.ToggleGuides"),
    null,
    withKey({ content: gap ? t("mGapOff") : t("mGapOn"), className: `dm-mi-icon dm-mi-gap-${gap ? "on" : "off"}`,
      callback: () => setSetting(S.GAP_ON, !gap).then(redraw) }, "Draftsman.ToggleSpacing"),
  ];
}

const brush = (item) => ({ ...item, className: "dm-mi-icon dm-mi-brush" });

/** "Layout ▸" submenu for the selected nodes (ref = node that was right-clicked). */
function layoutMenu(ref) {
  const sel = getSelectedNodes();
  const nodes = sel.length > 1 ? sel : [];
  const r = ref && nodes.includes(ref) ? ref : null;
  const title = r?.title ?? "";
  const opts = [
    { content: t("alLeft"), callback: () => alignNodes("left", nodes) },
    { content: t("alHCenter"), callback: () => alignNodes("hcenter", nodes) },
    { content: t("alRight"), callback: () => alignNodes("right", nodes) },
    null,
    { content: t("alTop"), callback: () => alignNodes("top", nodes) },
    { content: t("alVCenter"), callback: () => alignNodes("vcenter", nodes) },
    { content: t("alBottom"), callback: () => alignNodes("bottom", nodes) },
    null,
    { content: t("dsRow"), callback: () => distributeNodes("x", nodes) },
    { content: t("dsCol"), callback: () => distributeNodes("y", nodes) },
    null,
    { content: r ? t("szWRef", { title }) : t("szW"), callback: () => sameSize("w", nodes, r) },
    { content: r ? t("szHRef", { title }) : t("szH"), callback: () => sameSize("h", nodes, r) },
    { content: r ? t("szWHRef", { title }) : t("szWH"), callback: () => sameSize("wh", nodes, r) },
  ];
  const selGroups = getSelectedGroups();
  if (selGroups.length) opts.push(null, { content: t("mFitGroups"), callback: () => fitGroups(selGroups) });
  return {
    content: t("mLayout", { n: countSuffix(nodes.length) }), className: "dm-mi-icon dm-mi-layout",
    disabled: !nodes.length && !selGroups.length, has_submenu: true, submenu: { options: opts },
  };
}

function nodeMenuItems(node) {
  const sel = getSelectedNodes();
  const nodes = node && !sel.includes(node) ? [node] : sel.length ? sel : node ? [node] : [];
  const n = countSuffix(nodes.length);
  return [
    null,
    menuTitle(),
    withKey(ring({ content: t("mNodeColors", { n }), callback: () => openColorDialog({ kind: "nodes", items: nodes }) }), "Draftsman.OpenColors"),
    ...(getSetting(S.COPY_PASTE) ? [
      withKey(ring({ content: t("mCopy"), callback: () => node && copyColors("nodes", node) }), "Draftsman.CopyColors"),
      withKey(ring({ content: t("mPaste", { n }), disabled: !colorClipboard, callback: () => pasteColors("nodes", nodes) }), "Draftsman.PasteColors"),
    ] : []),
    ring({ content: t("mReset", { n }), callback: () => resetColors("nodes", nodes) }),
    withKey(brush({ content: t("mPainter"), callback: () => startPainter("nodes", node ?? nodes[0]) }), "Draftsman.FormatPainter"),
    null,
    layoutMenu(node),
    ...toggleItems(),
  ];
}

function groupItemsFor(group) {
  const selG = getSelectedGroups();
  const groups = selG.includes(group) && selG.length > 1 ? selG : [group];
  const title = group.title ?? "";
  return [
    { content: t("mGroupColors", { title }), callback: () => openColorDialog({ kind: "groups", items: groups, group }) },
    { content: t("mGroupNodes", { title }), callback: () => openColorDialog({ kind: "nodes", items: [], group, scope: "group" }) },
    ...(getSetting(S.COPY_PASTE) ? [
      { content: t("mGroupCopy"), callback: () => copyColors("groups", group) },
      { content: t("mGroupPaste"), disabled: !colorClipboard, callback: () => pasteColors("groups", groups) },
    ] : []),
    { content: t("mGroupReset"), callback: () => resetColors("groups", groups) },
  ].map(ring).concat([
    brush({ content: t("mPainterGroup"), callback: () => startPainter("groups", group) }),
    withKey({ content: t("mFitGroup"), className: "dm-mi-icon dm-mi-fit", callback: () => fitGroups(groups) }, "Draftsman.FitGroups"),
  ]);
}

function groupMenuItems(group) {
  return group ? [null, menuTitle(), ...groupItemsFor(group), ...toggleItems()] : [];
}

function groupAtMouse(canvas = canvasOf()) {
  const g = canvas?.graph, m = canvas?.graph_mouse;
  if (!g || !m) return null;
  try { return g.getGroupOnPos?.(m[0], m[1]) ?? null; } catch { return null; }
}

function canvasMenuItems() {
  const items = [null, menuTitle()];
  const grp = groupAtMouse();
  if (grp) items.push(...groupItemsFor(grp));
  const hasNodes = getSelectedNodes().length > 0;
  if (hasNodes) items.push(withKey(ring({ content: t("mSelNodes"), callback: () => openColorDialog({ kind: "nodes" }) }), "Draftsman.OpenColors"));
  if (!grp && getSelectedGroups().length) {
    const it = ring({ content: t("mSelGroups"), callback: () => openColorDialog({ kind: "groups" }) });
    items.push(hasNodes ? it : withKey(it, "Draftsman.OpenColors")); // the hotkey opens groups only when no nodes are selected
  }
  items.push(withKey(ring({ content: t("mTheme"), callback: () => openThemeDialog() }), "Draftsman.ThemeRules"));
  if (getSelectedNodes().length > 1 || getSelectedGroups().length) items.push(null, layoutMenu(null));
  items.push(...toggleItems());
  return items;
}

function patchProtoMenu(proto, method, make) {
  const orig = proto?.[method];
  if (typeof orig !== "function" || orig.__ntPatched) return;
  const wrapped = function (...args) {
    const opts = orig.apply(this, args) ?? [];
    try { const extra = make(...args); if (extra.length) opts.push(...extra); }
    catch (e) { console.error("[Draftsman] menu", e); }
    return opts;
  };
  wrapped.__ntPatched = true;
  proto[method] = wrapped;
}

// ───────────────────────────── registration ─────────────────────────────

// ───────────────────────────── link focus ─────────────────────────────
// The links of the selected nodes (or of the hovered input / output) are drawn bright, on top of the others and,
// optionally, with a light wave running from the output to the input (like a progress bar); the other links are
// dimmed. LiteGraph draws every link segment with canvas.renderLink(); it is wrapped to dim the others and to
// remember the paths of ours, which are then drawn again after all links.
// Performance: no canvas shadows (shadowBlur is what made a big selection lag), the settings are read once per
// frame, the reroute chains are cached while the highlighted set is the same, and the comets are drawn on their own
// overlay canvas at the screen rate — the graph itself is redrawn only when something changes.

const linkFocus = { key: "", phase: 0, segs: null, snap: null, known: new Map(), ids: null, rr: new Map(), chains: new Map(),
  hover: null, sig: "", cfg: null, chainSig: "" };

const COMET = { tail: 90, samples: 18 };   // tail length (px), points along it   // tail length (px), dots in the tail, frame rate

/** The segment as LiteGraph draws it (spline / linear / straight), as a polyline: { pts: [[x, y, distance]], len }. */
function segmentPoly(canvas, a, b, sd, ed, opts) {
  const dir = { 1: [0, -1], 2: [0, 1], 3: [-1, 0], 4: [1, 0] };
  const v = (d, dflt) => dir[d ?? dflt] ?? [0, 0];
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const dist = Math.hypot(dx, dy);
  const mode = canvas.links_render_mode;
  const L = globalThis.LiteGraph ?? {};
  const s = v(sd, 4), e = v(ed, 3);
  let raw;
  if (mode === (L.STRAIGHT_LINK ?? 0)) {
    const x1 = a[0] + 10, x2 = b[0] - 10, mx = (x1 + x2) / 2;
    raw = [a, [x1, a[1]], [mx, a[1]], [mx, b[1]], [x2, b[1]], b];
  } else if (mode === (L.LINEAR_LINK ?? 1)) {
    raw = [a, [a[0] + s[0] * 15, a[1] + s[1] * 15], [b[0] + e[0] * 15, b[1] + e[1] * 15], b];
  } else {
    const c1 = opts?.startControl ? [a[0] + opts.startControl[0], a[1] + opts.startControl[1]] : [a[0] + s[0] * dist * 0.25, a[1] + s[1] * dist * 0.25];
    const c2 = opts?.endControl ? [b[0] + opts.endControl[0], b[1] + opts.endControl[1]] : [b[0] + e[0] * dist * 0.25, b[1] + e[1] * dist * 0.25];
    raw = [];
    for (let i = 0; i <= 32; i++) {
      const t = i / 32, u = 1 - t;
      raw.push([u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0],
        u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1]]);
    }
  }
  const pts = [];
  let len = 0;
  raw.forEach((p, i) => { if (i) len += Math.hypot(p[0] - raw[i - 1][0], p[1] - raw[i - 1][1]); pts.push([p[0], p[1], len]); });
  return { pts, len };
}

/** The segment of a link (its reroute parts) at `d` px from the output: { index, part, d (px into the part) }. */
function segmentAt(parts, d) {
  let start = 0;
  for (let i = 0; i < parts.length; i++) {
    if (d <= start + parts[i].len || i === parts.length - 1) return { index: i, part: parts[i], d: d - start };
    start += parts[i].len;
  }
  return { index: 0, part: parts[0], d };
}

/** A comet as one teardrop: the round bright head, the body tapering into the tail along the link; white, fading
 *  towards the end of the tail, with a soft wider glow of the same shape under it. */
function drawComet(ctx, parts, total, head, width) {
  const { tail, samples } = COMET;
  const R = width * 0.75 + 1.2;                       // half-width of the head
  const pts = [];                                     // [x, y, half-width] from the head back along the tail
  for (let i = 0; i <= samples; i++) {
    const t = i / samples, d = head - t * tail;
    if (d < 0) break;
    if (d > total) continue;                          // the head is already in the input: the rest drains into it
    const s = segmentAt(parts, d);
    const [x, y] = pointAt(s.part.poly, s.d);
    pts.push([x, y, R * Math.pow(1 - t, 0.85)]);
  }
  if (pts.length < 2) return;
  const headIn = head <= total;
  const shape = (scale) => {
    const left = [], right = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], q = pts[Math.min(i + 1, pts.length - 1)], o = pts[Math.max(i - 1, 0)];
      let nx = -(q[1] - o[1]), ny = q[0] - o[0];
      const n = Math.hypot(nx, ny) || 1;
      nx /= n; ny /= n;
      const w = p[2] * scale;
      left.push([p[0] + nx * w, p[1] + ny * w]);
      right.push([p[0] - nx * w, p[1] - ny * w]);
    }
    const path = new Path2D();
    path.moveTo(left[0][0], left[0][1]);
    for (const p of left) path.lineTo(p[0], p[1]);
    for (let i = right.length - 1; i >= 0; i--) path.lineTo(right[i][0], right[i][1]);
    if (headIn) {                                     // the round front of the head
      const [hx, hy] = pts[0], ang = Math.atan2(left[0][1] - hy, left[0][0] - hx);
      const fwd = Math.atan2(hy - pts[1][1], hx - pts[1][0]);          // the direction the comet flies
      const ccw = Math.cos(ang + 1.5 * Math.PI - fwd) < 0;             // go round the front, not the back
      path.arc(hx, hy, R * scale, ang + Math.PI, ang + 2 * Math.PI, ccw);
    }
    path.closePath();
    return path;
  };
  const end = pts[pts.length - 1];
  const fade = (a) => {
    const g = ctx.createLinearGradient(pts[0][0], pts[0][1], end[0], end[1]);
    g.addColorStop(0, `rgba(255,255,255,${a})`);
    g.addColorStop(0.35, `rgba(255,255,255,${a * 0.6})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    return g;
  };
  ctx.fillStyle = fade(0.28);
  ctx.fill(shape(2.1));
  ctx.fillStyle = fade(0.95);
  ctx.fill(shape(1));
}

/** The point at `d` px from the start of a polyline. */
function pointAt(poly, d) {
  const pts = poly.pts;
  let lo = 0, hi = pts.length - 1;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (pts[mid][2] < d) lo = mid; else hi = mid; }
  const p = pts[lo], q = pts[hi], span = q[2] - p[2] || 1, t = Math.min(1, Math.max(0, (d - p[2]) / span));
  return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
}

function linkOf(graph, id) {
  const l = graph?.links;
  return id == null || !l ? null : (l.get ? l.get(id) : l[id]);
}

/** The slot under the mouse: { node, kind: "in" | "out", index } — the same hit boxes as the frontend. */
function hoveredSlot(c = app.canvas) {
  const node = c?.node_over;
  const m = c?.graph_mouse;
  if (!node || !m || node.flags?.collapsed) return null;
  const inRect = (x, y, rx, ry, w, h) => x >= rx && x <= rx + w && y >= ry && y <= ry + h;
  for (let i = 0; i < (node.inputs?.length ?? 0); i++) {
    const inp = node.inputs[i];
    const p = node.getInputPos?.(i);
    const w = 20 + ((inp.label?.length ?? inp.localized_name?.length ?? inp.name?.length) || 3) * 7;
    if (p && inp.link != null && inRect(m[0], m[1], p[0] - 10, p[1] - 10, w, 20)) return { node, kind: "in", index: i };
  }
  for (let i = 0; i < (node.outputs?.length ?? 0); i++) {
    const p = node.getOutputPos?.(i);
    if (p && node.outputs[i].links?.length && inRect(m[0], m[1], p[0] - 10, p[1] - 10, 40, 20)) return { node, kind: "out", index: i };
  }
  return null;
}

/** Map link id -> "in" | "out" (relative to the selection / the hovered slot); null when nothing is focused. */
function focusedLinks(c = app.canvas) {
  if (getSetting(S.LINKS_FOCUS) === false || !c?.graph) return null;
  const ids = new Map();
  const h = linkFocus.hover;
  if (h) {
    if (h.kind === "in") { const id = h.node.inputs[h.index]?.link; if (id != null) ids.set(id, "in"); }
    else for (const id of h.node.outputs[h.index]?.links ?? []) ids.set(id, "out");
    return ids.size ? throughRerouteNodes(c.graph, ids) : null;
  }
  const sel = getSelectedNodes(c);
  if (!sel.length) return null;
  for (const n of sel) {
    for (const inp of n.inputs ?? []) if (inp.link != null && !ids.has(inp.link)) ids.set(inp.link, "in");
    for (const out of n.outputs ?? []) for (const id of out.links ?? []) ids.set(id, "out");
  }
  return ids.size ? throughRerouteNodes(c.graph, ids) : null;
}

/** Reroute nodes (stock "Reroute", "Reroute (rgthree)", "ReroutePrimitive|pysssss"…) only pass a link on: their
 *  links belong to the link they continue — the same role and color, and one comet through all of them. */
const isRerouteNode = (n) => !!n && /reroute/i.test(String(n.type ?? n.comfyClass ?? ""));

function throughRerouteNodes(graph, ids) {
  const queue = [...ids.entries()];
  while (queue.length) {
    const [id, role] = queue.pop();
    const l = linkOf(graph, id);
    if (!l) continue;
    if (role === "in") {                              // up to the real source
      const src = graph.getNodeById(l.origin_id);
      if (!isRerouteNode(src)) continue;
      for (const inp of src.inputs ?? []) if (inp.link != null && !ids.has(inp.link)) { ids.set(inp.link, "in"); queue.push([inp.link, "in"]); }
    } else {                                          // down to the real targets
      const dst = graph.getNodeById(l.target_id);
      if (!isRerouteNode(dst)) continue;
      for (const out of dst.outputs ?? []) for (const nid of out.links ?? []) if (!ids.has(nid)) { ids.set(nid, "out"); queue.push([nid, "out"]); }
    }
  }
  return ids;
}

function focusColor(role, link) {
  const cfg = linkFocus.cfg;
  if (cfg ? !cfg.inout : getSetting(S.LINKS_INOUT) === false) {
    return link?.color || LGraphCanvasOf()?.link_type_colors?.[link?.type] || app.canvas?.default_link_color || "#9a9";
  }
  if (cfg) return role === "in" ? cfg.inColor : cfg.outColor;
  return safeColor(getSetting(role === "in" ? S.LINKS_IN_COLOR : S.LINKS_OUT_COLOR), role === "in" ? "#4fc3ff" : "#ffab40");
}
const LGraphCanvasOf = () => app.canvas?.constructor;
const safeColor = (v, d) => (/^#[0-9a-f]{3,8}$/i.test(String(v || "").trim()) ? String(v).trim() : d);

function installLinkFocus(canvas) {
  const proto = Object.getPrototypeOf(canvas);
  if (proto.__dmLinks) return;
  proto.__dmLinks = true;

  const renderLink = proto.renderLink;
  proto.renderLink = function (ctx, a, b, link, skipBorder, flow, color, sd, ed, opts) {
    const ids = linkFocus.ids;
    if (!ids || !link || link.id == null || link.id === -1) {
      return renderLink.apply(this, arguments);
    }
    // a segment ending at a reroute may be shared by several links: it is ours when any focused link runs through it
    const rr = opts?.reroute;
    const role = rr ? linkFocus.rr.get(rr.id) : ids.get(link.id);
    if (!role) {
      const alpha = ctx.globalAlpha;
      ctx.globalAlpha = alpha * linkFocus.cfg.dim;
      try { return renderLink.apply(this, arguments); } finally { ctx.globalAlpha = alpha; }
    }
    const r = renderLink.apply(this, arguments);
    const path = (rr ?? link).path;
    if (path && !skipBorder && a && b) {
      const poly = segmentPoly(this, a, b, sd, ed, opts);
      const seg = { path, role, link, poly, len: poly.len };
      if (rr) linkFocus.segs.reroutes.set(rr.id, seg); else linkFocus.segs.finals.set(link.id, seg);
      linkFocus.known.set(rr ? "r" + rr.id : "f" + link.id, seg);
    }
    return r;
  };

  const drawConnections = proto.drawConnections;
  proto.drawConnections = function (ctx) {
    linkFocus.cfg = {
      dim: Number(getSetting(S.LINKS_DIM) ?? 25) / 100,
      anim: getSetting(S.LINKS_ANIM) !== false,
      speed: Number(getSetting(S.LINKS_SPEED) ?? 150),
      inout: getSetting(S.LINKS_INOUT) !== false,
      inColor: safeColor(getSetting(S.LINKS_IN_COLOR), "#4fc3ff"),
      outColor: safeColor(getSetting(S.LINKS_OUT_COLOR), "#ffab40"),
    };
    linkFocus.ids = focusedLinks(this);
    // a new set of highlighted links: the waves start again from the outputs
    const sig = linkFocus.ids ? [...linkFocus.ids.keys()].join(",") : "";
    if (sig !== linkFocus.sig) { linkFocus.sig = sig; linkFocus.phase = 0; linkFocus.known = new Map(); }
    // reroutes the focused links run through (one reroute can carry several links); cached while the set is the same
    const chainSig = sig + "|" + (this.graph?.reroutes?.size ?? 0) + "|" + (this.graph?._version ?? "");
    if (chainSig !== linkFocus.chainSig) {
      linkFocus.chainSig = chainSig;
      linkFocus.rr = new Map();
      linkFocus.chains = new Map();
      for (const [id, role] of linkFocus.ids ?? []) {
        const chain = rerouteChain(this.graph, linkOf(this.graph, id));
        linkFocus.chains.set(id, chain);
        for (const r of chain) if (!linkFocus.rr.has(r.id)) linkFocus.rr.set(r.id, role);
      }
    }
    linkFocus.segs = { reroutes: new Map(), finals: new Map() };
    try { return drawConnections.apply(this, arguments); }
    finally {
      const segs = linkFocus.segs;
      linkFocus.segs = null;
      linkFocus.snap = null;
      if (linkFocus.ids && (segs.finals.size || segs.reroutes.size)) {
        try { drawFocusedLinks(this, ctx, segs); } catch (e) { console.error("[Draftsman] links", e); }
      }
      linkFocus.ids = null;
    }
  };

  // what is under the mouse changes the focus: redraw the links only when it does
  let pending = false;
  addEventListener("pointermove", () => {
    if (pending) return;
    pending = true;
    // after LiteGraph has handled the move (node_over / graph_mouse are updated by its own listener)
    requestAnimationFrame(() => { pending = false; updateHover(); });
  }, { passive: true, capture: true });
  const updateHover = () => {
    const h = getSetting(S.LINKS_FOCUS) === false ? null : hoveredSlot(canvas);
    const key = h ? `${h.node.id}:${h.kind}:${h.index}` : "";
    if (key !== linkFocus.key) {
      linkFocus.key = key;
      linkFocus.hover = h;
      canvas.setDirty?.(true, true);
    }
  };
}

/** Reroutes of a link from the output to the input. */
function rerouteChain(graph, link) {
  const chain = [];
  const seen = new Set();
  let r = link?.parentId != null ? graph?.getReroute?.(link.parentId) ?? graph?.reroutes?.get?.(link.parentId) : null;
  while (r && !seen.has(r.id)) {
    seen.add(r.id);
    chain.unshift(r);
    r = r.parentId != null ? graph.getReroute?.(r.parentId) ?? graph.reroutes?.get?.(r.parentId) : null;
  }
  return chain;
}

function drawFocusedLinks(canvas, ctx, segs) {
  const width = canvas.connections_width ?? 3;
  const cfg = linkFocus.cfg;
  const anim = cfg.anim && !canvas.low_quality;
  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.setLineDash([]);
  const all = [...segs.reroutes.values(), ...segs.finals.values()];

  // 1. every focused segment once: a soft halo (a wide translucent stroke — much cheaper than shadowBlur) and the
  //    bright line on it
  ctx.globalAlpha = 0.28;
  ctx.lineWidth = width + 6;
  for (const seg of all) { ctx.strokeStyle = focusColor(seg.role, seg.link); ctx.stroke(seg.path); }
  ctx.globalAlpha = 1;
  ctx.lineWidth = width + 1;
  for (const seg of all) { ctx.strokeStyle = focusColor(seg.role, seg.link); ctx.stroke(seg.path); }

  // 2. a comet: a bright head with a fading tail runs from the output to the input — one at a time on a link; the
  //    next one leaves the output only when the previous one (its tail too) has reached the input. Its position is
  //    measured along the whole link, through all its reroutes. Links that leave one output share one cycle (the
  //    length of the longest of them), so their comets leave together and are one comet on a shared trunk.
  if (anim) {
    const runs = [], cycle = new Map();
    const g = canvas.graph;
    const crossings = new Map();   // a reroute node: a straight piece from its input to its output (under the node)
    const across = (node) => {
      if (!crossings.has(node.id)) {
        const a = node.getInputPos?.(0), b = node.getOutputPos?.(0);
        const len = a && b ? Math.hypot(b[0] - a[0], b[1] - a[1]) : 0;
        crossings.set(node.id, a && b ? { poly: { pts: [[a[0], a[1], 0], [b[0], b[1], len]], len }, len } : null);
      }
      return crossings.get(node.id);
    };
    // LiteGraph skips the links outside the view: their comets use the shape from the last time they were drawn,
    // so a comet does not vanish or jump while the canvas is moved
    const known = (map, key, id) => map.get(id) ?? linkFocus.known.get(key + id);
    const partsOf = (id) => [...(linkFocus.chains.get(id) ?? []).map((r) => known(segs.reroutes, "r", r.id)),
      known(segs.finals, "f", id)];
    for (const id of linkFocus.ids?.keys() ?? []) {
      let l = linkOf(g, id);
      // a comet runs from the real source to the real target: start at the links that end at a real node, and
      // walk up through the reroute nodes in front of them
      if (!l || isRerouteNode(g.getNodeById(l.target_id))) continue;
      let parts = partsOf(id);
      for (let guard = 0; guard < 50; guard++) {
        const src = g.getNodeById(l.origin_id);
        const up = isRerouteNode(src) ? src.inputs?.[0]?.link : null;
        const ul = up != null && linkFocus.ids.has(up) ? linkOf(g, up) : null;
        if (!ul) break;
        parts = [...partsOf(up), across(src), ...parts];
        l = ul;
      }
      parts = parts.filter(Boolean);
      if (!parts.length) continue;
      const from = `${l?.origin_id}:${l?.origin_slot}`;
      const total = parts.reduce((sum, p) => sum + p.len, 0);
      cycle.set(from, Math.max(cycle.get(from) ?? 0, total));
      runs.push({ parts, from });
    }
    // the comets themselves are drawn on the overlay (see cometOverlay), 60 times a second, without redrawing
    // the graph; this only hands over the lines they fly along
    linkFocus.snap = { canvas, runs: runs.map((r) => ({ ...r, total: r.parts.reduce((sum, p) => sum + p.len, 0) })),
      cycle, width };
    cometOverlay.start(canvas);
  }
  ctx.restore();
}

/** A transparent canvas right above the graph canvas (below the DOM widgets and menus) that draws only the comets.
 *  It uses the lines of the last graph draw and the current pan / zoom, and hides the comets under the nodes by
 *  cutting the node rectangles out of its drawing area. */
const cometOverlay = {
  el: null, raf: 0, last: 0,
  start(canvas) {
    if (!this.raf) this.raf = requestAnimationFrame((t) => this.frame(t, canvas));
  },
  ensure(canvas) {
    const main = canvas.canvas;
    if (!main?.parentNode) return null;
    if (!this.el || this.el.parentNode !== main.parentNode || this.el.previousSibling !== main) {
      this.el?.remove();
      const el = document.createElement("canvas");
      el.className = "dm-comets";
      el.style.cssText = "position:absolute;pointer-events:none;";
      main.parentNode.insertBefore(el, main.nextSibling);
      this.el = el;
    }
    const el = this.el;
    if (el.width !== main.width || el.height !== main.height) { el.width = main.width; el.height = main.height; }
    const cs = el.style, w = main.clientWidth + "px", h = main.clientHeight + "px";
    if (cs.width !== w) cs.width = w;
    if (cs.height !== h) cs.height = h;
    const l = main.offsetLeft + "px", tp = main.offsetTop + "px";
    if (cs.left !== l) cs.left = l;
    if (cs.top !== tp) cs.top = tp;
    const z = getComputedStyle(main).zIndex;
    if (cs.zIndex !== z) cs.zIndex = z === "auto" ? "" : z;
    return el;
  },
  clear() {
    const ctx = this.el?.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);               // the last frame left the zoom transform on the context
    ctx.clearRect(0, 0, this.el.width, this.el.height);
  },
  frame(t, canvas) {
    this.raf = 0;
    const snap = linkFocus.snap;
    const cfg = linkFocus.cfg;
    if (!snap || snap.canvas !== canvas || !cfg?.anim || canvas.low_quality || document.hidden) {
      this.clear();
      this.last = 0;
      if (snap && !document.hidden) this.raf = requestAnimationFrame((tt) => this.frame(tt, canvas));
      return;
    }
    const dt = this.last ? Math.min(250, t - this.last) : 0;
    this.last = t;
    linkFocus.phase += dt * cfg.speed / 1000;
    const el = this.ensure(canvas);
    if (el) {
      const ctx = el.getContext("2d");
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, el.width, el.height);
      const ds = canvas.ds, r = el.width / (canvas.canvas.clientWidth || el.width), sc = ds.scale * r;
      ctx.setTransform(sc, 0, 0, sc, ds.offset[0] * sc, ds.offset[1] * sc);
      const drawn = new Set();   // links of one output: one comet while their heads are on the same segment
      for (const { parts, from, total } of snap.runs) {
        const head = linkFocus.phase % (snap.cycle.get(from) + COMET.tail + 20);
        const at = segmentAt(parts, Math.min(head, total)).part;   // a shared reroute segment is the same object
        if (drawn.has(at)) continue;
        drawn.add(at);
        drawComet(ctx, parts, total, head, snap.width);
      }
      // under a node the comet is covered as much as the links are: fully for opaque nodes, partly with the
      // "node opacity" setting of ComfyUI (the links show through semi-transparent nodes, so do the comets)
      const cover = Math.min(1, Math.max(0, Number(rawSetting("Comfy.Node.Opacity") ?? 1)));
      if (cover > 0) {
        const th = globalThis.LiteGraph?.NODE_TITLE_HEIGHT ?? 30, rad = globalThis.LiteGraph?.ROUND_RADIUS ?? 8;
        const vx0 = -ds.offset[0], vy0 = -ds.offset[1], vx1 = vx0 + el.width / sc, vy1 = vy0 + el.height / sc;
        const mask = new Path2D();
        for (const n of canvas.graph?._nodes ?? []) {
          const b = n.boundingRect;
          const [x, y, w, h] = b && b.length >= 4 ? b : [n.pos?.[0], (n.pos?.[1] ?? 0) - th, n.size?.[0], (n.size?.[1] ?? 0) + th];
          if (!(w > 0) || x > vx1 || y > vy1 || x + w < vx0 || y + h < vy0) continue;
          if (mask.roundRect) mask.roundRect(x, y, w, h, rad); else mask.rect(x, y, w, h);
        }
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.globalAlpha = 1;
        ctx.fillStyle = `rgba(0,0,0,${cover})`;
        ctx.fill(mask);
        ctx.restore();
      }
    }
    this.raf = requestAnimationFrame((tt) => this.frame(tt, canvas));
  },
};

// ───────────────────────────── styled output tooltips ─────────────────────────────
// A node may describe its outputs:  node.getStyledOutputTooltip(index) ->
//   { title?: string, lines: [{ kind: "info" | "warn" | "muted", text: string }] } | null
// The stock tooltip of that output keeps its first paragraph as the title (or `title`), the lines go under it with an
// icon and a colour. Nodes without the method, inputs, widgets and node titles keep the stock tooltip.
// The frontend renders the tooltip as plain text, so its text node is shortened and our lines are added next to it.

const TIP_COLORS = { info: "#5fb878", warn: "#e8a33a", muted: "#9a9a9a" };
const TIP_ICONS = {
  info: '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="8" r="6.5"/><path d="M8 7.2v4" stroke-linecap="round"/><circle cx="8" cy="4.9" r=".9" fill="currentColor" stroke="none"/></svg>',
  warn: '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M8 1.8 15 14H1z"/><path d="M8 6.2v3.8" stroke-linecap="round"/><circle cx="8" cy="12" r=".9" fill="currentColor" stroke="none"/></svg>',
};
TIP_ICONS.muted = TIP_ICONS.info;

/** The output under the mouse, with the same hit box as the frontend (and inputs first, as it does). */
function hoveredOutput() {
  const c = app.canvas;
  const node = c?.node_over;
  const m = c?.graph_mouse;
  if (!node || !m || node.flags?.collapsed || !node.outputs?.length) return null;
  const inside = (p, x, y) => x >= p[0] - 10 && x <= p[0] + 30 && y >= p[1] - 10 && y <= p[1] + 10;
  for (let i = 0; i < (node.inputs?.length ?? 0); i++) {
    const p = node.getInputPos?.(i);
    if (p && inside([p[0] - 20, p[1]], m[0], m[1])) return null;
  }
  for (let i = 0; i < node.outputs.length; i++) {
    const p = node.getOutputPos?.(i);
    if (p && inside(p, m[0], m[1])) return { node, index: i };
  }
  return null;
}

function styledFor(h = hoveredOutput()) {
  if (!h || typeof h.node.getStyledOutputTooltip !== "function") return null;
  try {
    const r = h.node.getStyledOutputTooltip(h.index);
    return r && Array.isArray(r.lines) && r.lines.length ? r : null;
  } catch (e) {
    console.warn("[Draftsman] styled tooltip", e);
    return null;
  }
}

let tipObserver = null;
/** While a node (or a group, or the canvas) is dragged, the node tooltip (the description of the node under the
 *  cursor) is hidden: it would cover the alignment guides. It comes back by itself after the drop. */
function installHideTooltipWhileDragging() {
  if (window.__dmDragTip) return;
  window.__dmDragTip = true;
  const st = document.createElement("style");
  st.textContent = "body.dm-dragging .node-tooltip{display:none!important}";
  document.head.appendChild(st);
  let down = null;
  const stop = () => { down = null; document.body.classList.remove("dm-dragging"); };
  addEventListener("pointerdown", (e) => {
    if (e.button === 0 && e.target === app.canvas?.canvas) down = [e.clientX, e.clientY];
  }, { capture: true, passive: true });
  addEventListener("pointermove", (e) => {
    if (!down) return;
    if (!(e.buttons & 1)) { stop(); return; }
    if (Math.abs(e.clientX - down[0]) + Math.abs(e.clientY - down[1]) > 3) document.body.classList.add("dm-dragging");
  }, { capture: true, passive: true });
  addEventListener("pointerup", stop, { capture: true, passive: true });
  addEventListener("pointercancel", stop, { capture: true, passive: true });
  addEventListener("blur", stop);
}

function installStyledTooltips() {
  if (tipObserver) return;
  const watch = () => tipObserver.observe(document.body, { subtree: true, childList: true, characterData: true });
  const paint = () => {
    const tip = document.querySelector(".node-tooltip");
    if (!tip) return;
    const walker = document.createTreeWalker(tip, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement?.closest(".dm-tip-lines") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    const text = walker.nextNode();
    const ours = tip.querySelector(".dm-tip-lines");
    if (!text) return;
    const h = hoveredOutput();
    const key = h ? `${h.node.id}:${h.index}` : "";
    if (ours && text.data === ours.dataset.title && ours.dataset.key === key) return;   // still our version of it
    tipObserver.disconnect();
    try {
      ours?.remove();
      const st = getSetting(S.TIPS_ON) !== false ? styledFor(h) : null;
      if (!st) return;
      const title = st.title ?? text.data.split(/\n\s*\n/)[0].trim();
      text.data = title;
      const box = document.createElement("div");
      box.className = "dm-tip-lines";
      box.dataset.title = title;
      box.dataset.key = key;
      for (const line of st.lines) {
        const kind = TIP_COLORS[line?.kind] ? line.kind : "muted";
        const row = document.createElement("div");
        row.className = `dm-tip-line dm-tip-${kind}`;
        row.style.color = TIP_COLORS[kind];
        row.innerHTML = TIP_ICONS[kind];
        const span = document.createElement("span");
        span.textContent = String(line?.text ?? "");
        row.appendChild(span);
        box.appendChild(row);
      }
      text.after(box);
    } finally {
      watch();
    }
  };
  tipObserver = new MutationObserver((records) => {
    for (const r of records) {
      const el = r.target.nodeType === 1 ? r.target : r.target.parentElement;
      if (el?.closest?.(".node-tooltip") || [...r.addedNodes].some((n) => n.nodeType === 1 && (n.matches?.(".node-tooltip") || n.querySelector?.(".node-tooltip")))) {
        paint();
        return;
      }
    }
  });
  watch();
}

app.registerExtension({
  name: EXT_NAME,
  settings: SETTINGS_DEF,

  // labels are English; Russian comes from locales/ru/commands.json
  commands: [
    { id: "Draftsman.OpenColors", label: "Draftsman: header & body colors of the selection", icon: "pi pi-palette",
      function: () => openForSelection() },
    { id: "Draftsman.ToggleGuides", label: "Draftsman: toggle alignment guides", icon: "pi pi-th-large",
      function: () => setSetting(S.GUIDES_ON, !getSetting(S.GUIDES_ON)).then(redraw) },
    { id: "Draftsman.ToggleSpacing", label: "Draftsman: toggle spacing magnet", icon: "pi pi-arrows-h",
      function: () => setSetting(S.GAP_ON, !getSetting(S.GAP_ON)).then(redraw) },
    { id: "Draftsman.CopyColors", label: "Draftsman: copy colors of the selected node",
      function: () => { const n = getSelectedNodes()[0]; if (n) copyColors("nodes", n); else { const g = getSelectedGroups()[0]; if (g) copyColors("groups", g); } } },
    { id: "Draftsman.PasteColors", label: "Draftsman: paste colors into the selection",
      function: () => { pasteColors("nodes", getSelectedNodes()); pasteColors("groups", getSelectedGroups()); } },
    { id: "Draftsman.FormatPainter", label: "Draftsman: format painter from the selected node or group", icon: "pi pi-pencil",
      function: () => painterFromSelection() },
    { id: "Draftsman.ThemeRules", label: "Draftsman: theme & color rules", icon: "pi pi-palette",
      function: () => openThemeDialog() },
    { id: "Draftsman.ApplyRules", label: "Draftsman: apply color rules to all nodes",
      function: () => { const n = applyRules(allNodes()); toast(t("thApplied"), t("thAppliedD", { n })); } },
    { id: "Draftsman.AlignLeft", label: "Draftsman: align left edges", function: () => alignNodes("left", getSelectedNodes()) },
    { id: "Draftsman.AlignHCenter", label: "Draftsman: align horizontal centers", function: () => alignNodes("hcenter", getSelectedNodes()) },
    { id: "Draftsman.AlignRight", label: "Draftsman: align right edges", function: () => alignNodes("right", getSelectedNodes()) },
    { id: "Draftsman.AlignTop", label: "Draftsman: align top edges", function: () => alignNodes("top", getSelectedNodes()) },
    { id: "Draftsman.AlignVCenter", label: "Draftsman: align vertical centers", function: () => alignNodes("vcenter", getSelectedNodes()) },
    { id: "Draftsman.AlignBottom", label: "Draftsman: align bottom edges", function: () => alignNodes("bottom", getSelectedNodes()) },
    { id: "Draftsman.Row", label: "Draftsman: line up in a row", function: () => distributeNodes("x", getSelectedNodes()) },
    { id: "Draftsman.Column", label: "Draftsman: line up in a column", function: () => distributeNodes("y", getSelectedNodes()) },
    { id: "Draftsman.SameWidth", label: "Draftsman: same width", function: () => sameSize("w", getSelectedNodes()) },
    { id: "Draftsman.SameHeight", label: "Draftsman: same height", function: () => sameSize("h", getSelectedNodes()) },
    { id: "Draftsman.SameSize", label: "Draftsman: same size", function: () => sameSize("wh", getSelectedNodes()) },
    { id: "Draftsman.FitGroups", label: "Draftsman: fit selected groups to nodes (grid)", function: () => fitGroups(getSelectedGroups()) },
    { id: "Draftsman.NudgeLeft", label: "Draftsman: move selection 1 cell left", function: () => nudge(-1, 0) },
    { id: "Draftsman.NudgeRight", label: "Draftsman: move selection 1 cell right", function: () => nudge(1, 0) },
    { id: "Draftsman.NudgeUp", label: "Draftsman: move selection 1 cell up", function: () => nudge(0, -1) },
    { id: "Draftsman.NudgeDown", label: "Draftsman: move selection 1 cell down", function: () => nudge(0, 1) },
    { id: "Draftsman.NudgeLeftBig", label: "Draftsman: move selection left (big step)", function: () => nudge(-bigStep(), 0) },
    { id: "Draftsman.NudgeRightBig", label: "Draftsman: move selection right (big step)", function: () => nudge(bigStep(), 0) },
    { id: "Draftsman.NudgeUpBig", label: "Draftsman: move selection up (big step)", function: () => nudge(0, -bigStep()) },
    { id: "Draftsman.NudgeDownBig", label: "Draftsman: move selection down (big step)", function: () => nudge(0, bigStep()) },
  ],
  keybindings: DEFAULT_KEYS,

  beforeConfigureGraph() { loadingGraph = true; },
  afterConfigureGraph() { loadingGraph = false; },
  nodeCreated(node) { onNodeCreated(node); },

  // new context-menu API
  getNodeMenuItems(node) { return nodeMenuItems(node); },
  getCanvasMenuItems() { return canvasMenuItems(); },

  async setup() {
    const canvas = app.canvas;
    const proto = Object.getPrototypeOf(canvas);

    if (!app.extensionManager?.setting && app.ui?.settings?.addSetting) {
      for (const s of SETTINGS_DEF) {
        if (s.type === "hidden") continue;
        try { app.ui.settings.addSetting({ ...s }); } catch {}
      }
    }

    // older frontends without the hook API
    if (typeof app.collectNodeMenuItems !== "function") {
      patchProtoMenu(proto, "getNodeMenuOptions", (node) => nodeMenuItems(node));
      patchProtoMenu(proto, "getGroupMenuOptions", (group) => groupMenuItems(group));
    }
    if (typeof app.collectCanvasMenuItems !== "function") {
      patchProtoMenu(proto, "getCanvasMenuOptions", () => canvasMenuItems());
    }

    injectCss(); // also styles our context-menu items and the settings icon
    patchGroupDraw();
    installGuides(canvas);
    installPainter();
    installStyledTooltips();
    installHideTooltipWhileDragging();
    installLinkFocus(canvas);
    migrateSettings();

    if (!app.extensionManager?.command) {
      addEventListener("keydown", (e) => {
        if (!e.altKey || !e.shiftKey || e.ctrlKey || e.metaKey) return;
        if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName)) return;
        const k = e.key.toLowerCase();
        if (k === "c" || e.code === "KeyC") { e.preventDefault(); openForSelection(); }
        else if (k === "g" || e.code === "KeyG") { e.preventDefault(); setSetting(S.GUIDES_ON, !getSetting(S.GUIDES_ON)).then(redraw); }
        else if (k === "p" || e.code === "KeyP") { e.preventDefault(); painterFromSelection(); }
      });
      addEventListener("keydown", (e) => {
        const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
        if (!d || e.altKey || e.ctrlKey || e.metaKey) return;
        if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName) || e.target?.isContentEditable) return;
        if (!getSelectedNodes().length && !getSelectedGroups().length) return;
        e.preventDefault();
        const m = e.shiftKey ? bigStep() : 1;
        nudge(d[0] * m, d[1] * m);
      });
    }
  },
});
