/* =========================================================================
   Acne Studios — Sales Quest
   A quiet, gamified sales journal. Log what you do; the week turns it into
   animal titles. Everything resets Monday morning. Titles are earned weekly,
   never owned. 100% front-end, persisted in localStorage.
   ========================================================================= */

'use strict';

/* -------------------------------------------------------------------------
   1. Tiers — five levels, identical across every category
   ------------------------------------------------------------------------- */
const TIERS = [
  { key: 'sleepy',   name: 'Sleepy',   bg: '#F4F2EE' },
  { key: 'baxbax',   name: 'Baxbax',   bg: '#F5E6A8' },
  { key: 'shibshib', name: 'Shibshib', bg: '#C7D9C0' },
  { key: 'warrior',  name: 'Warrior',  bg: '#BBD1E3' },
  { key: 'elite',    name: 'Elite',    bg: '#D3C6E0' },
];
const MAX = TIERS.length - 1; // 4 — Elite

/* -------------------------------------------------------------------------
   2. Categories — six, five thresholds each (Sleepy → Elite)
   ------------------------------------------------------------------------- */
const CATS = [
  {
    id: 'sales', name: 'Sales Amount', animal: 'Peacock', emoji: '🦚',
    unit: '', money: true,
    tag: 'Struts, fans the tail, closes.',
    thresholds: [0, 500, 4500, 6250, 10000],
  },
  {
    id: 'bag', name: 'Suggest a Bag', animal: 'Kangaroo', emoji: '🦘',
    unit: 'bags',
    tag: 'Comes with a pouch. Was born for this.',
    thresholds: [0, 1, 6, 15, 30],
  },
  {
    id: 'match', name: 'Suggest a Match', animal: 'Lovebird', emoji: '🐦',
    unit: 'pairings',
    tag: "Refuses to let a jacket leave alone.",
    thresholds: [0, 1, 6, 15, 30],
  },
  {
    id: 'help', name: 'Help a Colleague', animal: 'Meerkat', emoji: '🦫',
    unit: 'assists',
    tag: 'Permanently on lookout duty for the pack.',
    thresholds: [0, 1, 6, 15, 30],
  },
  {
    id: 'details', name: 'Provide Details', animal: 'Owl', emoji: '🦉',
    unit: 'details',
    tag: 'Knows the fabric weight, the fit, the wash instructions.',
    thresholds: [0, 1, 6, 15, 30],
  },
  {
    id: 'story', name: 'Tell the Acne Story', animal: 'Moose', emoji: '🫎',
    unit: 'stories',
    tag: 'The Nordic bard. Stockholm, 1996, one hundred pairs of raw denim.',
    thresholds: [0, 1, 6, 15, 30],
  },
];

const STORAGE_KEY = 'acne-sales-quest-v1';

/* -------------------------------------------------------------------------
   3. Single-weight line drawings — one per animal.
      Consistent stroke, no fills, no shading.
   ------------------------------------------------------------------------- */
const ART = {
  sales: /* Peacock */ `
    <path d="M30 50 L18 14"/><circle cx="17" cy="12" r="2.6"/>
    <path d="M30 50 L30 11"/><circle cx="30" cy="9" r="2.6"/>
    <path d="M30 50 L44 16"/><circle cx="45" cy="14" r="2.6"/>
    <path d="M30 50 L54 29"/><circle cx="56" cy="28" r="2.6"/>
    <path d="M30 50 C26 46 24 42 26 36 C27 31 30 28 33 27"/>
    <circle cx="35" cy="25" r="3"/>
    <path d="M37.5 24 L42 23"/>
    <path d="M34 20 L33 16 M36 20 L36 16"/>
    <path d="M29 50 L27 57 M31 50 L34 57"/>`,
  bag: /* Kangaroo */ `
    <path d="M42 15 C41 9 45 9 46 12 C46 15 44 17 43 17"/>
    <path d="M43 17 C37 18 36 24 37 28"/>
    <path d="M43 17 C46 19 45 23 42 24"/>
    <circle cx="40" cy="20" r="1.3" fill="currentColor" stroke="none"/>
    <path d="M37 28 C32 31 31 40 30 48"/>
    <path d="M42 24 C41 32 40 40 43 47"/>
    <path d="M30 48 L44 52 L38 44"/>
    <path d="M35 40 C25 44 20 49 16 55"/>
    <path d="M39 30 C43 31 43 35 41 38"/>`,
  match: /* Lovebird */ `
    <path d="M14 55 L48 55"/>
    <path d="M40 24 C33 21 26 26 26 36 C26 46 32 51 39 50 C47 49 48 41 45 33"/>
    <path d="M40 24 C43 21 47 23 47 27 C47 30 44 32 41 31"/>
    <path d="M47 27 L53 25 L47 30"/>
    <circle cx="43" cy="26" r="1.3" fill="currentColor" stroke="none"/>
    <path d="M33 33 C38 33 42 38 42 45"/>
    <path d="M26 39 L15 43"/>
    <path d="M35 50 L35 55 M40 50 L40 55"/>`,
  help: /* Meerkat */ `
    <circle cx="32" cy="16" r="7"/>
    <circle cx="26" cy="11" r="2.3"/><circle cx="38" cy="11" r="2.3"/>
    <circle cx="29" cy="16" r="1.3" fill="currentColor" stroke="none"/>
    <circle cx="35" cy="16" r="1.3" fill="currentColor" stroke="none"/>
    <path d="M31 19 L32 21 L33 19"/>
    <path d="M27 22 C22 29 22 43 26 52 L38 52 C42 43 42 29 37 22"/>
    <path d="M29 31 C31 34 33 34 35 31"/>
    <path d="M38 50 C46 46 48 37 45 31"/>`,
  details: /* Owl */ `
    <path d="M22 14 L26 21"/><path d="M42 14 L38 21"/>
    <path d="M18 28 C18 16 32 12 32 12 C32 12 46 16 46 28 C46 44 40 52 32 54 C24 52 18 44 18 28 Z"/>
    <circle cx="26" cy="28" r="5.6"/><circle cx="38" cy="28" r="5.6"/>
    <circle cx="26" cy="28" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="38" cy="28" r="1.5" fill="currentColor" stroke="none"/>
    <path d="M30 34 L32 38 L34 34"/>
    <path d="M25 46 L22 51"/><path d="M39 46 L42 51"/>`,
  story: /* Moose */ `
    <path d="M24 20 C18 14 14 16 12 10 M24 18 C16 18 12 15 8 17 M24 22 C18 22 14 24 11 23"/>
    <path d="M40 20 C46 14 50 16 52 10 M40 18 C48 18 52 15 56 17 M40 22 C46 22 50 24 53 23"/>
    <path d="M24 20 C24 14 28 12 32 12 C36 12 40 14 40 20 L40 30 C40 42 36 48 32 52 C28 48 24 42 24 30 Z"/>
    <path d="M24 23 C20 21 17 23 16 27"/><path d="M40 23 C44 21 47 23 48 27"/>
    <circle cx="29" cy="27" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="35" cy="27" r="1.5" fill="currentColor" stroke="none"/>
    <path d="M29 44 C31 46 33 46 35 44"/>`,
};

