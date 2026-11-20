{
/* ───────────────────────── BB DSP palette ─────────────────────────
   From AccentColors.h / LookAndFeelTE.cpp / House.h in the plugin source. */
const P = { lilac: '#DFC6E3', orange: '#F26419', gold: '#F6AE28', cherry: '#A4243B', green: '#01AF55',
  teal: '#7EB09B', sky: '#7AADDB', lime: '#B2FFA9', red: '#DB2C39', dusk: '#5F5069', navy: '#29325D', alabaster: '#E1DEE3' };
const HOUSE = { frame: '#B3B3B3', ink: '#4D4D4D', card: '#FBFAF6' };

const FAM_COL = {
  'Rock & Pop': P.red, 'Metal & Punk': P.cherry, 'Funk, Soul & Disco': P.gold, 'Hip-Hop & Breaks': P.dusk,
  'Electronic': P.sky, 'Latin America': P.green, 'Caribbean': P.lime, 'West & Central Africa': P.teal,
  'Southern Africa': P.lilac, 'Middle East & North Africa': P.navy, 'South Asia': P.gold, 'Europe': P.sky,
  'Jazz & Blues': P.navy, 'Euclidean timelines': '#4D4D4D'
};
const MAJOR = P.sky; // the one UI accent (window, knobs, LCD text, play)

const INST = {
  kick: ['Kick', P.navy], snare: ['Snare', P.red], rim: ['Rim', P.orange], clap: ['Clap', P.cherry],
  hat: ['Closed hat', P.gold], ohat: ['Open hat', P.sky], ride: ['Ride', P.teal], crash: ['Crash', P.dusk],
  tamb: ['Tambourine', P.lime], shaker: ['Shaker', P.green], maracas: ['Maracas', P.green], guiro: ['Güiro', P.teal],
  triangle: ['Triangle', P.sky], cowbell: ['Cowbell', P.dusk], clave: ['Clave', P.orange], bell: ['Bell', P.gold],
  congaH: ['Conga high', P.lilac], congaL: ['Conga low', P.cherry], tomH: ['Tom high', P.lilac], tomL: ['Tom low / surdo', P.teal],
  dum: ['Dum', P.navy], tek: ['Tek', P.red], bayan: ['Bayan', P.navy], dayan: ['Dayan', P.orange],
  palmas: ['Palmas', P.cherry], cajon: ['Cajón', P.dusk], log: ['Log drum', P.dusk]
};
const lab = k => (INST[k] ? INST[k][0] : k);
const col = k => (INST[k] ? INST[k][1] : HOUSE.ink);
const VEL = { X: 1, x: .75, o: .3 };

/* colour helpers: JUCE's perceived brightness, and LookAndFeelTE::onLcd */
const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
const hex = a => '#' + a.map(v => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0')).join('');
const perceived = h => { const [r, g, b] = rgb(h); return Math.sqrt(.241 * r * r + .691 * g * g + .068 * b * b); };
function onLcd(h) {
  let [r, g, b] = rgb(h);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  if ((mx ? (mx - mn) / mx : 0) < .12 && perceived(h) < .55) return P.alabaster;
  for (let i = 0; i < 20 && perceived(hex([r, g, b])) < .55; i++) {
    const m = Math.max(r, g, b) || .01, f = Math.min(1, m + .05) / m;
    if (m < .99) { r *= f; g *= f; b *= f; } else { r += (1 - r) * .15; g += (1 - g) * .15; b += (1 - b) * .15; }
  }
  return hex([r, g, b]);
}
const isLight = h => perceived(h) > .78;

/* ───────────────────────── audio ───────────────────────── */
let ctx, out, NB;
function audio() {
  if (ctx) return ctx;
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -12; comp.ratio.value = 4;
  out = ctx.createGain(); out.gain.value = .8;
  out.connect(comp); comp.connect(ctx.destination);
  NB = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const d = NB.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return ctx;
}
const G = () => ctx.createGain();
const F = (type, f, q = 1) => { const b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; };
function env(g, t, peak, dec, a = .002) {
  g.gain.setValueAtTime(.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(peak, .0002), t + a);
  g.gain.exponentialRampToValueAtTime(.0001, t + a + dec);
}
function tone(t, { type = 'sine', f0, f1 = f0, dec, peak, a }) {
  const o = ctx.createOscillator(), g = G();
  o.type = type; o.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dec * .5);
  env(g, t, peak, dec, a); o.connect(g); g.connect(out);
  o.start(t); o.stop(t + dec + .05);
}
function hiss(t, { ft = 'bandpass', f, q = 1, dec, peak, a }) {
  const s = ctx.createBufferSource(), b = F(ft, f, q), g = G();
  s.buffer = NB; env(g, t, peak, dec, a);
  s.connect(b); b.connect(g); g.connect(out);
  s.start(t, Math.random() * .5); s.stop(t + dec + .05);
}
function metal(t, { hp, dec, peak, base = 1 }) {
  const b = F('highpass', hp), g = G();
  env(g, t, peak, dec); b.connect(g); g.connect(out);
  [2, 3, 4.16, 5.43, 6.79, 8.21].forEach(r => {
    const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = 40 * r * base;
    o.connect(b); o.start(t); o.stop(t + dec + .05);
  });
}
const SYN = {
  kick: (t, v) => { tone(t, { f0: 150, f1: 45, dec: .45, peak: v }); hiss(t, { ft: 'highpass', f: 3000, dec: .01, peak: .2 * v }); },
  snare: (t, v) => { tone(t, { type: 'triangle', f0: 190, f1: 160, dec: .12, peak: .6 * v }); hiss(t, { ft: 'highpass', f: 1500, dec: .18, peak: .7 * v }); },
  rim: (t, v) => { tone(t, { type: 'triangle', f0: 820, dec: .04, peak: .5 * v }); hiss(t, { f: 2500, q: 4, dec: .03, peak: .5 * v }); },
  clap: (t, v) => { [0, .01, .02].forEach(d => hiss(t + d, { f: 1100, q: 1.5, dec: .01, peak: .6 * v })); hiss(t + .03, { f: 1100, q: 1.5, dec: .18, peak: .6 * v }); },
  palmas: (t, v) => { [0, .008].forEach(d => hiss(t + d, { f: 1800, q: 1.5, dec: .01, peak: .6 * v })); hiss(t + .016, { f: 1800, q: 1.5, dec: .12, peak: .6 * v }); },
  hat: (t, v) => metal(t, { hp: 8000, dec: .05, peak: .35 * v }),
  ohat: (t, v) => metal(t, { hp: 7000, dec: .35, peak: .3 * v }),
  ride: (t, v) => { metal(t, { hp: 5000, base: 1.4, dec: .7, peak: .16 * v }); tone(t, { f0: 3200, dec: .5, peak: .05 * v }); },
  crash: (t, v) => { hiss(t, { ft: 'highpass', f: 4000, dec: 1.2, peak: .4 * v }); metal(t, { hp: 6000, dec: 1, peak: .12 * v }); },
  tamb: (t, v) => { metal(t, { hp: 9000, dec: .15, peak: .3 * v }); hiss(t, { f: 10000, dec: .1, peak: .2 * v }); },
  shaker: (t, v) => hiss(t, { f: 7000, dec: .05, peak: .35 * v, a: .008 }),
  maracas: (t, v) => hiss(t, { f: 5000, q: 1.5, dec: .04, peak: .4 * v, a: .006 }),
  guiro: (t, v) => { for (let i = 0; i < 6; i++) hiss(t + i * .012, { f: 3500, q: 3, dec: .01, peak: .3 * v }); },
  triangle: (t, v) => { tone(t, { f0: 4200, dec: .7, peak: .12 * v }); tone(t, { f0: 6300, dec: .5, peak: .06 * v }); },
  cowbell: (t, v) => {
    const b = F('bandpass', 1000, 2), g = G(); env(g, t, .35 * v, .25); b.connect(g); g.connect(out);
    [562, 845].forEach(f => { const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = f; o.connect(b); o.start(t); o.stop(t + .3); });
  },
  clave: (t, v) => tone(t, { f0: 2500, dec: .06, peak: .6 * v }),
  bell: (t, v) => { tone(t, { f0: 1050, dec: .35, peak: .4 * v }); tone(t, { f0: 2650, dec: .12, peak: .15 * v }); },
  congaH: (t, v) => tone(t, { f0: 340, f1: 310, dec: .22, peak: .7 * v }),
  congaL: (t, v) => tone(t, { f0: 220, f1: 200, dec: .3, peak: .7 * v }),
  tomH: (t, v) => tone(t, { f0: 220, f1: 150, dec: .3, peak: .8 * v }),
  tomL: (t, v) => tone(t, { f0: 140, f1: 90, dec: .4, peak: .9 * v }),
  dum: (t, v) => tone(t, { f0: 120, f1: 75, dec: .45, peak: .9 * v }),
  tek: (t, v) => { hiss(t, { f: 4000, q: 2, dec: .035, peak: .5 * v }); tone(t, { type: 'triangle', f0: 900, dec: .03, peak: .3 * v }); },
  bayan: (t, v) => tone(t, { f0: 85, f1: 105, dec: .55, peak: .9 * v }),
  dayan: (t, v) => { tone(t, { f0: 520, dec: .3, peak: .45 * v }); tone(t, { f0: 1040, dec: .15, peak: .15 * v }); hiss(t, { f: 3000, dec: .015, peak: .15 * v }); },
  cajon: (t, v) => { tone(t, { f0: 110, f1: 65, dec: .18, peak: .8 * v }); hiss(t, { ft: 'lowpass', f: 1200, dec: .06, peak: .2 * v }); },
  log: (t, v) => { tone(t, { f0: 75, f1: 55, dec: .55, peak: v, a: .004 }); tone(t, { type: 'triangle', f0: 150, f1: 110, dec: .1, peak: .3 * v }); }
};

/* ───────────────────────── data ───────────────────────── */
const euclidStr = (k, n) => Array.from({ length: n }, (_, i) => ((i * k) % n) < k ? 'x' : '.').join('');
const rotate = (s, r) => s.slice(r) + s.slice(0, r);
function normalise(p) {
  const steps = p.steps || 16;
  return {
    ...p, steps, perBeat: p.perBeat || (steps === 12 ? 3 : 4), swing: p.swing || 0,
    layers: Object.entries(p.layers).map(([inst, s]) => {
      if (!INST[inst]) console.warn(`Unknown instrument "${inst}" in ${p.id}`);
      if (s.length !== steps) console.warn(`${p.id}/${inst}: ${s.length} steps, expected ${steps}`);
      return { inst, s: s.padEnd(steps, '.').slice(0, steps) };
    })
  };
}
const ALL = window.PATTERNS.map(normalise);
const byId = Object.fromEntries(ALL.map(p => [p.id, p]));
const clone = p => ({ ...p, layers: p.layers.map(l => ({ ...l })) });

function euclidName(s) {
  const n = s.length, hits = [...s].map(c => c !== '.');
  const k = hits.filter(Boolean).length;
  if (k < 2 || k === n) return '';
  const e = euclidStr(k, n).split('').map(c => c === 'x');
  for (let r = 0; r < n; r++) if (hits.every((h, i) => h === e[(i + r) % n])) return `E(${k},${n})` + (r ? ` rot ${(n - r) % n}` : '');
  return `${k} hits`;
}

/* ───────────────────────── wheel, in the House style ─────────────────────────
   FRAME grey for structure (rings, beat dashes, rests), flat sharp shapes,
   each instrument's colour for its hits, and the major accent only for what
   is playing right now. `pure` draws the shapes alone. */
const NS = 'http://www.w3.org/2000/svg';
const diamondPath = (x, y, r) => `M${x} ${y - r}L${x + r} ${y}L${x} ${y + r}L${x - r} ${y}Z`;

function wheel(p, { big = false, muted = new Set(), pure = false } = {}) {
  const n = p.steps, L = p.layers.length, cx = 200, cy = 200;
  const R = big ? 150 : 162, rMin = L > 4 ? 46 : (big ? 58 : 52);
  const gap = L > 1 ? (R - rMin) / (L - 1) : 0;
  const grp = p.perBeat > 1 ? p.perBeat : (n === 12 ? 3 : 4);
  const ang = i => (-90 + i * 360 / n) * Math.PI / 180;
  const pt = (r, i) => [cx + r * Math.cos(ang(i)), cy + r * Math.sin(ang(i))];
  let svg = '';

  if (!pure) for (let i = 0; i < n; i++) {
    if (i % grp === 0) {
      const [x1, y1] = pt(R + 17, i), [x2, y2] = pt(R + 32, i);
      svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${HOUSE.frame}" stroke-width="${big ? 5 : 7}"/>`;
    } else {
      const [x, y] = pt(R + 24, i);
      svg += `<circle cx="${x}" cy="${y}" r="${big ? 2.6 : 3.4}" fill="${HOUSE.frame}"/>`;
    }
  }

  p.layers.forEach((l, li) => {
    const r = R - li * gap, c = col(l.inst), off = muted.has(li);
    const d = Math.min(big ? 10 : 12, (2 * Math.PI * r / n) * .3, L > 1 ? gap * .4 : 99);
    const edge = isLight(c) ? ` stroke="${HOUSE.ink}" stroke-width="1.2"` : '';
    const hs = [...l.s].map((ch, i) => ch !== '.' ? pt(r, i) : null).filter(Boolean);
    svg += `<g opacity="${off ? .18 : 1}">`;
    if (!pure) svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${HOUSE.frame}" stroke-opacity=".45" stroke-width="1.5"/>`;
    if (hs.length > 1) svg += `<polygon points="${hs.map(q => q.join(',')).join(' ')}" fill="${c}" fill-opacity="${pure ? (isLight(c) ? .8 : .5) : (isLight(c) ? .35 : .16)}" stroke="${c}" stroke-width="${big ? 2.5 : 3}" stroke-linejoin="miter"/>`;
    if (pure) {
      if (hs.length === 1) svg += `<path d="${diamondPath(hs[0][0], hs[0][1], 7)}" fill="${c}"/>`;
    } else [...l.s].forEach((ch, i) => {
      const [x, y] = pt(r, i);
      let shape;
      if (ch === '.') shape = `<circle class="rest" cx="${x}" cy="${y}" r="${big ? 2.4 : 3}" fill="${HOUSE.frame}"/>`;
      else if (ch === 'X') shape = `<path class="hit" data-s="${i}" d="${diamondPath(x, y, d * 1.35)}" fill="${c}"${edge}/>`;
      else if (ch === 'o') shape = `<circle class="hit" data-s="${i}" cx="${x}" cy="${y}" r="${d * .58}" fill="${HOUSE.card}" stroke="${c}" stroke-width="2.2"/>`;
      else shape = `<circle class="hit" data-s="${i}" cx="${x}" cy="${y}" r="${d * .9}" fill="${c}"${edge}/>`;
      svg += big ? `<g class="cell" data-l="${li}" data-s="${i}"><circle cx="${x}" cy="${y}" r="${Math.max(d, 13)}" fill="transparent"/>${shape}</g>` : shape;
    });
    svg += '</g>';
  });

  if (big && !pure) svg += `<path id="head" data-r="${R + 24}" d="${diamondPath(0, 0, 9)}" transform="translate(200 ${200 - R - 24})" fill="var(--acc)" stroke="${HOUSE.ink}" stroke-width="1"/>`;
  return `<svg xmlns="${NS}" viewBox="-10 -10 420 420" role="img" aria-label="${p.name}: ${n}-step circle diagram">${svg}</svg>`;
}

const euclidIcon = c => `<svg viewBox="0 0 20 20" aria-hidden="true">${[...Array(8)].map((_, i) => {
  const a = -Math.PI / 2 + i * Math.PI / 4, d = i % 3 === 0 ? 2.6 : 1.3;
  return `<circle cx="${10 + Math.cos(a) * 7.5}" cy="${10 + Math.sin(a) * 7.5}" r="${d}" fill="${c}"/>`;
}).join('')}</svg>`;

/* ───────────────────────── step-sequencer view ───────────────────────── */
function seqGrid(p, muted) {
  const n = p.steps, grp = p.perBeat > 1 ? p.perBeat : (n === 12 ? 3 : 4);
  const nums = Array.from({ length: n }, (_, i) => `<span class="${i % grp === 0 ? 'b' : ''}">${i % grp === 0 ? i / grp + 1 : '·'}</span>`).join('');
  return `<div class="row"><span></span><div class="cells nums" style="--n:${n}">${nums}</div></div>` +
    p.layers.map((l, li) => `<div class="row${muted.has(li) ? ' off' : ''}" style="--c:${col(l.inst)}">
      <span class="rl"><i></i>${lab(l.inst).toUpperCase()}</span>
      <div class="cells" style="--n:${n}">${[...l.s].map((ch, i) =>
        `<button class="gc ${ch === '.' ? '' : ch}${i % grp === 0 && i ? ' b' : ''}" data-l="${li}" data-s="${i}" aria-label="${lab(l.inst)} step ${i + 1}: ${{ '.': 'rest', x: 'hit', X: 'accent', o: 'ghost' }[ch]}"></button>`).join('')}</div>
    </div>`).join('');
}

/* ───────────────────────── variations ─────────────────────────
   Seeded per pattern so each level always gives the same result. Timelines
   (clave, bells, congas, tabla, doumbek dum) are protected; other voices get,
   in order: ghost notes, accent moves, sixteenth doubles, kick pickups,
   dropped kicks and a fill into the next bar. */
const VARY_NAMES = ['ORIGINAL', 'SUBTLE', 'LIGHT', 'MEDIUM', 'BUSY', 'BOLD', 'WILD'];
const VARY_OPS = ['ghost', 'accent', 'double', 'pickup', 'ghost', 'drop', 'double', 'fill', 'pickup', 'ghost', 'accent'];
const VARY_COUNT = [0, 1, 2, 4, 5, 8, 11];
const ROLE = {
  kick: 'kick', log: 'kick', cajon: 'kick', tomL: 'kick',
  snare: 'snare', clap: 'snare', rim: 'snare', tek: 'snare',
  hat: 'hat', ohat: 'hat', ride: 'hat', shaker: 'hat', maracas: 'hat', tamb: 'hat', triangle: 'hat', guiro: 'hat'
};
const hashStr = s => { let h = 2166136261; for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
const mulberry = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

function vary(src, p, level) {
  const L = src.map(l => ({ inst: l.inst, s: [...l.s] }));
  const out = () => L.map(l => ({ inst: l.inst, s: l.s.join('') }));
  if (!level) return out();
  const rng = mulberry(hashStr(p.id)), n = p.steps, grp = p.perBeat > 1 ? p.perBeat : (n === 12 ? 3 : 4);
  const pick = a => a[Math.floor(rng() * a.length)];
  const by = r => L.filter(l => (ROLE[l.inst] || 'time') === r);
  const rests = (l, f) => l.s.map((c, i) => c === '.' && f(i) ? i : -1).filter(i => i >= 0);
  const hits = (l, f) => l.s.map((c, i) => c !== '.' && f(i) ? i : -1).filter(i => i >= 0);
  const busiest = a => a.slice().sort((x, y) => hits(y, () => 1).length - hits(x, () => 1).length)[0];
  const ghost = () => {
    const pool = by('snare').length ? by('snare') : by('hat').length ? by('hat') : [busiest(L)];
    const l = pick(pool), c = rests(l, i => i % grp !== 0);
    if (c.length) l.s[pick(c)] = 'o';
  };
  for (const op of VARY_OPS.slice(0, VARY_COUNT[level])) {
    if (op === 'ghost') ghost();
    else if (op === 'accent') {
      const pool = by('hat').length ? by('hat') : by('snare'); if (!pool.length) { ghost(); continue; }
      const l = pick(pool), h = hits(l, i => l.s[i] === 'x' || l.s[i] === 'o');
      if (h.length) l.s[pick(h)] = 'X';
    } else if (op === 'double') {
      const pool = by('hat').length ? by('hat') : by('snare'); if (!pool.length) { ghost(); continue; }
      const l = pick(pool), c = rests(l, i => l.s[(i - 1 + n) % n] !== '.' || l.s[(i + 1) % n] !== '.');
      if (c.length) l.s[pick(c)] = rng() < .5 ? 'o' : 'x';
    } else if (op === 'pickup') {
      let pool = by('kick');
      if (!pool.length) pool = L.filter(l => ['dum', 'bayan', 'congaL'].includes(l.inst));
      if (!pool.length || grp < 2) { ghost(); continue; }
      const l = pick(pool), c = rests(l, i => i % grp === grp - 1 || (grp % 2 === 0 && i % grp === grp / 2));
      if (c.length) l.s[pick(c)] = 'x';
    } else if (op === 'drop') {
      const pool = by('kick'); if (!pool.length) { ghost(); continue; }
      const l = pick(pool), h = hits(l, i => i !== 0 && i % grp !== 0);
      if (h.length && hits(l, () => 1).length > 2) l.s[pick(h)] = '.';
    } else if (op === 'fill') {
      if (grp < 3) { ghost(); continue; }
      const pool = by('snare').length ? by('snare') : by('kick'); if (!pool.length) { ghost(); continue; }
      const l = pick(pool), start = n - grp, fig = grp === 4 ? ['o', 'x', 'x', 'X'] : ['x', 'x', 'X'];
      fig.forEach((c, j) => l.s[start + j] = c);
      if (ROLE[l.inst] === 'snare') by('hat').forEach(h => { for (let j = start; j < n; j++) h.s[j] = '.'; });
    }
  }
  return out();
}

/* ───────────────────────── knobs + flip digits ───────────────────────── */
function setFlip(host, value, digits) {
  const neg = value < 0;
  let s = String(Math.abs(Math.round(value))).padStart(digits, '0').slice(-digits);
  if (neg) s = '-' + s.slice(1);
  if (host.children.length !== digits) host.innerHTML = '<span></span>'.repeat(digits);
  [...host.children].forEach((cell, i) => {
    if (cell.textContent !== s[i]) { cell.textContent = s[i]; cell.classList.remove('f'); void cell.offsetWidth; cell.classList.add('f'); }
  });
}
function knob(el, flipEl, { min, max, value, def = value, digits = 2, label, onChange }) {
  let v = value;
  const draw = () => {
    const S = 52, c = S / 2, rad = S / 2 - 3, bw = Math.max(3, rad * .16), clr = Math.max(3, rad * .14);
    const barR = rad - bw / 2, thinR = barR - bw / 2 - clr - .5;
    const a0 = -135, a1 = a0 + 270 * (v - min) / Math.max(1, max - min);
    const P2 = a => [c + barR * Math.sin(a * Math.PI / 180), c - barR * Math.cos(a * Math.PI / 180)];
    const [x0, y0] = P2(a0), [x1, y1] = P2(Math.max(a1, a0 + .5));
    el.innerHTML = `<svg viewBox="0 0 ${S} ${S}" style="color:var(--acc)"><circle cx="${c}" cy="${c}" r="${thinR}" fill="none" stroke="rgba(0,0,0,.55)" stroke-width="1"/>
      <path d="M${x0} ${y0}A${barR} ${barR} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}" fill="none" stroke="currentColor" stroke-width="${bw}" stroke-linecap="round"/>
      <circle cx="${c}" cy="${c}" r="${Math.max(2, thinR * .45)}" fill="currentColor"/></svg>`;
    el.setAttribute('aria-valuenow', v);
    if (flipEl) setFlip(flipEl, v, digits);
  };
  const set = (nv, fire = true) => { nv = Math.round(Math.min(max, Math.max(min, nv))); if (nv === v && fire) return; v = nv; draw(); if (fire) onChange(v); };
  el.tabIndex = 0;
  el.setAttribute('role', 'slider'); el.setAttribute('aria-label', label);
  el.setAttribute('aria-valuemin', min); el.setAttribute('aria-valuemax', max);
  let sy, sv;
  el.addEventListener('pointerdown', e => { sy = e.clientY; sv = v; el.setPointerCapture(e.pointerId); });
  el.addEventListener('pointermove', e => { if (sy == null) return; set(sv + (sy - e.clientY) * (max - min) / 160); });
  el.addEventListener('pointerup', () => sy = null);
  el.addEventListener('pointercancel', () => sy = null);
  el.addEventListener('wheel', e => { e.preventDefault(); set(v + (e.deltaY < 0 ? 1 : -1)); }, { passive: false });
  el.addEventListener('dblclick', () => set(def));
  el.addEventListener('keydown', e => {
    const k = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 10, PageDown: -10 }[e.key];
    if (k) { e.preventDefault(); set(v + k); }
    if (e.key === 'Home') { e.preventDefault(); set(min); }
    if (e.key === 'End') { e.preventDefault(); set(max); }
  });
  draw();
  return { set: (nv, fire = false) => set(nv, fire), get: () => v, setRange(mn, mx) { min = mn; max = mx; el.setAttribute('aria-valuemax', mx); v = Math.min(max, Math.max(min, v)); draw(); } };
}

/* ───────────────────────── state & UI ───────────────────────── */
const $ = id => document.getElementById(id);
let cur, base, src, level = 0, muted = new Set(), view = 'circle', pure = false;
let family = 'All', query = '', stepsF = 'all', sortBy = 'family', visible = ALL, hitsByStep = [], colCells = [];
try { pure = localStorage.getItem('da-pure') === '1'; view = localStorage.getItem('da-view') || 'circle'; } catch (e) {}

document.documentElement.style.setProperty('--acc', MAJOR);
document.documentElement.style.setProperty('--accLcd', onLcd(MAJOR));

const kBpm = knob($('kBpm'), $('fBpm'), { min: 40, max: 240, value: 120, digits: 3, label: 'Tempo', onChange: v => { cur.bpm = v; } });
const kSwing = knob($('kSwing'), $('fSwing'), { min: 0, max: 60, value: 0, digits: 2, label: 'Swing', onChange: v => { cur.swing = v / 100; } });
const kHits = knob($('kHits'), $('fHits'), { min: 1, max: 16, value: 5, digits: 2, label: 'Euclidean hits', onChange: () => ePreview() });
const kRot = knob($('kRot'), $('fRot'), { min: 0, max: 15, value: 0, digits: 2, label: 'Euclidean rotation', onChange: () => ePreview() });

function setLevel(v, redraw = true) {
  level = v;
  $('vary').value = v; $('vary').style.setProperty('--p', (v / 6 * 100) + '%');
  setFlip($('fVary'), v, 1);
  $('varyName').textContent = VARY_NAMES[v] + (v ? ' · VARIATION ' + v + ' OF 6' : ' · AS WRITTEN');
  cur.layers = vary(src, cur, v);
  if (redraw) drawStage();
}
$('vary').addEventListener('input', e => setLevel(+e.target.value));

function load(id, scroll) {
  base = byId[id] || ALL[0];
  cur = clone(base); src = cur.layers.map(l => ({ ...l })); muted = new Set();
  kBpm.set(cur.bpm); kSwing.set(Math.round(cur.swing * 100));
  kHits.setRange(1, cur.steps); kRot.setRange(0, cur.steps - 1);
  $('swingWrap').classList.toggle('off', !(cur.steps === 16 && cur.perBeat === 4));
  setFlip($('fSteps'), cur.steps, 2);
  setLevel(0, false);
  drawStage();
  document.querySelectorAll('.card').forEach(c => c.classList.toggle('sel', c.dataset.id === base.id));
  try { history.replaceState(null, '', '#' + base.id); } catch (e) {}
  if (scroll) $('bigFig').closest('.stage').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}

/* an edit (step click, layer add/remove, clear) becomes the new starting point */
function commit() {
  src = cur.layers.map(l => ({ ...l }));
  if (level) { toast('EDIT KEPT. VARIATION RESET TO 0'); setLevel(0, false); }
  drawStage();
}

function setView(v) {
  view = v;
  try { localStorage.setItem('da-view', v); } catch (e) {}
  $('tabCircle').setAttribute('aria-selected', v === 'circle'); $('tabCircle').setAttribute('aria-pressed', v === 'circle');
  $('tabGrid').setAttribute('aria-selected', v === 'grid'); $('tabGrid').setAttribute('aria-pressed', v === 'grid');
  $('bigFig').hidden = v !== 'circle'; $('gridView').hidden = v !== 'grid';
  $('pure').hidden = v !== 'circle';
}
$('tabCircle').onclick = () => setView('circle');
$('tabGrid').onclick = () => setView('grid');
$('pure').onclick = () => {
  pure = !pure; $('pure').setAttribute('aria-pressed', pure);
  try { localStorage.setItem('da-pure', pure ? '1' : '0'); } catch (e) {}
  drawStage(); renderLib();
};

function drawStage() {
  $('bigFig').innerHTML = wheel(cur, { big: true, muted, pure });
  $('gridView').innerHTML = seqGrid(cur, muted);
  $('pName').textContent = cur.name.toUpperCase();
  $('pFamily').textContent = cur.family.toUpperCase();
  $('pRegion').textContent = cur.region.toUpperCase();
  $('pNote').textContent = cur.note || '';
  $('layers').innerHTML = cur.layers.map((l, i) => `
    <li class="${muted.has(i) ? 'off' : ''}" style="--c:${col(l.inst)}">
      <button class="led" data-i="${i}" aria-pressed="${!muted.has(i)}" aria-label="${muted.has(i) ? 'Unmute' : 'Mute'} ${lab(l.inst)}"><i></i></button>
      <span class="nm">${lab(l.inst).toUpperCase()}</span>
      <span class="eu">${euclidName(l.s).toUpperCase() || '—'}</span>
      <button class="del" data-i="${i}" aria-label="Remove ${lab(l.inst)}">X</button>
    </li>`).join('') || '<li><span class="nm">NO LAYERS. ADD ONE BELOW.</span></li>';
  ePreview();
  hitsByStep = Array.from({ length: cur.steps }, (_, s) => [...$('bigFig').querySelectorAll(`.hit[data-s="${s}"]`)]);
  colCells = Array.from({ length: cur.steps }, (_, s) => [...$('gridView').querySelectorAll(`.gc[data-s="${s}"]`)]);
  lastCol = -1;
}

function toggleStep(li, s) {
  const l = cur.layers[li];
  const next = { '.': 'x', x: 'X', X: 'o', o: '.' }[l.s[s]];
  l.s = l.s.slice(0, s) + next + l.s.slice(s + 1);
  if (next !== '.' && ctx) SYN[l.inst]?.(audio().currentTime, VEL[next]);
  commit();
}
$('bigFig').addEventListener('click', e => { const c = e.target.closest('.cell'); if (c) toggleStep(+c.dataset.l, +c.dataset.s); });
$('gridView').addEventListener('click', e => { const c = e.target.closest('.gc'); if (c) toggleStep(+c.dataset.l, +c.dataset.s); });
$('layers').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const i = +b.dataset.i;
  if (b.classList.contains('led')) { muted.has(i) ? muted.delete(i) : muted.add(i); drawStage(); }
  else { cur.layers.splice(i, 1); muted = new Set([...muted].filter(m => m !== i).map(m => m > i ? m - 1 : m)); commit(); }
});
$('reset').onclick = () => { const b = cur.bpm; load(base.id); kBpm.set(b); cur.bpm = b; };
$('clear').onclick = () => { cur.layers.forEach(l => l.s = '.'.repeat(cur.steps)); commit(); };

