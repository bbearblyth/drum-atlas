# Drum Atlas · BB DSP

Drum patterns from many genres and cultures, drawn as circular 16-step (Euclidean / rhythm-necklace) diagrams. You can play, edit and remix each one in the browser. It's a plain static site: no build step and no dependencies.

## Run locally
Open `index.html` in a browser, or serve the folder:
```
python3 -m http.server 8000
```

## Publish on GitHub Pages
1. Create a new repository on GitHub (e.g. `drum-atlas`).
2. Upload everything in this folder (including the `fonts` folder and `.nojekyll`) to the root of the repo.
   ```
   git init && git add . && git commit -m "Drum Pattern Atlas"
   git branch -M main
   git remote add origin https://github.com/<you>/drum-atlas.git
   git push -u origin main
   ```
3. In the repo, open **Settings → Pages**, set *Source* to **Deploy from a branch**, then pick `main` and `/ (root)`.
4. After a minute the site will be at `https://<you>.github.io/drum-atlas/`.

Each pattern has its own link, e.g. `…/drum-atlas/#bossa`.

## Adding patterns
All data is in `patterns.js`. Add an object to `window.PATTERNS`:

```js
{ id: 'my-groove', name: 'My Groove', family: 'Electronic', region: 'Glasgow', bpm: 128,
  swing: 0.2,                 // optional, 0–0.6 (16-step only)
  steps: 16, perBeat: 4,      // optional; use steps: 12, perBeat: 3 for triplet meters
  layers: { hat: 'x.x.x.x.x.x.x.x.', snare: '....x.......x...', kick: 'x..x..x...x.....' },
  note: 'Short context. Say "Simplified." if it is a reduction.' },
```

- `x` hit, `X` accent, `o` ghost, `.` rest.
- The first layer is drawn on the outer ring.
- `family` must be one of `window.FAMILIES`. Add a new family there if needed.
- Instruments: `kick snare rim clap hat ohat ride crash tamb shaker maracas guiro triangle cowbell clave bell congaH congaL tomH tomL dum tek bayan dayan palmas cajon log`.

Shortcut: build the pattern in the site (click steps, add Euclidean layers), press **Copy as data**, and paste the result into `patterns.js`.

## Features
- 113 patterns across 14 families, each drawn as a circular step diagram (one ring per instrument)
- CIRCLE and GRID tabs: the same pattern as a wheel or as a step-sequencer grid, both clickable
- SHAPES ONLY: hides the rings and dots so only the rhythm shapes are left
- Variation slider (0–6): seeded ghost notes, accent moves, doubles, kick pickups and fills. Clave and bell timelines stay fixed
- Drum sounds made in the browser with the Web Audio API, plus tempo and swing knobs
- Euclidean labels and a Euclidean layer generator
- Library grouped by family with search (spelling-tolerant: "halftime" finds "half-time"), sorting, a steps filter and a play button on each card
- PREV / NEXT / RANDOM and keyboard shortcuts (space, ← →)
- Styled after the BB DSP plugins (LookAndFeelTE, House drawing kit, BDRmono 2006)