/* -------------------------------------------------------------------------
   4. Small helpers
   ------------------------------------------------------------------------- */
function catById(id) { return CATS.find((c) => c.id === id); }

function title(cat, tierIndex) { return `${TIERS[tierIndex].name} ${cat.animal}`; }

function levelIndexFor(value, thresholds) {
  let idx = 0;
  for (let i = 0; i < thresholds.length; i++) if (value >= thresholds[i]) idx = i;
  return idx;
}

/** value → radar scale 0 (Sleepy centre) … 4 (Elite ring), interpolated. */
function toRadarScale(value, thresholds) {
  if (value <= thresholds[0]) return 0;
  for (let i = 1; i < thresholds.length; i++) {
    if (value <= thresholds[i]) {
      const span = thresholds[i] - thresholds[i - 1] || 1;
      return (i - 1) + (value - thresholds[i - 1]) / span;
    }
  }
  return MAX;
}

function fmtCount(cat, v) {
  const n = Math.round(v);
  if (cat.money) return '€' + n.toLocaleString('en-US');
  return String(n);
}
/** value with unit word, e.g. "43 bags" or "€2,340". */
function fmtFull(cat, v) {
  return cat.money ? fmtCount(cat, v) : `${fmtCount(cat, v)} ${cat.unit}`;
}

/* ---- ISO week + Monday-based bounds ---- */
function isoWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return { year: d.getUTCFullYear(), week: weekNo, key: `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}` };
}

function weekBounds(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(d);
  monday.setDate(d.getDate() - day); monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6); sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}

/** Next Monday 00:00 local (the reset boundary). */
function nextReset(now) {
  const d = new Date(now);
  const day = (d.getDay() + 6) % 7;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + (7 - day), 0, 0, 0, 0);
}

function fmtDay(d) { return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }

/** Turn a week key "YYYY-Www" into a Monday date (approx, for labels). */
function weekKeyToMonday(key) {
  const m = /^(\d{4})-W(\d{2})$/.exec(key);
  if (!m) return null;
  const year = +m[1], week = +m[2];
  const jan4 = new Date(year, 0, 4);
  const day = (jan4.getDay() + 6) % 7;
  const week1Mon = new Date(jan4); week1Mon.setDate(jan4.getDate() - day);
  const mon = new Date(week1Mon); mon.setDate(week1Mon.getDate() + (week - 1) * 7);
  return mon;
}
function weekLabel(key) {
  const m = /^(\d{4})-W(\d{2})$/.exec(key);
  return m ? `Week ${parseInt(m[2], 10)}` : key;
}
function weekRangeLabel(key) {
  const mon = weekKeyToMonday(key);
  if (!mon) return '';
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
  return `${fmtDay(mon)} – ${fmtDay(sun)}`;
}

/* -------------------------------------------------------------------------
   5. State
   ------------------------------------------------------------------------- */
function emptyValues() { const v = {}; CATS.forEach((c) => { v[c.id] = 0; }); return v; }

function loadState() {
  let s;
  try { s = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { s = null; }
  if (!s || typeof s !== 'object') {
    s = { currentWeek: null, current: emptyValues(), cleared: false, history: [], allTime: {} };
  }
  s.current = Object.assign(emptyValues(), s.current || {});
  s.history = Array.isArray(s.history) ? s.history : [];
  s.allTime = s.allTime || {};
  s.cleared = !!s.cleared;
  return s;
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE)); }