$('eInst').innerHTML = Object.keys(INST).map(k => `<option value="${k}">${lab(k)}</option>`).join('');
const eStr = () => { const n = cur.steps, k = kHits.get(), r = kRot.get() % n; return rotate(euclidStr(k, n), (n - r) % n); };
function ePreview() { if (cur) $('ePreview').textContent = eStr().replace(/x/g, '◆').replace(/\./g, '·') + '   E(' + kHits.get() + ',' + cur.steps + ')'; }
$('eAdd').onclick = () => { cur.layers.push({ inst: $('eInst').value, s: eStr() }); commit(); };

function toast(msg) { $('toast').textContent = msg; clearTimeout(toast.t); toast.t = setTimeout(() => $('toast').textContent = '', 2600); }
$('copy').onclick = async () => {
  const Ls = cur.layers.map(l => `${l.inst}: '${l.s}'`).join(', ');
  const txt = `{ id: '${cur.id}-custom', name: '${cur.name.replace(/'/g, "\\'")}', family: '${cur.family}', region: '${cur.region}', bpm: ${cur.bpm}` +
    (cur.swing ? `, swing: ${cur.swing}` : '') + (cur.steps !== 16 ? `, steps: ${cur.steps}, perBeat: ${cur.perBeat}` : '') +
    `,\n  layers: { ${Ls} },\n  note: '' },`;
  try { await navigator.clipboard.writeText(txt); toast('COPIED. PASTE IT INTO PATTERNS.JS'); }
  catch (e) { console.log(txt); toast('COPY BLOCKED. THE DATA IS IN THE BROWSER CONSOLE'); }
};

