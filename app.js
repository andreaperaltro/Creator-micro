const STORAGE_KEY = "creator-micro-mapper-profile-v1";
const DEFAULT_KEY_COUNT = 12;
const DEFAULT_LAYER_COUNT = 3;
const DEFAULT_KNOB_COUNT = 2;
const MAX_KEY_COUNT = 64;
const MAX_KNOB_COUNT = 2;
const MODIFIER_ORDER = ["LCTL", "LSFT", "LALT", "LGUI"];
const MODIFIER_NAMES = {
  LCTL: "Ctrl",
  LSFT: "Maiusc",
  LALT: "Alt",
  LGUI: "Cmd/Win",
};
const MAX_MACRO_DELAY_MS = 10000;
const DEFAULT_MACRO_DELAY_MS = 120;
const MACRO_STEP_KIND_OPTIONS = [
  { value: "key", label: "Tasto" },
  { value: "shortcut", label: "Scorciatoia" },
  { value: "text", label: "Testo" },
  { value: "delay", label: "Pausa" },
];

const LETTER_KEYS = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ", (letter) => ({
  code: `KC_${letter}`,
  label: letter,
}));

const NUMBER_KEYS = Array.from("1234567890", (digit) => ({
  code: `KC_${digit}`,
  label: digit,
}));

const FUNCTION_KEYS = Array.from({ length: 12 }, (_, index) => ({
  code: `KC_F${index + 1}`,
  label: `F${index + 1}`,
}));

const FRIENDLY_KEY_GROUPS = [
  {
    label: "Comandi principali",
    keys: [
      { code: "KC_NO", label: "Nessun tasto" },
      { code: "KC_TRNS", label: "Trasparente (layer inferiore)" },
      { code: "KC_ESC", label: "Esc" },
      { code: "KC_TAB", label: "Tab" },
      { code: "KC_ENT", label: "Invio" },
      { code: "KC_SPC", label: "Spazio" },
      { code: "KC_BSPC", label: "Backspace" },
      { code: "KC_DEL", label: "Canc" },
      { code: "KC_INS", label: "Ins" },
      { code: "KC_HOME", label: "Home" },
      { code: "KC_END", label: "Fine" },
      { code: "KC_PGUP", label: "Pagina su" },
      { code: "KC_PGDN", label: "Pagina giu" },
      { code: "KC_LEFT", label: "Freccia sinistra" },
      { code: "KC_DOWN", label: "Freccia giu" },
      { code: "KC_UP", label: "Freccia su" },
      { code: "KC_RGHT", label: "Freccia destra" },
    ],
  },
  {
    label: "Lettere",
    keys: LETTER_KEYS,
  },
  {
    label: "Numeri",
    keys: NUMBER_KEYS,
  },
  {
    label: "Simboli (layout ITA, possono variare)",
    keys: [
      { code: "KC_MINS", label: "' / ? (tasto ITA)" },
      { code: "KC_EQL", label: "i grave / ^ (tasto ITA)" },
      { code: "KC_LBRC", label: "e grave / e acuto (tasto ITA)" },
      { code: "KC_RBRC", label: "+ / * (tasto ITA)" },
      { code: "KC_BSLS", label: "\\ / |" },
      { code: "KC_SCLN", label: "o grave / c cediglia (tasto ITA)" },
      { code: "KC_QUOT", label: "a grave / degree (tasto ITA)" },
      { code: "KC_COMM", label: ", / ;" },
      { code: "KC_DOT", label: ". / :" },
      { code: "KC_SLSH", label: "- / _ (tasto ITA)" },
      { code: "KC_NUBS", label: "< / > (ISO)" },
    ],
  },
  {
    label: "Tasti funzione",
    keys: FUNCTION_KEYS,
  },
  {
    label: "Numpad",
    keys: [
      { code: "KC_P0", label: "Numpad 0" },
      { code: "KC_P1", label: "Numpad 1" },
      { code: "KC_P2", label: "Numpad 2" },
      { code: "KC_P3", label: "Numpad 3" },
      { code: "KC_P4", label: "Numpad 4" },
      { code: "KC_P5", label: "Numpad 5" },
      { code: "KC_P6", label: "Numpad 6" },
      { code: "KC_P7", label: "Numpad 7" },
      { code: "KC_P8", label: "Numpad 8" },
      { code: "KC_P9", label: "Numpad 9" },
      { code: "KC_PDOT", label: "Numpad ." },
      { code: "KC_PSLS", label: "Numpad /" },
      { code: "KC_PAST", label: "Numpad *" },
      { code: "KC_PMNS", label: "Numpad -" },
      { code: "KC_PPLS", label: "Numpad +" },
      { code: "KC_PENT", label: "Numpad Invio" },
    ],
  },
  {
    label: "Media",
    keys: [
      { code: "KC_MUTE", label: "Muto" },
      { code: "KC_VOLU", label: "Volume +" },
      { code: "KC_VOLD", label: "Volume -" },
      { code: "KC_MPLY", label: "Play/Pausa" },
      { code: "KC_MSTP", label: "Stop" },
      { code: "KC_MNXT", label: "Traccia successiva" },
      { code: "KC_MPRV", label: "Traccia precedente" },
    ],
  },
  {
    label: "Mouse / Trackpad",
    keys: [
      { code: "KC_WH_U", label: "Scroll su" },
      { code: "KC_WH_D", label: "Scroll giu" },
      { code: "KC_WH_L", label: "Scroll sinistra" },
      { code: "KC_WH_R", label: "Scroll destra" },
      { code: "KC_MS_U", label: "Mouse su" },
      { code: "KC_MS_D", label: "Mouse giu" },
      { code: "KC_MS_L", label: "Mouse sinistra" },
      { code: "KC_MS_R", label: "Mouse destra" },
      { code: "KC_BTN1", label: "Click sinistro" },
      { code: "KC_BTN2", label: "Click destro" },
      { code: "KC_BTN3", label: "Click centrale" },
    ],
  },
];

const KEY_LABEL_BY_CODE = new Map();
for (const group of FRIENDLY_KEY_GROUPS) {
  for (const key of group.keys) {
    KEY_LABEL_BY_CODE.set(key.code, key.label);
  }
}

const elements = {
  profileName: document.getElementById("profileName"),
  layerSelect: document.getElementById("layerSelect"),
  keyCount: document.getElementById("keyCount"),
  saveLocalButton: document.getElementById("saveLocalButton"),
  loadLocalButton: document.getElementById("loadLocalButton"),
  resetButton: document.getElementById("resetButton"),
  exportButton: document.getElementById("exportButton"),
  importInput: document.getElementById("importInput"),
  statusMessage: document.getElementById("statusMessage"),
  knobCount: document.getElementById("knobCount"),
  encoderList: document.getElementById("encoderList"),
  applyScrollPresetButton: document.getElementById("applyScrollPresetButton"),
  applyAltScrollPresetButton: document.getElementById("applyAltScrollPresetButton"),
  keyGrid: document.getElementById("keyGrid"),
  selectedKeyLabel: document.getElementById("selectedKeyLabel"),
  actionType: document.getElementById("actionType"),
  keycodeFields: document.getElementById("keycodeFields"),
  shortcutFields: document.getElementById("shortcutFields"),
  macroFields: document.getElementById("macroFields"),
  keycodeSelect: document.getElementById("keycodeSelect"),
  keycodeInput: document.getElementById("keycodeInput"),
  shortcutKeySelect: document.getElementById("shortcutKeySelect"),
  shortcutKeyInput: document.getElementById("shortcutKeyInput"),
  shortcutFriendlyPreview: document.getElementById("shortcutFriendlyPreview"),
  shortcutPreview: document.getElementById("shortcutPreview"),
  macroSelect: document.getElementById("macroSelect"),
  macroList: document.getElementById("macroList"),
  addMacroButton: document.getElementById("addMacroButton"),
  jsonPreview: document.getElementById("jsonPreview"),
};