function totalOf(values) { return CATS.reduce((t, c) => t + (values[c.id] || 0), 0); }

/** Commit an absolute value for the current week. All-time highs are NOT
    touched here — they only come from weeks that have closed (see archive). */
function commit(cat, newVal) {
  newVal = Math.max(0, Math.round(newVal));
  STATE.current[cat.id] = newVal;
}

/** Raise all-time highs from a week that has just closed. The current
    (in-progress) week never contributes — only closed weeks in history do. */
function updateAllTimeFromWeek(entry) {
  CATS.forEach((cat) => {
    const v = (entry.values && entry.values[cat.id]) || 0;
    const at = STATE.allTime[cat.id] || { value: 0, week: null };
    if (v > at.value) STATE.allTime[cat.id] = { value: v, week: entry.week };
  });
}

/** Recompute all-time highs purely from the closed weeks in history. */
function computeAllTimeFromHistory() {
  const at = {};
  CATS.forEach((cat) => {
    let best = { value: 0, week: null };
    STATE.history.forEach((h) => {
      const v = (h.values && h.values[cat.id]) || 0;
      if (v > best.value) best = { value: v, week: h.week };
    });
    if (best.value > 0) at[cat.id] = best;
  });
  return at;
}

/** Archive the closing week (kept if it had volume, or was explicitly cleared). */
function archive() {
  if (!STATE.currentWeek) return;
  if (totalOf(STATE.current) === 0 && !STATE.cleared) return;
  const entry = { week: STATE.currentWeek, values: Object.assign({}, STATE.current), cleared: !!STATE.cleared };
  const existing = STATE.history.find((h) => h.week === STATE.currentWeek);
  if (existing) Object.assign(existing, entry);
  else STATE.history.unshift(entry);
  updateAllTimeFromWeek(entry); // all-time highs come only from closed weeks
}

/** Roll to the current week, resetting counters at the boundary. */
function ensureWeek() {
  const wk = isoWeek(new Date()).key;
  if (STATE.currentWeek !== wk) {
    if (STATE.currentWeek) archive();
    STATE.current = emptyValues();
    STATE.currentWeek = wk;
    STATE.cleared = false;
    save();
    return true;
  }
  return false;
}

/* ---- Undo snapshots ---- */
function snapshot() {
  return JSON.stringify({ current: STATE.current, allTime: STATE.allTime, cleared: STATE.cleared });
}
function restore(snap) {
  const s = JSON.parse(snap);
  STATE.current = s.current; STATE.allTime = s.allTime; STATE.cleared = s.cleared;
  save(); renderAll();
  showToast('Reverted', null, 1800);
}

/** Apply a change to one category, render, and offer a short-lived undo. */
function actWithUndo(cat, applyFn) {
  const snap = snapshot();
  const before = levelIndexFor(STATE.current[cat.id] || 0, cat.thresholds);
  applyFn();
  const after = levelIndexFor(STATE.current[cat.id] || 0, cat.thresholds);
  save(); renderAll();
  let text;
  if (after > before) text = `Unlocked · ${title(cat, after)}`;
  else if (after < before) text = `Now ${title(cat, after)}`;
  else text = `${cat.name} · ${fmtFull(cat, STATE.current[cat.id] || 0)}`;
  showToast(text, () => restore(snap), 4500);
}

/* -------------------------------------------------------------------------
   6. Badge element
   ------------------------------------------------------------------------- */
function badgeEl(cat, tierIndex, { locked = false } = {}) {
  const el = document.createElement('div');
  el.className = 'badge' + (locked ? ' locked' : '');
  if (!locked) el.style.background = TIERS[tierIndex].bg;
  el.innerHTML =
    `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" ` +
    `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ART[cat.id]}</svg>`;
  if (locked) {
    const lock = document.createElement('div');
    lock.className = 'lock'; lock.textContent = '🔒';
    el.appendChild(lock);
  }
  return el;
}

/* -------------------------------------------------------------------------
   7. Radar (six axes, four rings)
   ------------------------------------------------------------------------- */