/* prev / next / random walk the library as currently filtered and sorted */
function walk(dir) {
  const list = visible.length ? visible : ALL;
  const i = list.findIndex(p => p.id === base.id);
  load(list[(i + dir + list.length) % list.length].id);
}
$('prev').onclick = () => walk(-1);
$('next').onclick = () => walk(1);
$('rand').onclick = () => { const list = visible.length ? visible : ALL; let p; do { p = list[Math.floor(Math.random() * list.length)]; } while (list.length > 1 && p.id === base.id); load(p.id); };

/* ───────────────────────── sequencer ───────────────────────── */
let playing = false, timer, nextT, stepN, queue = [], last = null, lastCol = -1;
function schedule() {
  const dur = 60 / cur.bpm / cur.perBeat;
  while (nextT < ctx.currentTime + .12) {
    const s = stepN % cur.steps;
    const sw = (cur.steps === 16 && cur.perBeat === 4 && s % 2) ? cur.swing * dur * .66 : 0;
    const t = nextT + sw;
    cur.layers.forEach((l, i) => { const c = l.s[s]; if (c && c !== '.' && !muted.has(i)) SYN[l.inst]?.(t, VEL[c] || .75); });
    queue.push({ s, t, dur });
    nextT += dur; stepN++;
  }
}
function markCol(s) {
  (colCells[lastCol] || []).forEach(c => c.classList.remove('now'));
  (colCells[s] || []).forEach(c => c.classList.add('now'));
  lastCol = s;
}
function frame() {
  if (!playing) return;
  const now = ctx.currentTime;
  while (queue.length && queue[0].t <= now) {
    last = queue.shift();
    (hitsByStep[last.s] || []).forEach(h => { h.classList.add('on'); setTimeout(() => h.classList.remove('on'), 110); });
    markCol(last.s);
  }
  const head = document.getElementById('head');
  if (head && last) {
    const frac = Math.min((now - last.t) / last.dur, 1), glide = frac > .8 ? (frac - .8) / .2 : 0;
    const an = ((last.s + glide) * 360 / cur.steps - 90) * Math.PI / 180, hr = +head.dataset.r;
    head.setAttribute('transform', `translate(${200 + hr * Math.cos(an)} ${200 + hr * Math.sin(an)})`);
  }
  requestAnimationFrame(frame);
}
function setPlaying(on) {
  playing = on;
  $('play').textContent = on ? 'STOP' : 'PLAY';
  $('play').classList.toggle('lit', on);
  $('play').setAttribute('aria-label', on ? 'Stop' : 'Play');
  if (on) {
    audio(); ctx.resume();
    stepN = 0; queue = []; last = null; nextT = ctx.currentTime + .06;
    timer = setInterval(schedule, 25); schedule(); requestAnimationFrame(frame);
  } else {
    clearInterval(timer); queue = []; markCol(-1);
    const head = document.getElementById('head'); if (head) head.setAttribute('transform', `translate(200 ${200 - head.dataset.r})`);
  }
}
$('play').onclick = () => setPlaying(!playing);
document.addEventListener('keydown', e => {
  if (e.target.closest('input,select,textarea,[role=slider]')) return;
  if (e.code === 'Space' && !e.target.closest('button')) { e.preventDefault(); setPlaying(!playing); }
  if (e.key === 'ArrowRight') walk(1);
  if (e.key === 'ArrowLeft') walk(-1);
});