let state = buildDefaultState();

function buildDefaultState() {
  const layers = Array.from({ length: DEFAULT_LAYER_COUNT }, () =>
    createLayer(DEFAULT_KEY_COUNT),
  );
  const encoders = Array.from({ length: DEFAULT_LAYER_COUNT }, () =>
    createEncoderLayer(DEFAULT_KNOB_COUNT),
  );

  return {
    profileName: "Creator Micro Profile",
    keyCount: DEFAULT_KEY_COUNT,
    knobCount: DEFAULT_KNOB_COUNT,
    activeLayer: 0,
    selectedKey: 0,
    layers,
    encoders,
    macros: [],
  };
}

function createLayer(keyCount) {
  return Array.from({ length: keyCount }, () => createDefaultAssignment());
}

function createEncoderAction(type = "keycode", seed = {}) {
  if (type === "shortcut") {
    return {
      type: "shortcut",
      keycode: sanitizeKeycode(seed.keycode),
      modifiers: sanitizeShortcutModifiers(seed.modifiers),
    };
  }

  return {
    type: "keycode",
    keycode: sanitizeKeycode(seed.keycode),
  };
}

function createDefaultEncoderBinding() {
  return {
    ccw: createEncoderAction("keycode", { keycode: "KC_NO" }),
    cw: createEncoderAction("keycode", { keycode: "KC_NO" }),
  };
}

function createEncoderLayer(knobCount) {
  return Array.from({ length: knobCount }, () => createDefaultEncoderBinding());
}

function createDefaultAssignment() {
  return { type: "keycode", keycode: "KC_NO" };
}

