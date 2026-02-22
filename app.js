const STORAGE_KEY = "creator-micro-mapper-profile-v1";
const DEFAULT_KEY_COUNT = 12;
const DEFAULT_LAYER_COUNT = 3;
const MAX_KEY_COUNT = 64;
const MODIFIER_ORDER = ["LCTL", "LSFT", "LALT", "LGUI"];
const MODIFIER_NAMES = {
  LCTL: "Ctrl",
  LSFT: "Shift",
  LALT: "Alt",
  LGUI: "Gui",
};

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
  keycodeInput: document.getElementById("keycodeInput"),
  shortcutKeyInput: document.getElementById("shortcutKeyInput"),
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

function sanitizeAssignment(raw) {
  if (!raw) {
    return createDefaultAssignment();
  }

  if (typeof raw === "string") {
    return { type: "keycode", keycode: sanitizeKeycode(raw) };
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

  return {
    type: "keycode",
    keycode: sanitizeKeycode(raw.keycode),
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
    return macro ? `Macro: ${macro.name}` : "Macro: (missing)";
  }

  if (assignment.type === "shortcut") {
    const modifierLabels = sanitizeShortcutModifiers(assignment.modifiers).map(
      (modifier) => MODIFIER_NAMES[modifier] || modifier,
    );
    return `${modifierLabels.join("+")}${modifierLabels.length ? "+" : ""}${sanitizeKeycode(
      assignment.keycode,
    )}`;
  }

  return sanitizeKeycode(assignment.keycode);
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
  const modifiers = Array.from(document.querySelectorAll(".modifier:checked")).map(
    (checkbox) => checkbox.value,
  );
  const normalizedModifiers = sanitizeShortcutModifiers(modifiers);
  const base = sanitizeKeycode(elements.shortcutKeyInput.value);
  const wrapped = normalizedModifiers.reduceRight(
    (current, modifier) => `${modifier}(${current})`,
    base,
  );
  elements.shortcutPreview.value = wrapped;
}

function renderEditor() {
  const assignment = getSelectedAssignment();
  elements.selectedKeyLabel.textContent = `Layer ${state.activeLayer + 1} - Key ${
    state.selectedKey + 1
  }`;
  elements.actionType.value = assignment.type;
  renderEditorSections(assignment.type);

  if (assignment.type === "keycode") {
    elements.keycodeInput.value = sanitizeKeycode(assignment.keycode);
  }

  if (assignment.type === "shortcut") {
    const modifiers = sanitizeShortcutModifiers(assignment.modifiers);
    const selectedSet = new Set(modifiers);
    document.querySelectorAll(".modifier").forEach((checkbox) => {
      checkbox.checked = selectedSet.has(checkbox.value);
    });
    elements.shortcutKeyInput.value = sanitizeKeycode(assignment.keycode);
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
    nameInput.setAttribute("aria-label", `Name for ${macro.id}`);
    nameInput.addEventListener("input", (event) => {
      macro.name = String(event.target.value || "").trim() || macro.id;
      renderMacroSelect();
      renderGrid();
      renderPreview();
    });

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-macro";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      state.macros = state.macros.filter((item) => item.id !== macro.id);
      ensureValidMacroAssignments();
      renderAll();
      setStatus(`Removed ${macro.id}`);
    });

    header.append(nameInput, removeButton);

    const body = document.createElement("textarea");
    body.value = macro.body;
    body.placeholder =
      "Macro body. Example: GUI+r\\nchrome\\nEnter (for your own reference).";
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
    setSelectedAssignment({
      type: "keycode",
      keycode: sanitizeKeycode(elements.keycodeInput.value),
    });
  } else if (actionType === "shortcut") {
    const modifiers = Array.from(document.querySelectorAll(".modifier:checked")).map(
      (checkbox) => checkbox.value,
    );
    const normalizedModifiers = sanitizeShortcutModifiers(modifiers);
    const keycode = sanitizeKeycode(elements.shortcutKeyInput.value);
    setSelectedAssignment({ type: "shortcut", modifiers: normalizedModifiers, keycode });
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
    setStatus("Saved profile in browser storage.");
  } catch (error) {
    setStatus("Could not save profile in local storage.");
  }
}

function loadFromLocalStorage({ silent = false } = {}) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      if (!silent) {
        setStatus("No saved profile found in browser storage.");
      }
      return;
    }
    const parsed = JSON.parse(raw);
    state = normalizeImportedState(parsed);
    ensureValidMacroAssignments();
    renderAll();
    if (!silent) {
      setStatus("Loaded profile from browser storage.");
    }
  } catch (error) {
    if (!silent) {
      setStatus("Failed to load profile from browser storage.");
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
  setStatus("Downloaded profile JSON.");
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
      setStatus("Imported profile JSON.");
    } catch (error) {
      setStatus("Import failed: invalid JSON file.");
    }
  };
  reader.readAsText(file);
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
    setStatus(`Updated key count to ${nextCount}.`);
  });

  elements.actionType.addEventListener("change", () => {
    renderEditorSections(elements.actionType.value);
    updateSelectedAssignmentFromEditor();
    renderEditor();
  });

  elements.keycodeInput.addEventListener("input", updateSelectedAssignmentFromEditor);

  elements.shortcutKeyInput.addEventListener("input", () => {
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
    setStatus(`Added ${id}.`);
  });

  elements.saveLocalButton.addEventListener("click", saveToLocalStorage);
  elements.loadLocalButton.addEventListener("click", () => loadFromLocalStorage());
  elements.resetButton.addEventListener("click", () => {
    state = buildDefaultState();
    renderAll();
    setStatus("Reset profile.");
  });
  elements.exportButton.addEventListener("click", exportJsonFile);
  elements.importInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    importJsonFile(file);
    event.target.value = "";
  });
}

bindEvents();
loadFromLocalStorage({ silent: true });
renderAll();