function radarSVG(values, { size = 340, labels = true } = {}) {
  const NS = 'http://www.w3.org/2000/svg';
  const cx = size / 2, cy = size / 2, R = size / 2 - (labels ? 46 : 22), n = CATS.length;
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Weekly volume across the six categories');

  const angle = (i) => (-Math.PI / 2) + (i * 2 * Math.PI / n);
  const pt = (i, r) => [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];

  // rings (Baxbax → Elite)
  for (let ring = 1; ring <= MAX; ring++) {
    const rr = R * (ring / MAX);
    const poly = document.createElementNS(NS, 'polygon');
    const pts = [];
    for (let i = 0; i < n; i++) pts.push(pt(i, rr).join(','));
    poly.setAttribute('points', pts.join(' '));
    poly.setAttribute('fill', 'none');
    poly.setAttribute('stroke', TIERS[ring].bg);
    poly.setAttribute('stroke-width', '1.4');
    svg.appendChild(poly);
  }
  // axes
  for (let i = 0; i < n; i++) {
    const p = pt(i, R);
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', cx); line.setAttribute('y1', cy);
    line.setAttribute('x2', p[0]); line.setAttribute('y2', p[1]);
    line.setAttribute('stroke', '#E3DFD6'); line.setAttribute('stroke-width', '1');
    svg.appendChild(line);
  }
  // filled volume shape (pale blue accent)
  const valPts = [];
  CATS.forEach((cat, i) => {
    const scale = toRadarScale(values[cat.id] || 0, cat.thresholds);
    valPts.push(pt(i, R * (scale / MAX)).join(','));
  });
  const area = document.createElementNS(NS, 'polygon');
  area.setAttribute('points', valPts.join(' '));
  area.setAttribute('fill', 'rgba(155,190,220,0.42)');
  area.setAttribute('stroke', '#8FB2CE');
  area.setAttribute('stroke-width', '2');
  area.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(area);

  CATS.forEach((cat, i) => {
    const scale = toRadarScale(values[cat.id] || 0, cat.thresholds);
    const p = pt(i, R * (scale / MAX));
    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('cx', p[0]); dot.setAttribute('cy', p[1]); dot.setAttribute('r', '2.6');
    dot.setAttribute('fill', '#5E7E97'); dot.setAttribute('stroke', 'none');
    svg.appendChild(dot);

    if (labels) {
      const lp = pt(i, R + 24);
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', lp[0]); t.setAttribute('y', lp[1]);
      t.setAttribute('text-anchor', Math.abs(lp[0] - cx) < 8 ? 'middle' : (lp[0] < cx ? 'end' : 'start'));
      t.setAttribute('dominant-baseline', 'middle');
      t.setAttribute('font-size', '17');
      t.textContent = cat.emoji;
      svg.appendChild(t);
    }
  });
  return svg;
}

/* -------------------------------------------------------------------------
   8. Renders
   ------------------------------------------------------------------------- */
function renderWeekMeta() {
  const now = new Date();
  const iso = isoWeek(now);
  const { monday, sunday } = weekBounds(now);
  document.getElementById('weekNumber').textContent = 'W' + iso.week;
  document.getElementById('weekRange').textContent = `${fmtDay(monday)} – ${fmtDay(sunday)}`;
  renderCountdown();
}

function renderCountdown() {
  const now = new Date();
  const reset = nextReset(now);
  let ms = reset - now;
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000);
  const days = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (x) => String(x).padStart(2, '0');
  const clock = `${pad(h)}:${pad(m)}:${pad(sec)}`;
  document.getElementById('countdown').textContent = days > 0 ? `${days}d ${clock}` : clock;
}

function renderRadar() {
  const host = document.getElementById('radar');
  host.innerHTML = '';
  host.appendChild(radarSVG(STATE.current, { size: 340, labels: true }));
}

function renderLog() {
  const host = document.getElementById('logList');
  host.innerHTML = '';
  CATS.forEach((cat) => {
    const v = STATE.current[cat.id] || 0;
    const lvl = levelIndexFor(v, cat.thresholds);

    const row = document.createElement('div');
    row.className = 'log-row' + (cat.money ? ' sales' : '');

    const badge = badgeEl(cat, lvl); badge.classList.add('log-badge');

    const mid = document.createElement('div');
    mid.className = 'log-mid';
    mid.innerHTML =
      `<div class="log-cat">${cat.name}</div>` +
      `<div class="log-title">${title(cat, lvl)}</div>` +
      `<div class="log-tag">${cat.tag}</div>`;

    const right = document.createElement('div');
    right.className = 'log-right';

    // counter + pencil
    const cw = document.createElement('div');
    cw.className = 'counter-wrap';
    const counter = document.createElement('span');
    counter.className = 'counter';
    counter.textContent = fmtCount(cat, v);
    cw.appendChild(counter);
    if (!cat.money) {
      const u = document.createElement('span');
      u.className = 'counter-unit'; u.textContent = cat.unit;
      cw.appendChild(u);
    }
    attachLongPress(cw, () => openEdit(cat));
    right.appendChild(cw);

    const pencil = document.createElement('button');
    pencil.type = 'button'; pencil.className = 'pencil';
    pencil.setAttribute('aria-label', `Edit ${cat.name} total`);
    pencil.textContent = '✎';
    pencil.addEventListener('click', () => openEdit(cat));
    right.appendChild(pencil);

    if (cat.money) {
      // Peacock: add-an-amount field, summed into the running total
      const wrap = document.createElement('div');
      wrap.className = 'amount-add';
      const input = document.createElement('input');
      input.type = 'number'; input.inputMode = 'numeric'; input.min = '0'; input.step = '1';
      input.placeholder = '0'; input.setAttribute('aria-label', 'Add sales amount');
      const addWord = document.createElement('button');
      addWord.type = 'button'; addWord.className = 'add-word'; addWord.textContent = 'Add €';
      const doAdd = () => {
        const amt = parseFloat(input.value);
        if (isNaN(amt) || amt === 0) { input.value = ''; return; }
        actWithUndo(cat, () => commit(cat, (STATE.current[cat.id] || 0) + amt));
        input.value = '';
      };
      addWord.addEventListener('click', doAdd);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doAdd(); });
      wrap.appendChild(input); wrap.appendChild(addWord);
      right.appendChild(wrap);
    } else {
      const add = document.createElement('button');
      add.type = 'button'; add.className = 'add-btn';
      add.setAttribute('aria-label', `Add one ${cat.unit}`);
      add.textContent = '+';
      add.addEventListener('click', () => actWithUndo(cat, () => commit(cat, (STATE.current[cat.id] || 0) + 1)));
      right.appendChild(add);
    }

    row.appendChild(badge);
    row.appendChild(mid);
    row.appendChild(right);
    host.appendChild(row);
  });
}

