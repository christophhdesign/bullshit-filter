const DEFAULT_SETTINGS = {
  enabled: true,
  keywords: ["AI", "LLM", "Vibe coding"],
  sites: ["linkedin.com"],
};

let currentSettings = { ...DEFAULT_SETTINGS };
let observer = null;

function normalizeList(value) {
  return value
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function shouldRunOnHost(hostname, sites) {
  const host = hostname.toLowerCase();
  if (!sites.length) {
    return false;
  }

  return sites.some((site) => {
    if (!site) {
      return false;
    }
    const cleaned = site.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    return host === cleaned || host.endsWith(`.${cleaned}`) || host.includes(cleaned);
  });
}

function getPostElements() {
  return Array.from(
    document.querySelectorAll(
      "div.feed-shared-update-v2, div.update-components-update, div.occludable-update"
    )
  );
}

function hidePost(post) {
  if (post.dataset.bullshitHidden === "true") {
    return;
  }
  post.dataset.bullshitHidden = "true";
  post.style.display = "none";
}

function filterPosts() {
  if (!currentSettings.enabled) {
    return;
  }

  const keywords = normalizeList(currentSettings.keywords);
  if (!keywords.length) {
    return;
  }

  const posts = getPostElements();
  posts.forEach((post) => {
    const text = post.innerText.toLowerCase();
    if (keywords.some((keyword) => text.includes(keyword))) {
      hidePost(post);
    }
  });
}

function startObserver() {
  if (observer) {
    observer.disconnect();
  }

  observer = new MutationObserver(() => {
    filterPosts();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function stopObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

function applySettings(settings) {
  currentSettings = {
    ...DEFAULT_SETTINGS,
    ...settings,
  };

  const shouldRun = shouldRunOnHost(window.location.hostname, currentSettings.sites);
  if (currentSettings.enabled && shouldRun) {
    filterPosts();
    startObserver();
  } else {
    stopObserver();
  }
}

chrome.storage.sync.get(DEFAULT_SETTINGS, applySettings);

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync") {
    return;
  }

  const updated = { ...currentSettings };
  Object.keys(changes).forEach((key) => {
    updated[key] = changes[key].newValue;
  });
  applySettings(updated);
});
