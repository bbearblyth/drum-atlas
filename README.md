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
- Circular step diagram with one ring per instrument and polygons joining the hits
- Sounds synthesised with the Web Audio API (no samples), with tempo and swing controls
- Click a step to cycle it through hit, accent, ghost and rest
- Automatic Euclidean detection: each layer is labelled `E(k,n)` when it is maximally even
- Euclidean layer generator (hits + rotation)
- Filter by family, search, and a shareable link per pattern