function renderGauges() {
  const host = document.getElementById('gauges');
  host.innerHTML = '';
  CATS.forEach((cat) => {
    const v = STATE.current[cat.id] || 0;
    const idx = levelIndexFor(v, cat.thresholds);

    let pct, fill, fromT, toT, copy;
    if (idx >= MAX) {
      pct = 100; fill = TIERS[MAX].bg;
      fromT = title(cat, MAX); toT = '—';
      copy = `Elite ${cat.animal}. Nothing above — and it won't last.`;
    } else {
      const cur = cat.thresholds[idx], next = cat.thresholds[idx + 1];
      pct = Math.max(3, Math.min(100, ((v - cur) / (next - cur || 1)) * 100));
      fill = TIERS[idx + 1].bg;
      fromT = title(cat, idx); toT = title(cat, idx + 1);
      const remain = next - v;
      copy = cat.money
        ? `€${Math.round(remain).toLocaleString('en-US')} more and you leave <strong>${fromT}</strong> behind.`
        : `${Math.round(remain)} more ${cat.unit} and you leave <strong>${fromT}</strong> behind.`;
    }

    const g = document.createElement('div');
    g.className = 'gauge';
    g.innerHTML =
      `<div class="gauge-top"><span class="gauge-cat">${cat.name}</span>` +
      `<span class="gauge-val">${fmtFull(cat, v)}</span></div>` +
      `<div class="gauge-track"><div class="gauge-fill" style="width:${pct}%;background:${fill}"></div></div>` +
      `<div class="gauge-ends"><span class="from">${fromT}</span><span class="to">${toT}</span></div>` +
      `<div class="gauge-copy">${copy}</div>`;
    host.appendChild(g);
  });
}

function renderTitles() {
  const host = document.getElementById('titles');
  host.innerHTML = '';
  CATS.forEach((cat) => {
    const v = STATE.current[cat.id] || 0;
    const cur = levelIndexFor(v, cat.thresholds);

    const row = document.createElement('div');
    row.className = 'tr';
    row.innerHTML =
      `<div class="tr-head"><span class="tr-cat">${cat.name}</span>` +
      `<span class="tr-count">${cur + 1}/${TIERS.length} unlocked</span></div>`;

    const scroll = document.createElement('div');
    scroll.className = 'tr-scroll';

    TIERS.forEach((tier, i) => {
      const locked = i > cur;
      const tile = document.createElement('div');
      tile.className = 'tile' + (i === cur ? ' current' : '');
      tile.appendChild(badgeEl(cat, i, { locked }));

      const name = document.createElement('div');
      name.className = 'tile-name'; name.textContent = title(cat, i);
      tile.appendChild(name);

      const req = document.createElement('div');
      req.className = 'tile-req';
      req.textContent = i === 0 ? 'start' : (locked ? `≥ ${fmtFull(cat, cat.thresholds[i])}` : 'unlocked');
      tile.appendChild(req);

      if (locked) {
        tile.addEventListener('click', () => {
          const remain = cat.thresholds[i] - v;
          req.textContent = cat.money
            ? `€${Math.round(remain).toLocaleString('en-US')} to go`
            : `${Math.round(remain)} more ${cat.unit}`;
        });
      }
      scroll.appendChild(tile);
    });

    row.appendChild(scroll);
    host.appendChild(row);
  });
}

function isRecordWeek(cat, weekKey, value) {
  const rec = STATE.allTime[cat.id];
  return !!(rec && value > 0 && rec.value === value && rec.week === weekKey);
}

