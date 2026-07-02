# The Interactive App

This turns the Markdown course into a navigable web app: sidebar nav, rendered Mermaid diagrams, syntax highlighting, **progress tracking**, **search**, and a **flashcard** mode (auto-built from each lesson's "Revision Notes").

## Why a local server (not double-click)

The app loads lesson files with `fetch()`. Browsers block `fetch()` on `file://` URLs for security, so opening `index.html` directly will show a "couldn't load" message. Serve the `platform/` folder over HTTP instead — it takes one command.

## Launch (Windows)

From the `platform/` folder (the parent of `app/`):

**Easiest:** double-click `app/launch.bat` (starts a server and opens your browser).

**Manual:**
```cmd
cd "c:\Users\athar\Downloads\System Design\platform"
python -m http.server 8080
```
Then open: http://localhost:8080/app/

(If you don't have Python, any static server works, e.g. `npx serve` from the `platform/` folder, then visit the `/app/` path.)

## Keyboard shortcuts
- `/` — focus search
- `j` / `k` — next / previous lesson
- `f` — open flashcards for the current lesson
- In flashcards: `space` flip · `←` `→` navigate · `esc` close

## Notes
- Progress and collapsed-section state are saved in your browser's `localStorage` (per-browser, on this machine).
- Diagrams, highlighting, and Markdown use CDN libraries, so the app needs internet access the first time you load it.
- The navigation is driven entirely by `manifest.js`. As new lessons are added to the course, they're registered there and appear automatically — no other changes needed.