function cloneAssignment(assignment) {
  return JSON.parse(JSON.stringify(assignment));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function sanitizeKeycode(value, fallback = "KC_NO") {
  const normalized = String(value || "")
    .trim()
    .toUpperCase();
  return normalized.length > 0 ? normalized : fallback;
}

function normalizeTypedKeycode(value) {
  return String(value || "")
    .trim()
    .toUpperCase();
}

function sanitizeMacroId(value) {
  return String(value || "").trim();
}

function sanitizeShortcutModifiers(modifiers) {
  if (!Array.isArray(modifiers)) {
    return [];
  }

  const unique = [];
  for (const modifier of MODIFIER_ORDER) {
    if (modifiers.includes(modifier)) {
      unique.push(modifier);
    }
  }
  return unique;
}

function buildShortcutToken(modifiers, keycode) {
  const base = sanitizeKeycode(keycode);
  return sanitizeShortcutModifiers(modifiers).reduceRight(
    (wrapped, modifier) => `${modifier}(${wrapped})`,
    base,
  );
}

function generateMacroStepId() {
  const randomPart = Math.random().toString(36).slice(2, 7);
  return `S${Date.now().toString(36)}${randomPart}`;
}

function createMacroStep(kind = "key", seed = {}) {
  const id = sanitizeMacroId(seed.id) || generateMacroStepId();

  if (kind === "shortcut") {
    return {
      id,
      kind: "shortcut",
      modifiers: sanitizeShortcutModifiers(seed.modifiers),
      keycode: sanitizeKeycode(seed.keycode),
    };
  }

  if (kind === "text") {
    return {
      id,
      kind: "text",
      text: String(seed.text || ""),
    };
  }

  if (kind === "delay") {
    const parsed = Number(seed.ms);
    const ms = clamp(
      Number.isFinite(parsed) ? Math.round(parsed) : DEFAULT_MACRO_DELAY_MS,
      0,
      MAX_MACRO_DELAY_MS,
    );
    return { id, kind: "delay", ms };
  }

  return {
    id,
    kind: "key",
    keycode: sanitizeKeycode(seed.keycode),
  };
}

function sanitizeMacroStep(rawStep, index) {
  const fallbackId = `S${index + 1}`;

  if (typeof rawStep === "string") {
    return createMacroStep("text", { id: fallbackId, text: rawStep });
  }

  if (!rawStep || typeof rawStep !== "object") {
    return createMacroStep("key", { id: fallbackId });
  }

  const kind = String(rawStep.kind || "").trim().toLowerCase();
  if (!["key", "shortcut", "text", "delay"].includes(kind)) {
    return createMacroStep("text", {
      id: sanitizeMacroId(rawStep.id) || fallbackId,
      text: String(rawStep.text || rawStep.body || ""),
    });
  }

  return createMacroStep(kind, {
    id: sanitizeMacroId(rawStep.id) || fallbackId,
    keycode: rawStep.keycode,
    modifiers: rawStep.modifiers,
    text: rawStep.text,
    ms: rawStep.ms,
  });
}

function macroStepToBodyLine(step) {
  if (step.kind === "shortcut") {
    return `TAP(${buildShortcutToken(step.modifiers, step.keycode)})`;
  }

  if (step.kind === "text") {
    return `TYPE(${JSON.stringify(String(step.text || ""))})`;
  }

  if (step.kind === "delay") {
    const ms = clamp(Math.round(Number(step.ms) || 0), 0, MAX_MACRO_DELAY_MS);
    return `DELAY(${ms})`;
  }

  return `TAP(${sanitizeKeycode(step.keycode)})`;
}

function buildMacroBodyFromSteps(steps) {
  if (!Array.isArray(steps) || steps.length === 0) {
    return "";
  }
  return steps.map((step) => macroStepToBodyLine(step)).join("\n");
}

function refreshMacroBody(macro) {
  macro.body = buildMacroBodyFromSteps(macro.steps || []);
}

function createMacro(id, name) {
  const macro = {
    id,
    name,
    steps: [],
    body: "",
  };
  refreshMacroBody(macro);
  return macro;
}

function parseWrappedShortcutToken(token) {
  const normalized = sanitizeKeycode(token);
  const modifiers = [];
  let remaining = normalized;

  while (true) {
    const wrappedMatch = remaining.match(/^([A-Z0-9_]+)\((.*)\)$/);
    if (!wrappedMatch) {
      break;
    }

    const modifier = wrappedMatch[1];
    if (!MODIFIER_ORDER.includes(modifier)) {
      break;
    }

    modifiers.push(modifier);
    remaining = wrappedMatch[2];
  }

  if (modifiers.length === 0) {
    return null;
  }

  return {
    type: "shortcut",
    modifiers: sanitizeShortcutModifiers(modifiers),
    keycode: sanitizeKeycode(remaining),
  };
}

function sanitizeAssignment(raw) {
  if (!raw) {
    return createDefaultAssignment();
  }

  if (typeof raw === "string") {
    const normalized = sanitizeKeycode(raw);
    const parsedShortcut = parseWrappedShortcutToken(normalized);
    return parsedShortcut || { type: "keycode", keycode: normalized };
  }

  if (raw.type === "shortcut") {
    return {
      type: "shortcut",
      modifiers: sanitizeShortcutModifiers(raw.modifiers),
      keycode: sanitizeKeycode(raw.keycode),
    };
  }

  if (raw.type === "macro") {
    return {
      type: "macro",
      macroId: sanitizeMacroId(raw.macroId),
    };
  }

  const keycode = sanitizeKeycode(raw.keycode);
  const parsedShortcut = parseWrappedShortcutToken(keycode);
  return parsedShortcut || {
    type: "keycode",
    keycode,
  };
}

function sanitizeEncoderAction(raw) {
  if (!raw) {
    return createEncoderAction("keycode", { keycode: "KC_NO" });
  }

  if (typeof raw === "string") {
    const parsedShortcut = parseWrappedShortcutToken(raw);
    return parsedShortcut
      ? createEncoderAction("shortcut", parsedShortcut)
      : createEncoderAction("keycode", { keycode: raw });
  }

  const rawType = String(raw.type || "").trim().toLowerCase();
  if (rawType === "shortcut") {
    return createEncoderAction("shortcut", {
      keycode: raw.keycode,
      modifiers: raw.modifiers,
    });
  }

  const parsedFromKeycode = parseWrappedShortcutToken(raw.keycode);
  if (parsedFromKeycode) {
    return createEncoderAction("shortcut", parsedFromKeycode);
  }

  if (Array.isArray(raw.modifiers) && raw.modifiers.length > 0) {
    return createEncoderAction("shortcut", {
      keycode: raw.keycode,
      modifiers: raw.modifiers,
    });
  }

  return createEncoderAction("keycode", { keycode: raw.keycode });
}

function sanitizeEncoderBinding(raw) {
  if (!raw || typeof raw !== "object") {
    return createDefaultEncoderBinding();
  }

  return {
    ccw: sanitizeEncoderAction(raw.ccw),
    cw: sanitizeEncoderAction(raw.cw),
  };
}

function sanitizeMacro(rawMacro, index) {
  if (typeof rawMacro === "string") {
    const macro = {
      id: `M${index + 1}`,
      name: `Macro ${index + 1}`,
      steps: rawMacro ? [createMacroStep("text", { text: rawMacro })] : [],
      body: "",
    };
    refreshMacroBody(macro);
    return macro;
  }

  const name = String(rawMacro?.name || "").trim() || `Macro ${index + 1}`;
  const id = sanitizeMacroId(rawMacro?.id) || `M${index + 1}`;
  const importedSteps = Array.isArray(rawMacro?.steps) ? rawMacro.steps : null;
  let steps = [];

  if (importedSteps) {
    steps = importedSteps.map((step, stepIndex) => sanitizeMacroStep(step, stepIndex));
  } else {
    const legacyBody = String(rawMacro?.body || "");
    if (legacyBody.length > 0) {
      steps = [createMacroStep("text", { text: legacyBody })];
    }
  }

  const macro = { id, name, steps, body: "" };
  refreshMacroBody(macro);
  return macro;
}

function coerceMacroTokensInLayers(layers, macros) {
  for (const layer of layers) {
    for (let index = 0; index < layer.length; index += 1) {
      const assignment = layer[index];
      if (assignment.type !== "keycode") {
        continue;
      }

      const macroMatch = assignment.keycode.match(/^QK_MACRO_(\d+)$/);
      if (!macroMatch) {
        continue;
      }

      const macroIndex = Number(macroMatch[1]);
      const macro = macros[macroIndex];
      if (macro) {
        layer[index] = { type: "macro", macroId: macro.id };
      }
    }
  }
}

function normalizeImportedState(raw) {
  const layerCount = Math.max(1, Number(raw?.layers?.length || DEFAULT_LAYER_COUNT));
  const sourceKeyCount = Number(
    raw?.keyCount || raw?.layers?.[0]?.length || DEFAULT_KEY_COUNT,
  );
  const keyCount = clamp(
    Number.isFinite(sourceKeyCount) ? sourceKeyCount : DEFAULT_KEY_COUNT,
    1,
    MAX_KEY_COUNT,
  );

  const layers = Array.from({ length: layerCount }, (_, layerIndex) => {
    const sourceLayer = Array.isArray(raw?.layers?.[layerIndex])
      ? raw.layers[layerIndex]
      : [];

    return Array.from({ length: keyCount }, (_, keyIndex) =>
      sanitizeAssignment(sourceLayer[keyIndex]),
    );
  });

  const macrosRaw = Array.isArray(raw?.macros) ? raw.macros : [];
  const macros = macrosRaw.map((macro, index) => sanitizeMacro(macro, index));
  coerceMacroTokensInLayers(layers, macros);

  const sourceEncoders = Array.isArray(raw?.encoders)
    ? raw.encoders
    : Array.isArray(raw?.viaPreview?.encoderTokens)
      ? raw.viaPreview.encoderTokens
    : Array.isArray(raw?.viaPreview?.encoders)
      ? raw.viaPreview.encoders
      : [];
  const sourceKnobCount = Number(
    raw?.knobCount || sourceEncoders?.[0]?.length || DEFAULT_KNOB_COUNT,
  );
  const knobCount = clamp(
    Number.isFinite(sourceKnobCount) ? sourceKnobCount : DEFAULT_KNOB_COUNT,
    1,
    MAX_KNOB_COUNT,
  );
  const encoders = Array.from({ length: layerCount }, (_, layerIndex) => {
    const sourceLayer = Array.isArray(sourceEncoders[layerIndex])
      ? sourceEncoders[layerIndex]
      : [];

    return Array.from({ length: knobCount }, (_, knobIndex) =>
      sanitizeEncoderBinding(sourceLayer[knobIndex]),
    );
  });

  return {
    profileName:
      String(raw?.profileName || "").trim() || "Creator Micro Imported Profile",
    keyCount,
    knobCount,
    activeLayer: clamp(Number(raw?.activeLayer || 0), 0, layerCount - 1),
    selectedKey: clamp(Number(raw?.selectedKey || 0), 0, keyCount - 1),
    layers,
    encoders,
    macros,
  };
}

function generateNextMacroId() {
  let candidate = 1;
  const usedIds = new Set(state.macros.map((macro) => macro.id));
  while (usedIds.has(`M${candidate}`)) {
    candidate += 1;
  }
  return `M${candidate}`;
}

function setStatus(message) {
  elements.statusMessage.textContent = message;
}

function getSelectedAssignment() {
  return state.layers[state.activeLayer][state.selectedKey];
}

function setSelectedAssignment(nextAssignment) {
  state.layers[state.activeLayer][state.selectedKey] = sanitizeAssignment(nextAssignment);
}

function resizeLayers(nextKeyCount) {
  state.layers = state.layers.map((layer) => {
    const resized = Array.from({ length: nextKeyCount }, (_, index) => {
      const current = layer[index];
      return current ? sanitizeAssignment(current) : createDefaultAssignment();
    });
    return resized;
  });

  state.keyCount = nextKeyCount;
  state.selectedKey = clamp(state.selectedKey, 0, nextKeyCount - 1);
}

function resizeEncoders(nextKnobCount) {
  state.encoders = state.encoders.map((layer) => {
    const resized = Array.from({ length: nextKnobCount }, (_, index) => {
      const current = layer[index];
      return current ? sanitizeEncoderBinding(current) : createDefaultEncoderBinding();
    });
    return resized;
  });

  state.knobCount = nextKnobCount;
}

function ensureValidMacroAssignments() {
  const macroIds = new Set(state.macros.map((macro) => macro.id));
  for (const layer of state.layers) {
    for (let index = 0; index < layer.length; index += 1) {
      const assignment = layer[index];
      if (assignment.type === "macro" && !macroIds.has(assignment.macroId)) {
        layer[index] = createDefaultAssignment();
      }
    }
  }
}

function populateFriendlyKeySelect(selectElement) {
  selectElement.textContent = "";

  for (const group of FRIENDLY_KEY_GROUPS) {
    const optgroup = document.createElement("optgroup");
    optgroup.label = group.label;

    for (const key of group.keys) {
      const option = document.createElement("option");
      option.value = key.code;
      option.textContent = key.label;
      optgroup.appendChild(option);
    }

    selectElement.appendChild(optgroup);
  }
}

function ensureSelectContainsValue(selectElement, keycode) {
  const normalized = sanitizeKeycode(keycode);
  const customOption = selectElement.querySelector("option[data-custom='true']");
  if (customOption) {
    customOption.remove();
  }

  const hasKnownOption = Array.from(selectElement.options).some(
    (option) => option.value === normalized,
  );

  if (!hasKnownOption) {
    const option = document.createElement("option");
    option.value = normalized;
    option.textContent = `Personalizzato (${normalized})`;
    option.setAttribute("data-custom", "true");
    selectElement.prepend(option);
  }

  selectElement.value = normalized;
}

function keycodeToFriendlyLabel(keycode) {
  const normalized = sanitizeKeycode(keycode);
  return KEY_LABEL_BY_CODE.get(normalized) || normalized;
}

function getCheckedModifiers() {
  return Array.from(document.querySelectorAll(".modifier:checked")).map(
    (checkbox) => checkbox.value,
  );
}

function renderLayerSelect() {
  elements.layerSelect.textContent = "";
  state.layers.forEach((_, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `Layer ${index + 1}`;
    elements.layerSelect.appendChild(option);
  });
  elements.layerSelect.value = String(state.activeLayer);
}

function assignmentToViaToken(assignment) {
  if (assignment.type === "macro") {
    const macroIndex = state.macros.findIndex((macro) => macro.id === assignment.macroId);
    return macroIndex >= 0 ? `QK_MACRO_${macroIndex}` : "KC_NO";
  }

  if (assignment.type === "shortcut") {
    return buildShortcutToken(assignment.modifiers, assignment.keycode);
  }

  return sanitizeKeycode(assignment.keycode);
}

function assignmentToLabel(assignment) {
  if (assignment.type === "macro") {
    const macro = state.macros.find((item) => item.id === assignment.macroId);
    return macro ? `Macro: ${macro.name}` : "Macro: mancante";
  }

  if (assignment.type === "shortcut") {
    const modifierLabels = sanitizeShortcutModifiers(assignment.modifiers).map(
      (modifier) => MODIFIER_NAMES[modifier] || modifier,
    );
    return [...modifierLabels, keycodeToFriendlyLabel(assignment.keycode)].join(" + ");
  }

  return keycodeToFriendlyLabel(assignment.keycode);
}

function renderGrid() {
  elements.keyGrid.textContent = "";
  const columns = state.keyCount < 4 ? state.keyCount : 4;
  elements.keyGrid.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;

  const layer = state.layers[state.activeLayer];
  layer.forEach((assignment, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "key-button";
    if (index === state.selectedKey) {
      button.classList.add("selected");
    }

    const keyIndex = document.createElement("span");
    keyIndex.className = "key-index";
    keyIndex.textContent = `K${index + 1}`;

    const keyValue = document.createElement("span");
    keyValue.className = "key-value";
    keyValue.textContent = assignmentToLabel(assignment);

    button.append(keyIndex, keyValue);
    button.addEventListener("click", () => {
      state.selectedKey = index;
      renderGrid();
      renderEditor();
    });
    elements.keyGrid.appendChild(button);
  });
}

function ensureEncoderStateConsistency() {
  const normalizedKnobCount = clamp(
    Number.isFinite(Number(state.knobCount)) ? Math.round(Number(state.knobCount)) : DEFAULT_KNOB_COUNT,
    1,
    MAX_KNOB_COUNT,
  );
  state.knobCount = normalizedKnobCount;

  if (!Array.isArray(state.encoders)) {
    state.encoders = [];
  }

  while (state.encoders.length < state.layers.length) {
    state.encoders.push(createEncoderLayer(state.knobCount));
  }
  if (state.encoders.length > state.layers.length) {
    state.encoders = state.encoders.slice(0, state.layers.length);
  }

  state.encoders = state.encoders.map((layer) =>
    Array.from({ length: state.knobCount }, (_, index) =>
      sanitizeEncoderBinding(layer?.[index]),
    ),
  );
}

function encoderActionToViaToken(action) {
  const normalized = sanitizeEncoderAction(action);
  if (normalized.type === "shortcut") {
    return buildShortcutToken(normalized.modifiers, normalized.keycode);
  }
  return sanitizeKeycode(normalized.keycode);
}

function encoderActionToLabel(action) {
  const normalized = sanitizeEncoderAction(action);
  if (normalized.type === "shortcut") {
    return readableShortcutLabel(normalized.modifiers, normalized.keycode);
  }
  return keycodeToFriendlyLabel(normalized.keycode);
}

function buildEncoderDirectionEditor({
  parent,
  binding,
  directionKey,
  title,
  onBindingChanged,
}) {
  const directionWrapper = document.createElement("div");
  directionWrapper.className = "encoder-direction";

  const heading = document.createElement("h4");
  heading.className = "encoder-direction-title";
  heading.textContent = title;
  directionWrapper.appendChild(heading);

  const action = sanitizeEncoderAction(binding[directionKey]);
  binding[directionKey] = action;

  const typeField = document.createElement("div");
  typeField.className = "field-group compact";
  const typeLabel = document.createElement("label");
  typeLabel.textContent = "Tipo azione";
  const typeSelect = document.createElement("select");
  const keyOption = document.createElement("option");
  keyOption.value = "keycode";
  keyOption.textContent = "Tasto singolo";
  const shortcutOption = document.createElement("option");
  shortcutOption.value = "shortcut";
  shortcutOption.textContent = "Scorciatoia";
  typeSelect.append(keyOption, shortcutOption);
  typeSelect.value = action.type;
  typeSelect.addEventListener("change", () => {
    const nextType = typeSelect.value === "shortcut" ? "shortcut" : "keycode";
    const currentAction = sanitizeEncoderAction(binding[directionKey]);
    binding[directionKey] = createEncoderAction(nextType, {
      keycode: currentAction.keycode,
      modifiers: currentAction.modifiers,
    });
    setStatus(`${title}: aggiornato tipo azione.`);
    renderEncoderList();
    renderPreview();
  });
  typeField.append(typeLabel, typeSelect);
  directionWrapper.appendChild(typeField);

  const keyField = document.createElement("div");
  keyField.className = "field-group compact";
  const keyLabel = document.createElement("label");
  keyLabel.textContent = "Azione base";
  const keySelect = document.createElement("select");
  populateFriendlyKeySelect(keySelect);
  ensureSelectContainsValue(keySelect, action.keycode);
  keySelect.addEventListener("change", () => {
    binding[directionKey].keycode = sanitizeKeycode(keySelect.value);
    refreshDirectionPreview();
    if (typeof onBindingChanged === "function") {
      onBindingChanged();
    }
    setStatus(`${title}: aggiornata azione base.`);
    renderPreview();
  });
  keyField.append(keyLabel, keySelect);
  directionWrapper.appendChild(keyField);

  if (action.type === "shortcut") {
    const modifiersRow = document.createElement("div");
    modifiersRow.className = "encoder-modifiers";
    const modifierSet = new Set(sanitizeShortcutModifiers(action.modifiers));

    MODIFIER_ORDER.forEach((modifier) => {
      const label = document.createElement("label");
      label.className = "encoder-modifier-pill";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = modifier;
      checkbox.checked = modifierSet.has(modifier);
      checkbox.addEventListener("change", () => {
        const nextModifiers = Array.from(
          modifiersRow.querySelectorAll("input:checked"),
        ).map((input) => input.value);
        binding[directionKey].modifiers = sanitizeShortcutModifiers(nextModifiers);
        refreshDirectionPreview();
        if (typeof onBindingChanged === "function") {
          onBindingChanged();
        }
        setStatus(`${title}: aggiornati modificatori.`);
        renderPreview();
      });
      const text = document.createElement("span");
      text.textContent = MODIFIER_NAMES[modifier] || modifier;
      label.append(checkbox, text);
      modifiersRow.appendChild(label);
    });

    directionWrapper.appendChild(modifiersRow);
  }

  const preview = document.createElement("p");
  preview.className = "encoder-direction-preview";
  function refreshDirectionPreview() {
    preview.textContent = `Output: ${encoderActionToLabel(binding[directionKey])} (${encoderActionToViaToken(
      binding[directionKey],
    )})`;
  }
  refreshDirectionPreview();
  directionWrapper.appendChild(preview);

  parent.appendChild(directionWrapper);
}

function renderEncoderList() {
  ensureEncoderStateConsistency();
  elements.encoderList.textContent = "";
  const activeEncoderLayer = state.encoders[state.activeLayer] || createEncoderLayer(state.knobCount);

  activeEncoderLayer.forEach((binding, knobIndex) => {
    const wrapper = document.createElement("article");
    wrapper.className = "encoder-item";

    const title = document.createElement("h3");
    title.className = "encoder-title";
    title.textContent = `Knob ${knobIndex + 1}`;

    const grid = document.createElement("div");
    grid.className = "encoder-grid";

    const preview = document.createElement("p");
    preview.className = "encoder-preview";
    const refreshEncoderPreview = () => {
      preview.textContent = `CCW: ${encoderActionToLabel(binding.ccw)} · CW: ${encoderActionToLabel(
        binding.cw,
      )}`;
    };

    buildEncoderDirectionEditor({
      parent: grid,
      binding,
      directionKey: "ccw",
      title: "Giro a sinistra (CCW)",
      onBindingChanged: refreshEncoderPreview,
    });

    buildEncoderDirectionEditor({
      parent: grid,
      binding,
      directionKey: "cw",
      title: "Giro a destra (CW)",
      onBindingChanged: refreshEncoderPreview,
    });

    refreshEncoderPreview();

    wrapper.append(title, grid, preview);
    elements.encoderList.appendChild(wrapper);
  });
}

function renderEditorSections(actionType) {
  elements.keycodeFields.classList.toggle("hidden", actionType !== "keycode");
  elements.shortcutFields.classList.toggle("hidden", actionType !== "shortcut");
  elements.macroFields.classList.toggle("hidden", actionType !== "macro");
}

function renderMacroSelect() {
  const previousValue = elements.macroSelect.value;
  elements.macroSelect.textContent = "";

  state.macros.forEach((macro) => {
    const option = document.createElement("option");
    option.value = macro.id;
    option.textContent = `${macro.name} (${macro.id})`;
    elements.macroSelect.appendChild(option);
  });

  const hasOptions = state.macros.length > 0;
  elements.macroSelect.disabled = !hasOptions;
  if (!hasOptions) {
    return;
  }

  const validValue = state.macros.some((macro) => macro.id === previousValue)
    ? previousValue
    : state.macros[0].id;
  elements.macroSelect.value = validValue;
}

function updateShortcutPreview() {
  const modifiers = getCheckedModifiers();
  const normalizedModifiers = sanitizeShortcutModifiers(modifiers);
  const base = sanitizeKeycode(elements.shortcutKeyInput.value || elements.shortcutKeySelect.value);
  const wrapped = buildShortcutToken(normalizedModifiers, base);
  const readable = [...normalizedModifiers.map((m) => MODIFIER_NAMES[m] || m), keycodeToFriendlyLabel(base)].join(
    " + ",
  );

  elements.shortcutKeyInput.value = base;
  ensureSelectContainsValue(elements.shortcutKeySelect, base);
  elements.shortcutPreview.value = wrapped;
  elements.shortcutFriendlyPreview.value = readable;
}

function renderEditor() {
  const assignment = getSelectedAssignment();
  elements.selectedKeyLabel.textContent = `Layer ${state.activeLayer + 1} - Tasto ${
    state.selectedKey + 1
  }`;
  elements.actionType.value = assignment.type;
  renderEditorSections(assignment.type);

  if (assignment.type === "keycode") {
    const keycode = sanitizeKeycode(assignment.keycode);
    elements.keycodeInput.value = keycode;
    ensureSelectContainsValue(elements.keycodeSelect, keycode);
  }

  if (assignment.type === "shortcut") {
    const modifiers = sanitizeShortcutModifiers(assignment.modifiers);
    const selectedSet = new Set(modifiers);
    document.querySelectorAll(".modifier").forEach((checkbox) => {
      checkbox.checked = selectedSet.has(checkbox.value);
    });

    const keycode = sanitizeKeycode(assignment.keycode);
    elements.shortcutKeyInput.value = keycode;
    ensureSelectContainsValue(elements.shortcutKeySelect, keycode);
    updateShortcutPreview();
  }

  if (assignment.type === "macro") {
    renderMacroSelect();
    if (state.macros.length > 0) {
      elements.macroSelect.value = assignment.macroId || state.macros[0].id;
    }
  }
}

function readableShortcutLabel(modifiers, keycode) {
  const modifierLabels = sanitizeShortcutModifiers(modifiers).map(
    (modifier) => MODIFIER_NAMES[modifier] || modifier,
  );
  return [...modifierLabels, keycodeToFriendlyLabel(keycode)].join(" + ");
}

function renderMacroList() {
  elements.macroList.textContent = "";
  state.macros.forEach((macro) => {
    if (!Array.isArray(macro.steps)) {
      macro.steps = [];
    }
    macro.steps = macro.steps.map((step, stepIndex) => sanitizeMacroStep(step, stepIndex));
    refreshMacroBody(macro);

    const wrapper = document.createElement("article");
    wrapper.className = "macro-item";

    const header = document.createElement("div");
    header.className = "macro-header";

    const nameInput = document.createElement("input");
    nameInput.value = macro.name;
    nameInput.placeholder = macro.id;
    nameInput.setAttribute("aria-label", `Nome ${macro.id}`);
    nameInput.addEventListener("input", (event) => {
      macro.name = String(event.target.value || "").trim() || macro.id;
      renderMacroSelect();
      renderGrid();
      renderPreview();
    });

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-macro";
    removeButton.textContent = "Rimuovi";
    removeButton.addEventListener("click", () => {
      state.macros = state.macros.filter((item) => item.id !== macro.id);
      ensureValidMacroAssignments();
      renderAll();
      setStatus(`Macro ${macro.id} rimossa.`);
    });

    header.append(nameInput, removeButton);
    wrapper.appendChild(header);

    const toolbar = document.createElement("div");
    toolbar.className = "macro-toolbar";

    const addStepButtons = [
      { kind: "key", label: "+ Tasto" },
      { kind: "shortcut", label: "+ Scorciatoia" },
      { kind: "text", label: "+ Testo" },
      { kind: "delay", label: "+ Pausa" },
    ];

    addStepButtons.forEach((buttonConfig) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ghost-button";
      button.textContent = buttonConfig.label;
      button.addEventListener("click", () => {
        macro.steps.push(createMacroStep(buttonConfig.kind));
        refreshMacroBody(macro);
        renderMacroList();
        renderPreview();
      });
      toolbar.appendChild(button);
    });

    wrapper.appendChild(toolbar);

    const presetBar = document.createElement("div");
    presetBar.className = "macro-presets";
    const presetLabel = document.createElement("span");
    presetLabel.className = "macro-presets-label";
    presetLabel.textContent = "Preset rapidi:";
    presetBar.appendChild(presetLabel);

    const presets = [
      { label: "Copia", modifiers: ["LCTL"], keycode: "KC_C" },
      { label: "Incolla", modifiers: ["LCTL"], keycode: "KC_V" },
      { label: "Taglia", modifiers: ["LCTL"], keycode: "KC_X" },
      { label: "Salva", modifiers: ["LCTL"], keycode: "KC_S" },
      { label: "Annulla", modifiers: ["LCTL"], keycode: "KC_Z" },
      { label: "Trova", modifiers: ["LCTL"], keycode: "KC_F" },
    ];

    presets.forEach((preset) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ghost-button preset-button";
      button.textContent = preset.label;
      button.addEventListener("click", () => {
        macro.steps.push(
          createMacroStep("shortcut", {
            modifiers: preset.modifiers,
            keycode: preset.keycode,
          }),
        );
        refreshMacroBody(macro);
        renderMacroList();
        renderPreview();
      });
      presetBar.appendChild(button);
    });

    wrapper.appendChild(presetBar);

    const stepsContainer = document.createElement("div");
    stepsContainer.className = "macro-steps";

    if (macro.steps.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "macro-empty";
      emptyMessage.textContent =
        "Nessuno step. Aggiungi un Tasto, Scorciatoia, Testo o Pausa.";
      stepsContainer.appendChild(emptyMessage);
    }

    macro.steps.forEach((step, stepIndex) => {
      const card = document.createElement("div");
      card.className = "macro-step";

      const topRow = document.createElement("div");
      topRow.className = "macro-step-top";

      const leftGroup = document.createElement("div");
      leftGroup.className = "macro-step-left";

      const indexBadge = document.createElement("span");
      indexBadge.className = "macro-step-index";
      indexBadge.textContent = `Step ${stepIndex + 1}`;

      const typeSelect = document.createElement("select");
      typeSelect.className = "macro-step-type";
      MACRO_STEP_KIND_OPTIONS.forEach((optionConfig) => {
        const option = document.createElement("option");
        option.value = optionConfig.value;
        option.textContent = optionConfig.label;
        typeSelect.appendChild(option);
      });
      typeSelect.value = step.kind;
      typeSelect.addEventListener("change", (event) => {
        const nextKind = String(event.target.value || "key");
        macro.steps[stepIndex] = createMacroStep(nextKind, {
          id: step.id,
          keycode: step.keycode,
          modifiers: step.modifiers,
          text: step.text,
          ms: step.ms,
        });
        refreshMacroBody(macro);
        renderMacroList();
        renderPreview();
      });

      leftGroup.append(indexBadge, typeSelect);

      const actions = document.createElement("div");
      actions.className = "macro-step-actions";

      const upButton = document.createElement("button");
      upButton.type = "button";
      upButton.className = "ghost-button";
      upButton.textContent = "↑";
      upButton.disabled = stepIndex === 0;
      upButton.addEventListener("click", () => {
        const previous = macro.steps[stepIndex - 1];
        macro.steps[stepIndex - 1] = macro.steps[stepIndex];
        macro.steps[stepIndex] = previous;
        refreshMacroBody(macro);
        renderMacroList();
        renderPreview();
      });

      const downButton = document.createElement("button");
      downButton.type = "button";
      downButton.className = "ghost-button";
      downButton.textContent = "↓";
      downButton.disabled = stepIndex === macro.steps.length - 1;
      downButton.addEventListener("click", () => {
        const next = macro.steps[stepIndex + 1];
        macro.steps[stepIndex + 1] = macro.steps[stepIndex];
        macro.steps[stepIndex] = next;
        refreshMacroBody(macro);
        renderMacroList();
        renderPreview();
      });

      const cloneButton = document.createElement("button");
      cloneButton.type = "button";
      cloneButton.className = "ghost-button";
      cloneButton.textContent = "Duplica";
      cloneButton.addEventListener("click", () => {
        const duplicated = createMacroStep(step.kind, {
          keycode: step.keycode,
          modifiers: step.modifiers,
          text: step.text,
          ms: step.ms,
        });
        macro.steps.splice(stepIndex + 1, 0, duplicated);
        refreshMacroBody(macro);
        renderMacroList();
        renderPreview();
      });

      const removeStepButton = document.createElement("button");
      removeStepButton.type = "button";
      removeStepButton.className = "remove-macro-step";
      removeStepButton.textContent = "Elimina";
      removeStepButton.addEventListener("click", () => {
        macro.steps.splice(stepIndex, 1);
        refreshMacroBody(macro);
        renderMacroList();
        renderPreview();
      });

      actions.append(upButton, downButton, cloneButton, removeStepButton);

      topRow.append(leftGroup, actions);
      card.appendChild(topRow);

      const editor = document.createElement("div");
      editor.className = "macro-step-editor";

      if (step.kind === "key") {
        const keySelect = document.createElement("select");
        populateFriendlyKeySelect(keySelect);
        ensureSelectContainsValue(keySelect, step.keycode);
        keySelect.addEventListener("change", () => {
          step.keycode = sanitizeKeycode(keySelect.value);
          refreshMacroBody(macro);
          renderPreview();
        });

        const helper = document.createElement("p");
        helper.className = "macro-step-preview";
        helper.textContent = `Invia: ${keycodeToFriendlyLabel(step.keycode)}`;
        keySelect.addEventListener("change", () => {
          helper.textContent = `Invia: ${keycodeToFriendlyLabel(step.keycode)}`;
        });

        editor.append(keySelect, helper);
      }

      if (step.kind === "shortcut") {
        const modifiersRow = document.createElement("div");
        modifiersRow.className = "macro-shortcut-modifiers";
        const selectedModifiers = new Set(sanitizeShortcutModifiers(step.modifiers));
        const modifierCheckboxes = [];

        MODIFIER_ORDER.forEach((modifier) => {
          const label = document.createElement("label");
          label.className = "macro-modifier-pill";

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.value = modifier;
          checkbox.checked = selectedModifiers.has(modifier);

          const text = document.createElement("span");
          text.textContent = MODIFIER_NAMES[modifier] || modifier;

          label.append(checkbox, text);
          modifiersRow.appendChild(label);
          modifierCheckboxes.push(checkbox);
        });

        const baseSelect = document.createElement("select");
        populateFriendlyKeySelect(baseSelect);
        ensureSelectContainsValue(baseSelect, step.keycode);

        const readableLine = document.createElement("p");
        readableLine.className = "macro-step-preview";

        const viaLine = document.createElement("p");
        viaLine.className = "macro-step-preview technical";

        const refreshShortcutStep = () => {
          step.modifiers = sanitizeShortcutModifiers(
            modifierCheckboxes.filter((input) => input.checked).map((input) => input.value),
          );
          step.keycode = sanitizeKeycode(baseSelect.value);

          readableLine.textContent = `Scorciatoia: ${readableShortcutLabel(
            step.modifiers,
            step.keycode,
          )}`;
          viaLine.textContent = `Codice VIA: ${buildShortcutToken(step.modifiers, step.keycode)}`;

          refreshMacroBody(macro);
          renderPreview();
        };

        modifierCheckboxes.forEach((input) => input.addEventListener("change", refreshShortcutStep));
        baseSelect.addEventListener("change", refreshShortcutStep);
        refreshShortcutStep();

        editor.append(modifiersRow, baseSelect, readableLine, viaLine);
      }

      if (step.kind === "text") {
        const textArea = document.createElement("textarea");
        textArea.className = "macro-step-text";
        textArea.rows = 3;
        textArea.placeholder = "Testo da digitare...";
        textArea.value = String(step.text || "");
        textArea.addEventListener("input", () => {
          step.text = String(textArea.value || "");
          refreshMacroBody(macro);
          renderPreview();
        });

        editor.appendChild(textArea);
      }

      if (step.kind === "delay") {
        const delayRow = document.createElement("div");
        delayRow.className = "macro-delay-row";

        const range = document.createElement("input");
        range.type = "range";
        range.min = "0";
        range.max = String(MAX_MACRO_DELAY_MS);
        range.step = "10";

        const number = document.createElement("input");
        number.type = "number";
        number.min = "0";
        number.max = String(MAX_MACRO_DELAY_MS);
        number.step = "10";

        const syncDelay = (value) => {
          const parsed = Number(value);
          const ms = clamp(
            Number.isFinite(parsed) ? Math.round(parsed) : DEFAULT_MACRO_DELAY_MS,
            0,
            MAX_MACRO_DELAY_MS,
          );
          step.ms = ms;
          range.value = String(ms);
          number.value = String(ms);
          refreshMacroBody(macro);
          renderPreview();
        };

        syncDelay(step.ms);

        range.addEventListener("input", () => syncDelay(range.value));
        number.addEventListener("input", () => syncDelay(number.value));

        delayRow.append(range, number);
        editor.appendChild(delayRow);
      }

      card.appendChild(editor);
      stepsContainer.appendChild(card);
    });

    wrapper.appendChild(stepsContainer);

    const technicalDetails = document.createElement("details");
    technicalDetails.className = "advanced-details";
    const summary = document.createElement("summary");
    summary.textContent = "Anteprima tecnica macro";
    const pre = document.createElement("pre");
    pre.className = "macro-technical";
    pre.textContent = macro.body || "(macro vuota)";
    technicalDetails.append(summary, pre);

    wrapper.appendChild(technicalDetails);
    elements.macroList.appendChild(wrapper);
  });
}