function renderHistory() {
  const host = document.getElementById('historyWeeks');
  host.innerHTML = '';
  const weeks = STATE.history.slice().sort((a, b) => (a.week < b.week ? 1 : -1));
  if (!weeks.length) {
    host.innerHTML = `<p class="empty">No closed weeks yet.<br>Your first week lands here after Monday's reset.</p>`;
    return;
  }
  weeks.forEach((h, idx) => {
    const det = document.createElement('details');
    det.className = 'hw';
    if (idx === 0) det.open = true;

    const sum = document.createElement('summary');
    sum.className = 'hw-sum';
    const when = document.createElement('div');
    when.className = 'hw-when';
    when.innerHTML = `<span class="hw-week">${weekLabel(h.week)}</span>` +
      `<span class="hw-range">${weekRangeLabel(h.week)}${h.cleared && totalOf(h.values) === 0 ? ' · cleared' : ''}</span>`;
    const badges = document.createElement('div');
    badges.className = 'hw-badges';
    CATS.forEach((cat) => {
      const lvl = levelIndexFor(h.values[cat.id] || 0, cat.thresholds);
      badges.appendChild(badgeEl(cat, lvl));
    });
    const chev = document.createElement('span'); chev.className = 'hw-chev'; chev.textContent = '›';
    sum.appendChild(when); sum.appendChild(badges); sum.appendChild(chev);
    det.appendChild(sum);

    const open = document.createElement('div');
    open.className = 'hw-open';
    const radar = document.createElement('div');
    radar.className = 'hw-radar';
    radar.appendChild(radarSVG(h.values, { size: 260, labels: true }));
    open.appendChild(radar);

    const lines = document.createElement('div');
    lines.className = 'hw-lines';
    CATS.forEach((cat) => {
      const val = h.values[cat.id] || 0;
      const lvl = levelIndexFor(val, cat.thresholds);
      const pr = isRecordWeek(cat, h.week, val);
      const line = document.createElement('div');
      line.className = 'hw-line';
      const b = badgeEl(cat, lvl);
      line.appendChild(b);
      const c = document.createElement('span'); c.className = 'hl-cat'; c.textContent = cat.name;
      const vv = document.createElement('span'); vv.className = 'hl-val'; vv.textContent = fmtCount(cat, val);
      const tt = document.createElement('span'); tt.className = 'hl-title';
      tt.innerHTML = `${title(cat, lvl)}${pr ? '<span class="crown">👑</span>' : ''}`;
      line.appendChild(c); line.appendChild(vv); line.appendChild(tt);
      lines.appendChild(line);
    });
    open.appendChild(lines);
    det.appendChild(open);
    host.appendChild(det);
  });
}

function renderAllTime() {
  const host = document.getElementById('historyAlltime');
  host.innerHTML = '';
  let any = false;
  CATS.forEach((cat) => {
    const rec = STATE.allTime[cat.id];
    const val = rec ? rec.value : 0;
    if (val > 0) any = true;
    const lvl = levelIndexFor(val, cat.thresholds);
    const row = document.createElement('div');
    row.className = 'at-row';
    row.appendChild(badgeEl(cat, lvl));
    const mid = document.createElement('div');
    mid.innerHTML =
      `<div class="at-cat">${cat.name}</div>` +
      `<div class="at-title">${title(cat, lvl)}</div>` +
      `<div class="at-when">${val > 0 && rec.week ? weekLabel(rec.week) + ' · ' + weekRangeLabel(rec.week) : 'No record yet'}</div>`;
    const valEl = document.createElement('div');
    valEl.className = 'at-val';
    valEl.innerHTML = `${fmtCount(cat, val)}${val > 0 ? '<span class="crown"> 👑</span>' : ''}`;
    row.appendChild(mid); row.appendChild(valEl);
    host.appendChild(row);
  });
  if (!any) {
    host.innerHTML = `<p class="empty">No all-time highs yet.<br>They're set when a week closes on Monday — the current week doesn't count.</p>`;
    return;
  }
  const wrap = document.createElement('div');
  wrap.className = 'clear-week';
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'text-btn'; btn.textContent = 'Clear all-time highs';
  btn.addEventListener('click', clearAllTime);
  wrap.appendChild(btn);
  host.appendChild(wrap);
}

function clearAllTime() {
  const hasAny = CATS.some((c) => (STATE.allTime[c.id] && STATE.allTime[c.id].value > 0));
  if (!hasAny) { showToast('No all-time highs to clear', null, 1600); return; }
  if (!confirm('Clear all all-time highs? Your week history stays.')) return;
  const snap = snapshot();
  STATE.allTime = {};
  save(); renderAll();
  showToast('All-time highs cleared', () => restore(snap), 10000);
}

function renderAll() {
  renderWeekMeta();
  renderRadar();
  renderLog();
  renderGauges();
  renderTitles();
  renderHistory();
  renderAllTime();
}

/* -------------------------------------------------------------------------
   9. Edit-total sheet
   ------------------------------------------------------------------------- */
let editingCat = null;
const sheet = document.getElementById('editSheet');

function openEdit(cat) {
  editingCat = cat;
  document.getElementById('editTitle').textContent = `${cat.name} — total`;
  document.getElementById('editSub').textContent = 'Replaces the week total outright.';
  document.getElementById('editPrefix').textContent = cat.money ? '€' : '';
  document.getElementById('editSuffix').textContent = cat.money ? '' : cat.unit;
  const input = document.getElementById('editInput');
  input.value = String(Math.round(STATE.current[cat.id] || 0));
  sheet.hidden = false;
  setTimeout(() => { input.focus(); input.select(); }, 30);
}
function closeEdit() { sheet.hidden = true; editingCat = null; }

document.getElementById('editCancel').addEventListener('click', closeEdit);
document.getElementById('editSave').addEventListener('click', () => {
  if (!editingCat) return;
  const cat = editingCat;
  const val = parseFloat(document.getElementById('editInput').value);
  if (isNaN(val)) { closeEdit(); return; }
  closeEdit();
  actWithUndo(cat, () => commit(cat, val));
});
sheet.addEventListener('click', (e) => { if (e.target === sheet) closeEdit(); });
document.getElementById('editInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('editSave').click();
  if (e.key === 'Escape') closeEdit();
});

