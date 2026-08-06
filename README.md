# 🦌 Acne Studios — Sales Quest

A **gamified sales journal for the shop floor**. You log what you do during the
week; the app turns it into animal titles. Everything resets **Monday morning** —
titles are earned weekly, never owned. A browsable history keeps every past week,
and all-time highscores are flagged per category.

Tone: deadpan, Scandinavian, lightly absurd. The app never shouts. It just quietly
informs you that you are, this week, a **Sleepy Moose**. 😴

It's a **100% static** web app — no server, no database, no build step. All data
lives in the browser (`localStorage`).

## 🪜 Tiers

Five levels, identical across all six categories.

| Tier | Badge background |
|------|------------------|
| 😴 Sleepy | Off-white `#F4F2EE` |
| 🌼 Baxbax | Butter yellow `#F5E6A8` |
| 🌿 Shibshib | Sage green `#C7D9C0` |
| 💧 Warrior | Powder blue `#BBD1E3` |
| 🔮 Elite | Soft lilac `#D3C6E0` |

## 🎯 Categories & thresholds

| Category | Animal | Baxbax | Shibshib | Warrior | Elite |
|----------|--------|-------:|---------:|--------:|------:|
| 💰 Sales Amount | 🦚 Peacock | €2,000 | €8,000 | €18,000 | €30,000 |
| 👜 Suggest a Bag | 🦘 Kangaroo | 10 | 30 | 60 | 100 |
| 🧥 Suggest a Match | 🐦 Lovebird | 15 | 40 | 80 | 130 |
| 🤝 Help a Colleague | 🦫 Meerkat | 5 | 15 | 30 | 55 |
| 🔍 Provide Details | 🦉 Owl | 20 | 55 | 110 | 180 |
| 📖 Tell the Acne Story | 🫎 Moose | 8 | 25 | 50 | 90 |

Sleepy is always 0 — the start of every week.

## 📱 Screens

- **🕸️ Week (home)** — a radar chart (six axes, four rings), the current week
  number and a live countdown to Monday reset, the logging list, and a quiet
  *Clear week* action at the bottom.
- **📊 Progress** — one thin bar per category showing distance to the *next*
  title only. *"12 more bags and you leave Shibshib Kangaroo behind."*
- **🎖️ Titles** — swipe horizontally through the five titles of the week per
  category. Unlocked badges are in colour; locked ones are grey with a 🔒.
  Tap a locked badge to see exactly what's still required.
- **📚 History** — every past week, most recent first, each row showing its six
  final titles. Open a week for its full radar and numbers. A dedicated
  **All-time 👑** view summarises personal bests per category.

## ✍️ Logging & corrections

Logging takes under three seconds mid-shift.

- **➕ Shortcut add** — a large `+` per category. One tap, one unit.
- **💶 Sales Amount** — an *Add €* field: type a figure, tap add, and it's summed
  into the running weekly total (which is always shown above).
- **✏️ Edit the total** — tap-and-hold the counter, or use the small pencil, to
  open a numeric input pre-filled with the current value. Saving replaces the
  total outright and recalculates instantly.
- **↩️ Undo** — a short-lived undo appears after every add.
- **🧹 Clear week** — zeroes all six counters for the current week only (history
  untouched). Asks once, quietly, with a ~10-second undo window. All-time highs
  set earlier in the week are preserved; cleared weeks are still recorded in
  history as zero weeks.

## 📓 Story Journal

A small, separate journal you toggle on and off with the **📖 Journal** button at
the top-right of the app (it becomes **✕ Close** to come back). It's a quiet
gallery wall of success stories — each note has a **title**, a **price**, a
**description**, and any number of **photos**. Add one with *+ New story*; tap a
card to edit or delete it; tap a photo to view it full-screen. Photos are
downscaled in the browser before being saved, and everything lives locally
(`localStorage`, key `acne-sales-quest-journal-v1`), separate from the weekly
quest data.

## ⚙️ Core rules

- 🗓️ Week runs **Monday 00:00 → Sunday 23:59**, local store time.
- 🔄 All counters reset to zero at the boundary; titles recalculated from zero.
- 🔒 History is immutable once a week closes.
- 👑 All-time highscores persist across resets, tracked per category.
- ⚡ A title unlocks the moment its threshold is crossed, not at week's end.
- ✏️ Edits and clears apply to the current week only and take effect immediately.

*Elite Moose is not a permanent condition. That's the point.* 🫎

## 🎨 Design

Pure and quiet. Off-white ground, near-black ink, and the five tier colours used
exclusively on badges and progress fills — nothing else is coloured. One grotesque
sans in two weights, wide letter-spacing on titles. Animals are single-weight line
drawings: no fills, no shading. Motion is minimal; a badge unlocking fades slowly
from grey to colour. Destructive actions are near-black text buttons, never red.

## 🚀 Deploy on Netlify

Static site, no build.

1. **Drag & drop** — go to <https://app.netlify.com/drop> and drop the folder
   containing `index.html`.
2. **From Git** — connect the repo, leave the build command empty and publish
   directory `.` (already set in `netlify.toml`).

## 🗂️ Structure

```
index.html              # screens + bottom nav
styles.css              # off-white theme, badges, radar, gauges
app.js                  # tiers, thresholds, week logic, localStorage
icon.svg                # app icon / favicon (line-drawn moose)
manifest.webmanifest    # PWA metadata
netlify.toml            # static hosting config
```

## 💾 Data

Everything is stored locally in the browser (`localStorage`, key
`acne-sales-quest-v1`). Nothing is sent to a server, so data is per-device.