function buildExportPayload() {
  ensureEncoderStateConsistency();
  const exportedLayers = state.layers.map((layer) => layer.map((item) => cloneAssignment(item)));
  const viaLayers = state.layers.map((layer) => layer.map(assignmentToViaToken));
  const exportedEncoders = state.encoders.map((layer) =>
    layer.map((binding) => sanitizeEncoderBinding(binding)),
  );
  const encoderTokens = exportedEncoders.map((layer) =>
    layer.map((binding) => ({
      ccw: encoderActionToViaToken(binding.ccw),
      cw: encoderActionToViaToken(binding.cw),
    })),
  );
  const viaEncoderMap = exportedEncoders.map((layer) =>
    layer.map(
      (binding) =>
        `ENCODER_CCW_CW(${encoderActionToViaToken(binding.ccw)}, ${encoderActionToViaToken(binding.cw)})`,
    ),
  );
  const exportedMacros = state.macros.map((macro) => {
    if (!Array.isArray(macro.steps)) {
      macro.steps = [];
    }
    macro.steps = macro.steps.map((step, stepIndex) => sanitizeMacroStep(step, stepIndex));
    refreshMacroBody(macro);
    return JSON.parse(
      JSON.stringify({
        id: macro.id,
        name: macro.name,
        body: macro.body,
        steps: macro.steps,
      }),
    );
  });

  return {
    version: 1,
    app: "creator-micro-mapper",
    device: "Work Louder Creator Micro",
    profileName: state.profileName,
    keyCount: state.keyCount,
    knobCount: state.knobCount,
    activeLayer: state.activeLayer,
    selectedKey: state.selectedKey,
    exportedAt: new Date().toISOString(),
    layers: exportedLayers,
    encoders: exportedEncoders,
    macros: exportedMacros,
    viaPreview: {
      layers: viaLayers,
      encoders: exportedEncoders,
      encoderTokens,
      encoderMap: viaEncoderMap,
      macros: exportedMacros.map((macro) => macro.body),
    },
  };
}