/* long-press → open editor (mouse or touch) */
function attachLongPress(el, fn) {
  let timer = null;
  const start = () => { timer = setTimeout(() => { timer = null; fn(); }, 500); };
  const cancel = () => { if (timer) { clearTimeout(timer); timer = null; } };
  el.addEventListener('pointerdown', start);
  el.addEventListener('pointerup', cancel);
  el.addEventListener('pointerleave', cancel);
  el.addEventListener('pointercancel', cancel);
}

/* -------------------------------------------------------------------------
   10. Clear week
   ------------------------------------------------------------------------- */
document.getElementById('clearWeekBtn').addEventListener('click', () => {
  if (totalOf(STATE.current) === 0 && !STATE.cleared) { showToast('Already at zero', null, 1600); return; }
  if (!confirm('Reset the week to zero? Your history stays.')) return;
  const snap = snapshot();
  CATS.forEach((c) => { STATE.current[c.id] = 0; });
  STATE.cleared = true;
  save(); renderAll();
  showToast('Week cleared to zero', () => restore(snap), 10000);
});

/* -------------------------------------------------------------------------
   11. Toast / undo
   ------------------------------------------------------------------------- */
let toastTimer = null;
const toastEl = document.getElementById('toast');
const toastText = document.getElementById('toastText');
const toastUndo = document.getElementById('toastUndo');

function showToast(text, undoFn, ms) {
  toastText.textContent = text;
  toastEl.hidden = false;
  requestAnimationFrame(() => toastEl.classList.add('show'));
  if (undoFn) {
    toastUndo.hidden = false;
    toastUndo.onclick = () => { hideToast(); undoFn(); };
  } else {
    toastUndo.hidden = true; toastUndo.onclick = null;
  }
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, ms || 4000);
}
function hideToast() {
  toastEl.classList.remove('show');
  clearTimeout(toastTimer);
  setTimeout(() => { if (!toastEl.classList.contains('show')) toastEl.hidden = true; }, 300);
}

/* -------------------------------------------------------------------------
   12. Navigation + history sub-view
   ------------------------------------------------------------------------- */
function goto(screen) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('is-active', s.dataset.screen === screen));
  document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('is-active', t.dataset.go === screen));
  window.scrollTo(0, 0);
}
document.querySelectorAll('.tab').forEach((t) => t.addEventListener('click', () => goto(t.dataset.go)));

document.querySelectorAll('.seg-btn').forEach((b) => b.addEventListener('click', () => {
  document.querySelectorAll('.seg-btn').forEach((x) => x.classList.toggle('is-on', x === b));
  const weeks = b.dataset.view === 'weeks';
  document.getElementById('historyWeeks').hidden = !weeks;
  document.getElementById('historyAlltime').hidden = weeks;
}));

/* -------------------------------------------------------------------------
   13. Story Journal — a small, toggle-on/off wall of success stories
   ------------------------------------------------------------------------- */
const JOURNAL_KEY = 'acne-sales-quest-journal-v1';

function loadJournal() {
  try { const j = JSON.parse(localStorage.getItem(JOURNAL_KEY)); return Array.isArray(j) ? j : []; }
  catch (e) { return []; }
}
let JOURNAL = loadJournal();

function saveJournal() {
  try { localStorage.setItem(JOURNAL_KEY, JSON.stringify(JOURNAL)); return true; }
  catch (e) { showToast('Storage full — try fewer or smaller photos.', null, 3800); return false; }
}

function uid() { return 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function fmtPrice(v) { return '€' + Math.round(+v).toLocaleString('en-US'); }
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** Downscale + re-encode a picked image so it fits comfortably in localStorage. */
function resizeImage(file, maxDim = 1200, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      const m = Math.max(width, height);
      if (m > maxDim) { const s = maxDim / m; width = Math.round(width * s); height = Math.round(height * s); }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('bad image')); };
    img.src = url;
  });
}

/* ---- toggle ---- */
const journalToggle = document.getElementById('journalToggle');
const journalView = document.getElementById('journalView');

function openJournal() {
  document.body.classList.add('journal-mode');
  journalView.hidden = false;
  document.getElementById('jtIcon').textContent = '✕';
  document.getElementById('jtLabel').textContent = 'Close';
  journalToggle.setAttribute('aria-label', 'Close Story Journal');
  renderWall();
  window.scrollTo(0, 0);
}
function closeJournal() {
  document.body.classList.remove('journal-mode');
  journalView.hidden = true;
  document.getElementById('jtIcon').textContent = '📖';
  document.getElementById('jtLabel').textContent = 'Journal';
  journalToggle.setAttribute('aria-label', 'Open Story Journal');
  window.scrollTo(0, 0);
}
journalToggle.addEventListener('click', () => {
  if (document.body.classList.contains('journal-mode')) closeJournal(); else openJournal();
});

