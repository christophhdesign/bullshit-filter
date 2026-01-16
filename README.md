# Bullshit Filter (Chrome Extension)

Hide LinkedIn posts (or any site you choose) that match your custom keyword list.

## Features
- Keyword-based filtering for feed posts.
- Simple popup to add keywords and allowed sites.
- Activate/deactivate toggle.
- Works on any site you enable (default: LinkedIn).

## Install (Unpacked)
1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this folder.

## Usage
1. Click the extension icon.
2. Add keywords (comma or newline separated).
3. Add sites (comma or newline separated, e.g. `linkedin.com`).
4. Click **Save Settings** and **Activate**.

## Notes
- The extension only runs on sites listed in the popup.
- New posts are filtered automatically as you scroll.

## Tech
- Manifest V3
- `chrome.storage.sync` for settings

## License
MIT
