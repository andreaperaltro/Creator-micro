const STORAGE_KEY = "creator-micro-mapper-profile-v1";
const DEFAULT_KEY_COUNT = 12;
const DEFAULT_LAYER_COUNT = 3;
const MAX_KEY_COUNT = 64;
const MODIFIER_ORDER = ["LCTL", "LSFT", "LALT", "LGUI"];
const MODIFIER_NAMES = {
  LCTL: "Ctrl",
  LSFT: "Maiusc",
  LALT: "Alt",
  LGUI: "Cmd/Win",
};

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

  return {
    profileName: "Creator Micro Profile",
    keyCount: DEFAULT_KEY_COUNT,
    activeLayer: 0,
    selectedKey: 0,
    layers,
    macros: [],
  };
}

function createLayer(keyCount) {
  return Array.from({ length: keyCount }, () => createDefaultAssignment());
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

function sanitizeMacro(rawMacro, index) {
  if (typeof rawMacro === "string") {
    return {
      id: `M${index + 1}`,
      name: `Macro ${index + 1}`,
      body: rawMacro,
    };
  }

  const name = String(rawMacro?.name || "").trim() || `Macro ${index + 1}`;
  const body = String(rawMacro?.body || "");
  const id = sanitizeMacroId(rawMacro?.id) || `M${index + 1}`;
  return { id, name, body };
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

  return {
    profileName:
      String(raw?.profileName || "").trim() || "Creator Micro Imported Profile",
    keyCount,
    activeLayer: clamp(Number(raw?.activeLayer || 0), 0, layerCount - 1),
    selectedKey: clamp(Number(raw?.selectedKey || 0), 0, keyCount - 1),
    layers,
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
    const base = sanitizeKeycode(assignment.keycode);
    return sanitizeShortcutModifiers(assignment.modifiers).reduceRight(
      (wrapped, modifier) => `${modifier}(${wrapped})`,
      base,
    );
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
  const wrapped = normalizedModifiers.reduceRight(
    (current, modifier) => `${modifier}(${current})`,
    base,
  );
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

function renderMacroList() {
  elements.macroList.textContent = "";
  state.macros.forEach((macro) => {
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

    const body = document.createElement("textarea");
    body.value = macro.body;
    body.placeholder =
      "Testo macro. Esempio: GUI+r\\nchrome\\nEnter (promemoria personale).";
    body.addEventListener("input", (event) => {
      macro.body = String(event.target.value || "");
      renderPreview();
    });

    wrapper.append(header, body);
    elements.macroList.appendChild(wrapper);
  });
}

function buildExportPayload() {
  const exportedLayers = state.layers.map((layer) => layer.map((item) => cloneAssignment(item)));
  const viaLayers = state.layers.map((layer) => layer.map(assignmentToViaToken));

  return {
    version: 1,
    app: "creator-micro-mapper",
    device: "Work Louder Creator Micro",
    profileName: state.profileName,
    keyCount: state.keyCount,
    activeLayer: state.activeLayer,
    selectedKey: state.selectedKey,
    exportedAt: new Date().toISOString(),
    layers: exportedLayers,
    macros: state.macros.map((macro) => ({ ...macro })),
    viaPreview: {
      layers: viaLayers,
      macros: state.macros.map((macro) => macro.body),
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
  renderLayerSelect();
  renderGrid();
  renderMacroSelect();
  renderMacroList();
  renderEditor();
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
      state.macros.push({ id, name: `Macro ${id.slice(1)}`, body: "" });
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
    state.macros.push({ id, name: `Macro ${id.slice(1)}`, body: "" });
    renderAll();
    setStatus(`Aggiunta ${id}.`);
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