/* ---- wall ---- */
function renderWall() {
  const wall = document.getElementById('wall');
  wall.innerHTML = '';
  if (!JOURNAL.length) {
    wall.innerHTML = '<p class="wall-empty">No stories yet.<br>Pin your first win with “+ New story”.</p>';
    return;
  }
  JOURNAL.forEach((note) => {
    const card = document.createElement('article');
    card.className = 'note';
    let html = '';
    if (note.photos && note.photos.length) {
      html += `<div class="note-cover"><img src="${note.photos[0]}" alt="" loading="lazy"/>` +
        (note.photos.length > 1 ? `<span class="note-count">${note.photos.length} photos</span>` : '') + '</div>';
    } else {
      html += '<div class="note-nocover">✦</div>';
    }
    html += '<div class="note-body">';
    if (note.title) html += `<div class="note-title">${escapeHtml(note.title)}</div>`;
    if (note.price !== '' && note.price != null) html += `<div class="note-price">${fmtPrice(note.price)}</div>`;
    if (note.desc) html += `<div class="note-desc">${escapeHtml(note.desc)}</div>`;
    html += '</div>';
    card.innerHTML = html;
    card.addEventListener('click', () => openStory(note));
    wall.appendChild(card);
  });
}

/* ---- editor ---- */
let draft = null;
const storySheet = document.getElementById('storySheet');

function openStory(existing) {
  draft = existing ? JSON.parse(JSON.stringify(existing)) : { id: uid(), title: '', price: '', desc: '', photos: [] };
  document.getElementById('storyHeading').textContent = existing ? 'Story' : 'New story';
  document.getElementById('stTitle').value = draft.title || '';
  document.getElementById('stPrice').value = (draft.price === '' || draft.price == null) ? '' : draft.price;
  document.getElementById('stDesc').value = draft.desc || '';
  document.getElementById('stDelete').hidden = !existing;
  renderThumbs();
  storySheet.hidden = false;
  setTimeout(() => document.getElementById('stTitle').focus(), 30);
}
function closeStory() { storySheet.hidden = true; draft = null; }

function renderThumbs() {
  const host = document.getElementById('stThumbs');
  host.innerHTML = '';
  draft.photos.forEach((src, i) => {
    const t = document.createElement('div'); t.className = 'st-thumb';
    const img = document.createElement('img'); img.src = src; img.alt = '';
    img.addEventListener('click', () => openLightbox(src));
    const rm = document.createElement('button'); rm.type = 'button'; rm.className = 'rm'; rm.textContent = '✕';
    rm.setAttribute('aria-label', 'Remove photo');
    rm.addEventListener('click', (e) => { e.stopPropagation(); draft.photos.splice(i, 1); renderThumbs(); });
    t.appendChild(img); t.appendChild(rm); host.appendChild(t);
  });
}

document.getElementById('stPhoto').addEventListener('change', async (e) => {
  const files = Array.from(e.target.files || []);
  e.target.value = '';
  for (const f of files) {
    try { draft.photos.push(await resizeImage(f)); renderThumbs(); }
    catch (err) { showToast('Could not read that image.', null, 2600); }
  }
});

document.getElementById('stSave').addEventListener('click', () => {
  if (!draft) return;
  draft.title = document.getElementById('stTitle').value.trim();
  const p = document.getElementById('stPrice').value;
  draft.price = (p === '' ? '' : Math.max(0, Math.round(+p)));
  draft.desc = document.getElementById('stDesc').value.trim();
  if (!draft.title && !draft.photos.length && !draft.desc) { closeStory(); return; }
  const backup = JSON.stringify(JOURNAL);
  const idx = JOURNAL.findIndex((n) => n.id === draft.id);
  if (idx >= 0) JOURNAL[idx] = draft;
  else { draft.created = Date.now(); JOURNAL.unshift(draft); }
  if (saveJournal()) { closeStory(); renderWall(); }
  else { JOURNAL = JSON.parse(backup); } // quota failed: revert, keep sheet open
});

document.getElementById('stCancel').addEventListener('click', closeStory);

document.getElementById('stDelete').addEventListener('click', () => {
  if (!draft) return;
  if (!confirm("Delete this story? This can't be undone.")) return;
  JOURNAL = JOURNAL.filter((n) => n.id !== draft.id);
  saveJournal(); closeStory(); renderWall();
});

storySheet.addEventListener('click', (e) => { if (e.target === storySheet) closeStory(); });
document.getElementById('addStoryBtn').addEventListener('click', () => openStory(null));

/* ---- lightbox ---- */
const lightbox = document.getElementById('lightbox');
function openLightbox(src) { document.getElementById('lightboxImg').src = src; lightbox.hidden = false; }
lightbox.addEventListener('click', () => { lightbox.hidden = true; document.getElementById('lightboxImg').src = ''; });

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!lightbox.hidden) { lightbox.hidden = true; return; }
  if (!storySheet.hidden) { closeStory(); }
});

/* -------------------------------------------------------------------------
   14. Boot
   ------------------------------------------------------------------------- */
let STATE = loadState();

(function init() {
  // One-time migration: earlier builds tracked all-time highs live from the
  // current week. Rebuild them from closed weeks only, then let clears persist.
  if (!STATE.allTimeMigrated) {
    STATE.allTime = computeAllTimeFromHistory();
    STATE.allTimeMigrated = true;
  }
  const didReset = ensureWeek();
  save();
  renderAll();
  if (didReset) showToast('New week. Everyone back to Sleepy.', null, 3600);

  // live countdown; roll the week over at the boundary
  setInterval(() => {
    renderCountdown();
    if (ensureWeek()) { renderAll(); showToast('New week. Everyone back to Sleepy.', null, 3600); }
  }, 1000);
})();