/* ───────────────────────── library ───────────────────────── */
const norm = s => s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '');
const playIcon = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1l9 5-9 5z"/></svg>';
function card(p) {
  const c = FAM_COL[p.family] || P.gold;
  return `<div class="card${base && p.id === base.id ? ' sel' : ''}" data-id="${p.id}" style="--c:${c}">
    <button class="open" data-id="${p.id}" aria-label="Open ${p.name}">
      <span class="ch">${euclidIcon(isLight(c) ? HOUSE.ink : c)}<b>${p.name.toUpperCase()}</b></span>
      <span class="fig">${wheel(p, { pure })}</span>
    </button>
    <div class="cf"><span>${p.region.toUpperCase()} · ${p.bpm} BPM${p.steps !== 16 ? ' · ' + p.steps : ''}</span>
      <button class="key cplay" data-id="${p.id}" aria-label="Play ${p.name}">${playIcon}</button></div>
  </div>`;
}
function chips() {
  const counts = ALL.reduce((m, p) => (m[p.family] = (m[p.family] || 0) + 1, m), {});
  $('chips').innerHTML = ['All', ...window.FAMILIES.filter(f => counts[f])].map(f =>
    `<button class="seg" style="--c:${f === 'All' ? MAJOR : FAM_COL[f]}" data-f="${f}" aria-pressed="${f === family}">${f.toUpperCase()}<small>${f === 'All' ? ALL.length : counts[f]}</small></button>`).join('');
}
function renderLib() {
  const q = norm(query);
  visible = ALL.filter(p => (family === 'All' || p.family === family) && (stepsF === 'all' || String(p.steps) === stepsF) &&
    (!q || norm([p.name, p.region, p.family, p.note, p.tags || '', p.steps + 'steps', ...p.layers.map(l => lab(l.inst))].join(' ')).includes(q)));
  const sorters = {
    family: (a, b) => window.FAMILIES.indexOf(a.family) - window.FAMILIES.indexOf(b.family),
    az: (a, b) => a.name.localeCompare(b.name), slow: (a, b) => a.bpm - b.bpm, fast: (a, b) => b.bpm - a.bpm,
    region: (a, b) => a.region.localeCompare(b.region)
  };
  visible = visible.slice().sort(sorters[sortBy]);
  $('count').textContent = `${visible.length} OF ${ALL.length} PATTERNS`;
  $('empty').hidden = visible.length > 0;
  $('clearF').hidden = family === 'All' && !query && stepsF === 'all' && sortBy === 'family';
  if (sortBy === 'family') {
    const groups = window.FAMILIES.map(f => [f, visible.filter(p => p.family === f)]).filter(([, l]) => l.length);
    $('lib').innerHTML = groups.map(([f, l]) => `<section class="fam" style="--c:${FAM_COL[f]}">
      <h3><i></i>${f.toUpperCase()} <small>${l.length}</small>${family === 'All' ? `<button class="more" data-f="${f}">ONLY THIS FAMILY</button>` : ''}</h3>
      <div class="grid">${l.map(card).join('')}</div></section>`).join('');
  } else $('lib').innerHTML = `<div class="grid">${visible.map(card).join('')}</div>`;
}
$('chips').addEventListener('click', e => { const b = e.target.closest('.seg'); if (!b) return; family = b.dataset.f; chips(); renderLib(); });
$('search').addEventListener('input', e => { query = e.target.value; renderLib(); });
$('sort').addEventListener('change', e => { sortBy = e.target.value; renderLib(); });
$('stepsF').addEventListener('click', e => {
  const b = e.target.closest('.seg'); if (!b) return; stepsF = b.dataset.s;
  $('stepsF').querySelectorAll('.seg').forEach(x => x.setAttribute('aria-pressed', x === b)); renderLib();
});
$('clearF').onclick = () => {
  family = 'All'; query = ''; stepsF = 'all'; sortBy = 'family';
  $('search').value = ''; $('sort').value = 'family';
  $('stepsF').querySelectorAll('.seg').forEach(x => x.setAttribute('aria-pressed', x.dataset.s === 'all'));
  chips(); renderLib();
};
$('lib').addEventListener('click', e => {
  const more = e.target.closest('.more');
  if (more) { family = more.dataset.f; chips(); renderLib(); $('chips').scrollIntoView({ block: 'nearest' }); return; }
  const pl = e.target.closest('.cplay');
  if (pl) { load(pl.dataset.id, true); if (!playing) setPlaying(true); return; }
  const o = e.target.closest('.open'); if (o) load(o.dataset.id, true);
});
window.addEventListener('hashchange', () => { const id = location.hash.slice(1); if (byId[id] && id !== base.id) load(id); });

$('pure').setAttribute('aria-pressed', pure);
setView(view);
chips();
renderLib();
load(location.hash.slice(1) || 'son-clave');
}