function renderPreview() {
  const payload = buildExportPayload();
  elements.jsonPreview.value = JSON.stringify(payload, null, 2);
}

function renderAll() {
  elements.profileName.value = state.profileName;
  elements.keyCount.value = String(state.keyCount);
  elements.knobCount.value = String(state.knobCount);
  renderLayerSelect();
  renderGrid();
  renderEditor();
  renderEncoderList();
  renderMacroSelect();
  renderMacroList();
  renderPreview();
}

function updateSelectedAssignmentFromEditor() {
  const actionType = elements.actionType.value;

  if (actionType === "keycode") {
    const keycode = sanitizeKeycode(elements.keycodeInput.value || elements.keycodeSelect.value);
    elements.keycodeInput.value = keycode;
    ensureSelectContainsValue(elements.keycodeSelect, keycode);
    setSelectedAssignment({
      type: "keycode",
      keycode,
    });
  } else if (actionType === "shortcut") {
    const modifiers = sanitizeShortcutModifiers(getCheckedModifiers());
    const keycode = sanitizeKeycode(
      elements.shortcutKeyInput.value || elements.shortcutKeySelect.value,
    );
    elements.shortcutKeyInput.value = keycode;
    ensureSelectContainsValue(elements.shortcutKeySelect, keycode);
    setSelectedAssignment({ type: "shortcut", modifiers, keycode });
    updateShortcutPreview();
  } else if (actionType === "macro") {
    if (state.macros.length === 0) {
      const id = generateNextMacroId();
      state.macros.push(createMacro(id, `Macro ${id.slice(1)}`));
    }
    setSelectedAssignment({
      type: "macro",
      macroId: sanitizeMacroId(elements.macroSelect.value) || state.macros[0].id,
    });
  }

  renderMacroSelect();
  renderGrid();
  renderPreview();
}

