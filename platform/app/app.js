/* =========================================================================
   System Design Mastery — front-end app logic
   - Renders Markdown lessons (marked) with Mermaid diagrams + highlight.js
   - Sidebar navigation from manifest.js
   - Progress tracking + flashcards (from "Revision Notes") via localStorage
   ========================================================================= */

const LS_PROGRESS = "sdm-progress-v1";
const LS_COLLAPSE = "sdm-collapse-v1";

const state = {
  flat: [],          // ordered list of all clickable {id,title,path,kind}
  current: null,     // current item id
  progress: load(LS_PROGRESS, {}),
  collapsed: load(LS_COLLAPSE, {}),
  flash: { cards: [], idx: 0, showAns: false },
};

function load(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } }
function save(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

/* ---------- Build flat ordered list (for paging + progress denominator) ---------- */
function buildFlat() {
  const flat = [];
  COURSE.backbone.forEach(d => flat.push({ ...d, kind: "doc" }));
  COURSE.parts.forEach(p => {
    (p.modules || []).forEach(m =>
      (m.lessons || []).forEach(l => flat.push({ ...l, kind: "lesson", part: p.num })));
  });
  COURSE.reference.forEach(d => flat.push({ ...d, kind: "ref" }));
  state.flat = flat;
}

const lessonItems = () => state.flat.filter(i => i.kind === "lesson");

/* ---------- Sidebar render ---------- */
function renderSidebar(filter = "") {
  const nav = document.getElementById("nav");
  const f = filter.trim().toLowerCase();
  const match = (t, id) => !f || t.toLowerCase().includes(f) || (id || "").toLowerCase().includes(f);
  let html = "";

  html += `<div class="nav-section-label">Getting Started</div>`;
  COURSE.backbone.forEach(d => {
    if (!match(d.title, d.id)) return;
    html += docRow(d);
  });

  html += `<div class="nav-section-label">Curriculum</div>`;
  COURSE.parts.forEach(p => {
    const anyMatch = f ? p.modules.some(m => m.lessons.some(l => match(l.title, l.id))) || match(p.title, "part " + p.num) : true;
    if (!anyMatch) return;
    const badge = p.status === "done" ? `<span class="part-badge badge-done">DONE</span>`
      : p.status === "in-progress" ? `<span class="part-badge badge-progress">SOON</span>`
      : `<span class="part-badge badge-planned">PLANNED</span>`;
    const collapsed = state.collapsed[p.id] && !f ? "collapsed" : "";
    html += `<div class="part ${collapsed}" data-part="${p.id}">
      <div class="part-header" onclick="togglePart('${p.id}')">
        <span>Part ${p.num}</span> ${badge}
        <span style="font-weight:400;color:var(--text-dim);font-size:12px">${p.title}</span>
        <span class="part-caret">▾</span>
      </div><div class="part-body">`;
    if (p.modules.length === 0) {
      html += `<div class="planned-note">${p.status === "in-progress" ? "Lessons being written…" : "Coming soon — see Curriculum Map for the lesson list."}</div>`;
    }
    p.modules.forEach(m => {
      const lessons = m.lessons.filter(l => match(l.title, l.id));
      if (lessons.length === 0) return;
      html += `<div class="module-label">${m.title}</div>`;
      lessons.forEach(l => html += lessonRow(l));
    });
    html += `</div></div>`;
  });

  html += `<div class="nav-section-label">Reference</div>`;
  COURSE.reference.forEach(d => { if (match(d.title, d.id)) html += docRow(d); });

  nav.innerHTML = html;
}

function docRow(d) {
  const active = state.current === d.id ? "active" : "";
  return `<div class="doc-link ${active}" onclick="openItem('${d.id}')">📄 ${d.title}</div>`;
}
function lessonRow(l) {
  const active = state.current === l.id ? "active" : "";
  const done = state.progress[l.id] ? "done" : "";
  return `<div class="lesson ${active}" onclick="openItem('${l.id}')">
    <span class="check ${done}">${done ? "✓" : ""}</span>
    <span class="lid">${l.id}</span><span>${l.title}</span></div>`;
}

window.togglePart = (id) => {
  state.collapsed[id] = !state.collapsed[id];
  save(LS_COLLAPSE, state.collapsed);
  renderSidebar(document.getElementById("search-input").value);
};

/* ---------- Progress ---------- */
function renderProgress() {
  const total = lessonItems().length;
  const done = lessonItems().filter(l => state.progress[l.id]).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  document.getElementById("progress-bar").style.width = pct + "%";
  document.getElementById("progress-text").textContent =
    `${done} / ${total} lessons complete (${pct}%)`;
}

window.toggleDone = () => {
  const id = state.current;
  if (!id || !lessonItems().some(l => l.id === id)) return;
  state.progress[id] = !state.progress[id];
  save(LS_PROGRESS, state.progress);
  renderProgress(); renderSidebar(document.getElementById("search-input").value);
  updateDoneBtn();
};
function updateDoneBtn() {
  const btn = document.getElementById("btn-done");
  const isLesson = lessonItems().some(l => l.id === state.current);
  btn.style.display = isLesson ? "inline-block" : "none";
  if (state.progress[state.current]) { btn.textContent = "✓ Completed"; btn.className = "btn done"; }
  else { btn.textContent = "Mark complete"; btn.className = "btn"; }
}

/* ---------- Markdown rendering ---------- */
let mermaidId = 0;
async function openItem(id) {
  const item = state.flat.find(i => i.id === id);
  if (!item) return;
  state.current = id;
  history.replaceState(null, "", "#" + id);

  const content = document.getElementById("content");
  content.innerHTML = `<p style="color:var(--text-dim)">Loading…</p>`;
  let md;
  try {
    const res = await fetch("../" + item.path, { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status);
    md = await res.text();
  } catch (e) {
    content.innerHTML = fetchError(item, e);
    return;
  }

  // Render markdown, then convert ```mermaid blocks into <div class="mermaid">
  marked.setOptions({
    highlight: (code, lang) => {
      if (lang === "mermaid") return code;
      try { return hljs.highlightAuto(code).value; } catch { return code; }
    }
  });
  let htmlOut = marked.parse(md);
  // marked wraps code in <pre><code class="language-mermaid">; swap for mermaid divs
  const tmp = document.createElement("div");
  tmp.innerHTML = htmlOut;
  tmp.querySelectorAll("code.language-mermaid").forEach(codeEl => {
    const div = document.createElement("div");
    div.className = "mermaid";
    div.textContent = codeEl.textContent;
    const pre = codeEl.closest("pre");
    pre.replaceWith(div);
  });
  content.innerHTML = tmp.innerHTML;

  // Run mermaid on the new diagrams
  try {
    const nodes = content.querySelectorAll(".mermaid");
    if (nodes.length) await mermaid.run({ nodes });
  } catch (e) { /* diagram render best-effort */ }

  // Intercept in-content links to other lessons (best-effort by filename)
  content.querySelectorAll("a[href]").forEach(a => {
    const href = a.getAttribute("href");
    if (href.endsWith(".md")) {
      const fname = href.split("/").pop();
      const target = state.flat.find(i => i.path.endsWith(fname));
      if (target) { a.onclick = (ev) => { ev.preventDefault(); openItem(target.id); }; }
    }
  });

  document.getElementById("crumbs").textContent =
    (item.kind === "lesson" ? `Part ${item.part} · Lesson ${item.id}` : item.title);
  document.getElementById("main").scrollTop = 0;
  renderSidebar(document.getElementById("search-input").value);
  updateDoneBtn();
  renderPager();
  refreshFlashAvailability(md);
}
window.openItem = openItem;

function fetchError(item, e) {
  return `<div id="welcome"><h2>Couldn't load this file</h2>
    <p>The app loads Markdown via <code>fetch()</code>, which browsers block on <code>file://</code> for security.</p>
    <p><b>Run a tiny local server from the <code>platform/</code> folder</b> and reopen:</p>
    <pre><code>python -m http.server 8080</code></pre>
    <p>then visit <code>http://localhost:8080/app/</code></p>
    <p style="font-size:12px">(${item.path} — ${e.message})</p></div>`;
}

/* ---------- Pager ---------- */
function renderPager() {
  const idx = state.flat.findIndex(i => i.id === state.current);
  const prev = state.flat[idx - 1], next = state.flat[idx + 1];
  const p = document.getElementById("pager");
  p.innerHTML =
    (prev ? `<button class="btn" onclick="openItem('${prev.id}')">← ${prev.title}</button>` : `<span></span>`) +
    (next ? `<button class="btn primary" onclick="openItem('${next.id}')">${next.title} →</button>` : `<span></span>`);
}

/* ---------- Flashcards (parse "Revision Notes" Q/A) ---------- */
function parseFlashcards(md) {
  const cards = [];
  // find the Revision Notes section
  const m = md.split(/##\s*16\.?\s*Revision Notes/i)[1];
  const region = m ? m.split(/\n##\s/)[0] : md; // fallback: whole doc
  const re = /\*\*Q:\*\*\s*(.+?)\s*\*\*A:\*\*\s*(.+)/g;
  let x;
  while ((x = re.exec(region)) !== null) {
    cards.push({ q: x[1].trim().replace(/\s*$/,''), a: x[2].trim() });
  }
  return cards;
}
function refreshFlashAvailability(md) {
  state._lastMd = md;
  const btn = document.getElementById("btn-flash");
  const cards = parseFlashcards(md);
  btn.style.display = cards.length ? "inline-block" : "none";
  btn.textContent = `🃏 Flashcards (${cards.length})`;
}
window.openFlash = () => {
  const cards = parseFlashcards(state._lastMd || "");
  if (!cards.length) return;
  state.flash = { cards, idx: 0, showAns: false };
  document.getElementById("flash-overlay").classList.add("open");
  renderFlash();
};
function renderFlash() {
  const { cards, idx, showAns } = state.flash;
  const c = cards[idx];
  document.getElementById("flash-meta").innerHTML =
    `<span>Card ${idx + 1} / ${cards.length}</span><span onclick="closeFlash()" style="cursor:pointer">✕ close</span>`;
  document.getElementById("flash-body").innerHTML =
    `<div><div>${c.q}</div>${showAns ? `<div class="ans">${c.a}</div>` : `<div class="hint">click to reveal</div>`}</div>`;
}
window.flipFlash = () => { state.flash.showAns = !state.flash.showAns; renderFlash(); };
window.nextFlash = () => { const s = state.flash; s.idx = (s.idx + 1) % s.cards.length; s.showAns = false; renderFlash(); };
window.prevFlash = () => { const s = state.flash; s.idx = (s.idx - 1 + s.cards.length) % s.cards.length; s.showAns = false; renderFlash(); };
window.closeFlash = () => document.getElementById("flash-overlay").classList.remove("open");

/* ---------- Keyboard ---------- */
document.addEventListener("keydown", (e) => {
  const open = document.getElementById("flash-overlay").classList.contains("open");
  if (open) {
    if (e.key === "Escape") closeFlash();
    if (e.key === " ") { e.preventDefault(); flipFlash(); }
    if (e.key === "ArrowRight") nextFlash();
    if (e.key === "ArrowLeft") prevFlash();
    return;
  }
  if (e.target.tagName === "INPUT") return;
  const idx = state.flat.findIndex(i => i.id === state.current);
  if (e.key === "j" && state.flat[idx + 1]) openItem(state.flat[idx + 1].id);
  if (e.key === "k" && state.flat[idx - 1]) openItem(state.flat[idx - 1].id);
  if (e.key === "f") openFlash();
});

/* ---------- Init ---------- */
function init() {
  buildFlat();
  mermaid.initialize({ startOnLoad: false, theme: "default", securityLevel: "loose" });
  renderSidebar();
  renderProgress();

  document.getElementById("search-input").addEventListener("input", (e) => renderSidebar(e.target.value));
  document.getElementById("btn-done").addEventListener("click", toggleDone);
  document.getElementById("btn-flash").addEventListener("click", openFlash);
  document.getElementById("flash-body").addEventListener("click", flipFlash);

  const hash = location.hash.replace("#", "");
  if (hash && state.flat.some(i => i.id === hash)) openItem(hash);
  else openItem("start");
}
window.addEventListener("DOMContentLoaded", init);
