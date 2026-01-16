const DEFAULT_SETTINGS = {
  enabled: true,
  keywords: [
    "synergy",
    "hustle",
    "thought leadership",
    "AI",
    "LLM",
    "Vibe coding",
  ],
  sites: ["linkedin.com"],
};

const statusIndicator = document.getElementById("status-indicator");
const statusText = document.getElementById("status-text");
const keywordsInput = document.getElementById("keywords");
const sitesInput = document.getElementById("sites");
const activateBtn = document.getElementById("activate-btn");
const deactivateBtn = document.getElementById("deactivate-btn");
const saveBtn = document.getElementById("save-btn");
const saveStatus = document.getElementById("save-status");

function normalizeList(value) {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function setStatus(enabled) {
  statusIndicator.classList.toggle("active", enabled);
  statusIndicator.classList.toggle("inactive", !enabled);
  statusText.textContent = enabled ? "Active" : "Inactive";
}

function setButtons(enabled) {
  activateBtn.disabled = enabled;
  deactivateBtn.disabled = !enabled;
}

function showSaveStatus(message) {
  saveStatus.textContent = message;
  if (message) {
    window.setTimeout(() => {
      saveStatus.textContent = "";
    }, 1500);
  }
}

function applySettingsToUI(settings) {
  setStatus(settings.enabled);
  setButtons(settings.enabled);
  keywordsInput.value = settings.keywords.join("\n");
  sitesInput.value = settings.sites.join("\n");
}

function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(DEFAULT_SETTINGS, resolve);
  });
}

function saveSettings(partial) {
  return new Promise((resolve) => {
    chrome.storage.sync.set(partial, resolve);
  });
}

activateBtn.addEventListener("click", async () => {
  await saveSettings({ enabled: true });
  setStatus(true);
  setButtons(true);
});

deactivateBtn.addEventListener("click", async () => {
  await saveSettings({ enabled: false });
  setStatus(false);
  setButtons(false);
});

saveBtn.addEventListener("click", async () => {
  const keywords = normalizeList(keywordsInput.value);
  const sites = normalizeList(sitesInput.value);

  await saveSettings({
    keywords,
    sites,
  });

  showSaveStatus("Saved");
});

getSettings().then((settings) => {
  applySettingsToUI(settings);
});