function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buildExportPayload()));
    setStatus("Profilo salvato nel browser.");
  } catch (error) {
    setStatus("Impossibile salvare nel browser.");
  }
}

function loadFromLocalStorage({ silent = false } = {}) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      if (!silent) {
        setStatus("Nessun profilo locale trovato.");
      }
      return;
    }
    const parsed = JSON.parse(raw);
    state = normalizeImportedState(parsed);
    ensureValidMacroAssignments();
    renderAll();
    if (!silent) {
      setStatus("Profilo caricato dal browser.");
    }
  } catch (error) {
    if (!silent) {
      setStatus("Caricamento locale non riuscito.");
    }
  }
}

function exportJsonFile() {
  const payload = JSON.stringify(buildExportPayload(), null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${state.profileName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  setStatus("JSON scaricato.");
}

function importJsonFile(file) {
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || "{}"));
      state = normalizeImportedState(parsed);
      ensureValidMacroAssignments();
      renderAll();
      setStatus("Profilo importato.");
    } catch (error) {
      setStatus("Import non riuscito: JSON non valido.");
    }
  };
  reader.readAsText(file);
}

function initializeFriendlyInputs() {
  populateFriendlyKeySelect(elements.keycodeSelect);
  populateFriendlyKeySelect(elements.shortcutKeySelect);
  ensureSelectContainsValue(elements.keycodeSelect, "KC_NO");
  ensureSelectContainsValue(elements.shortcutKeySelect, "KC_NO");
}

function bindEvents() {
  elements.profileName.addEventListener("input", (event) => {
    state.profileName = String(event.target.value || "").trim() || "Creator Micro Profile";
    renderPreview();
  });

  elements.layerSelect.addEventListener("change", (event) => {
    state.activeLayer = clamp(Number(event.target.value), 0, state.layers.length - 1);
    renderGrid();
    renderEditor();
    renderEncoderList();
    renderPreview();
  });

  elements.keyCount.addEventListener("change", (event) => {
    const parsed = Number(event.target.value);
    if (!Number.isFinite(parsed)) {
      elements.keyCount.value = String(state.keyCount);
      return;
    }
    const nextCount = clamp(Math.round(parsed), 1, MAX_KEY_COUNT);
    resizeLayers(nextCount);
    renderAll();
    setStatus(`Numero tasti aggiornato a ${nextCount}.`);
  });

  elements.knobCount.addEventListener("change", (event) => {
    const parsed = Number(event.target.value);
    if (!Number.isFinite(parsed)) {
      elements.knobCount.value = String(state.knobCount);
      return;
    }
    const nextCount = clamp(Math.round(parsed), 1, MAX_KNOB_COUNT);
    resizeEncoders(nextCount);
    renderAll();
    setStatus(`Numero knob aggiornato a ${nextCount}.`);
  });

  elements.actionType.addEventListener("change", () => {
    renderEditorSections(elements.actionType.value);
    updateSelectedAssignmentFromEditor();
    renderEditor();
  });

  elements.keycodeSelect.addEventListener("change", () => {
    const selectedCode = sanitizeKeycode(elements.keycodeSelect.value);
    elements.keycodeInput.value = selectedCode;
    updateSelectedAssignmentFromEditor();
  });

  elements.keycodeInput.addEventListener("input", () => {
    const typed = normalizeTypedKeycode(elements.keycodeInput.value);
    if (!typed) {
      return;
    }
    elements.keycodeInput.value = typed;
    ensureSelectContainsValue(elements.keycodeSelect, typed);
    updateSelectedAssignmentFromEditor();
  });

  elements.keycodeInput.addEventListener("blur", () => {
    const code = sanitizeKeycode(elements.keycodeInput.value || elements.keycodeSelect.value);
    elements.keycodeInput.value = code;
    ensureSelectContainsValue(elements.keycodeSelect, code);
    updateSelectedAssignmentFromEditor();
  });

  elements.shortcutKeySelect.addEventListener("change", () => {
    const selectedCode = sanitizeKeycode(elements.shortcutKeySelect.value);
    elements.shortcutKeyInput.value = selectedCode;
    updateShortcutPreview();
    updateSelectedAssignmentFromEditor();
  });

  elements.shortcutKeyInput.addEventListener("input", () => {
    const typed = normalizeTypedKeycode(elements.shortcutKeyInput.value);
    if (!typed) {
      return;
    }
    elements.shortcutKeyInput.value = typed;
    ensureSelectContainsValue(elements.shortcutKeySelect, typed);
    updateShortcutPreview();
    updateSelectedAssignmentFromEditor();
  });

  elements.shortcutKeyInput.addEventListener("blur", () => {
    const code = sanitizeKeycode(
      elements.shortcutKeyInput.value || elements.shortcutKeySelect.value,
    );
    elements.shortcutKeyInput.value = code;
    ensureSelectContainsValue(elements.shortcutKeySelect, code);
    updateShortcutPreview();
    updateSelectedAssignmentFromEditor();
  });

  document.querySelectorAll(".modifier").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateShortcutPreview();
      updateSelectedAssignmentFromEditor();
    });
  });

  elements.macroSelect.addEventListener("change", updateSelectedAssignmentFromEditor);

  elements.addMacroButton.addEventListener("click", () => {
    const id = generateNextMacroId();
    state.macros.push(createMacro(id, `Macro ${id.slice(1)}`));
    renderAll();
    setStatus(`Aggiunta ${id}.`);
  });

  elements.applyScrollPresetButton.addEventListener("click", () => {
    ensureEncoderStateConsistency();
    const activeLayerEncoders = state.encoders[state.activeLayer];
    for (const encoder of activeLayerEncoders) {
      encoder.ccw = createEncoderAction("keycode", { keycode: "KC_WH_U" });
      encoder.cw = createEncoderAction("keycode", { keycode: "KC_WH_D" });
    }
    renderEncoderList();
    renderPreview();
    setStatus("Preset scroll applicato ai knob del layer corrente.");
  });

  elements.applyAltScrollPresetButton.addEventListener("click", () => {
    ensureEncoderStateConsistency();
    const activeLayerEncoders = state.encoders[state.activeLayer];
    const targetEncoder = activeLayerEncoders[1] || activeLayerEncoders[0];
    if (!targetEncoder) {
      return;
    }

    targetEncoder.ccw = createEncoderAction("shortcut", {
      modifiers: ["LALT"],
      keycode: "KC_WH_U",
    });
    targetEncoder.cw = createEncoderAction("shortcut", {
      modifiers: ["LALT"],
      keycode: "KC_WH_D",
    });

    renderEncoderList();
    renderPreview();
    setStatus("Preset Alt+scroll applicato al knob di scroll.");
  });

  elements.saveLocalButton.addEventListener("click", saveToLocalStorage);
  elements.loadLocalButton.addEventListener("click", () => loadFromLocalStorage());
  elements.resetButton.addEventListener("click", () => {
    state = buildDefaultState();
    renderAll();
    setStatus("Profilo resettato.");
  });
  elements.exportButton.addEventListener("click", exportJsonFile);
  elements.importInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    importJsonFile(file);
    event.target.value = "";
  });
}

initializeFriendlyInputs();
bindEvents();
loadFromLocalStorage({ silent: true });
renderAll();
