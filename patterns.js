/*
  Drum Pattern Atlas: pattern data
  ---------------------------------
  Each pattern:
    id        unique slug (used in share links)
    name      display name
    family    one of the FAMILIES below (drives the filter chips)
    region    where it comes from
    bpm       default tempo (quarter-note / beat)
    steps     16 (default) or 12
    perBeat   steps per beat (default 4 = 16th notes; 3 = triplets; 1 = one step per beat/matra)
    swing     0–0.6, delays every second 16th (16-step patterns only)
    layers    { instrument: "step string" }  first layer = outer ring
                x = hit   X = accent   o = ghost / soft   . = rest
    note      short context; say "simplified" when it is a reduction of a real groove

  Instrument keys: kick snare rim clap hat ohat ride crash tamb shaker maracas cowbell
  clave bell congaH congaL tomH tomL guiro triangle dum tek bayan dayan palmas cajon log
*/

const euclid = (k, n, r = 0) => {
  const a = Array.from({ length: n }, (_, i) => ((i * k) % n) < k ? 'x' : '.');
  return a.slice(r).concat(a.slice(0, r)).join('');
};

window.FAMILIES = [
  'Rock & Pop', 'Metal & Punk', 'Funk, Soul & Disco', 'Hip-Hop & Breaks', 'Electronic',
  'Latin America', 'Caribbean', 'West & Central Africa', 'Southern Africa',
  'Middle East & North Africa', 'South Asia', 'Europe', 'Jazz & Blues', 'Euclidean timelines'
];

window.PATTERNS = [
  // ───────── Rock & Pop ─────────
  { id: 'rock-basic', name: 'Basic Rock Beat', family: 'Rock & Pop', region: 'USA / UK', bpm: 110,
    layers: { hat: 'x.x.x.x.x.x.x.x.', snare: '....x.......x...', kick: 'x.......x.x.....' },
    note: 'The default backbeat: snare on 2 and 4, kick on 1 and 3 with a push on the "and" of 3.' },
  { id: 'rock-16', name: 'Rock, 16th Hi-hat', family: 'Rock & Pop', region: 'USA / UK', bpm: 96,
    layers: { hat: 'XoXoXoXoXoXoXoXo', snare: '....x.......x...', kick: 'x......x..x.....' },
    note: 'Driving sixteenth hats with accents on the eighths; kick anticipates beat 3.' },
  { id: 'motown', name: 'Motown Backbeat', family: 'Rock & Pop', region: 'Detroit, USA', bpm: 120,
    layers: { tamb: '....x.......x...', hat: 'x.x.x.x.x.x.x.x.', snare: '....x.......x...', kick: 'x.x.....x.x.....' },
    note: 'Simplified. Tambourine doubles the backbeat; many Motown records also put snare on all four beats.' },
  { id: 'pop-groove', name: 'Straight Pop Groove', family: 'Rock & Pop', region: 'USA', bpm: 117,
    layers: { shaker: 'xxxxxxxxxxxxxxxx', hat: 'x.x.x.x.x.x.x.x.', snare: '....x.......x...', kick: 'x.......x.......' },
    note: 'The steady, unadorned 80s pop pattern: eighth hats, kick 1 & 3, snare 2 & 4.' },
  { id: 'stomp-clap', name: 'Stomp-Stomp-Clap', family: 'Rock & Pop', region: 'UK', bpm: 81,
    layers: { clap: '....x.......x...', kick: 'x.x.....x.x.....' },
    note: 'Two stomps and a clap, the stadium chant rhythm.' },
  { id: 'train-beat', name: 'Train Beat', family: 'Rock & Pop', region: 'USA (country)', bpm: 150,
    layers: { snare: 'xoxoXoxoxoxoXoxo', kick: 'x.......x.......' },
    note: 'Continuous sixteenth snare (often brushes) accenting 2 and 4, as on country and rockabilly records.' },
  { id: 'bo-diddley', name: 'Bo Diddley Beat', family: 'Rock & Pop', region: 'USA', bpm: 100,
    layers: { maracas: 'xoxoxoxoxoxoxoxo', tomL: 'x..x..x...x.x...' },
    note: 'The son clave (3-2) brought into rock & roll on toms and maracas.' },

  // ───────── Metal & Punk ─────────
  { id: 'skank', name: 'Punk Skank Beat', family: 'Metal & Punk', region: 'USA / UK', bpm: 190,
    layers: { crash: 'x...x...x...x...', snare: '..x...x...x...x.', kick: 'x...x...x...x...' },
    note: 'Kick on the beat, snare on the off-beat: polka "oom-pah" at punk tempo.' },
  { id: 'blast', name: 'Blast Beat', family: 'Metal & Punk', region: 'Global (extreme metal)', bpm: 180,
    layers: { ride: 'x.x.x.x.x.x.x.x.', snare: '.x.x.x.x.x.x.x.x', kick: 'x.x.x.x.x.x.x.x.' },
    note: 'Simplified traditional blast: kick + cymbal alternate with snare at sixteenth speed.' },
  { id: 'gallop', name: 'Gallop', family: 'Metal & Punk', region: 'UK (NWOBHM)', bpm: 150,
    layers: { crash: 'x...............', snare: '....x.......x...', kick: 'x.xxx.xxx.xxx.xx' },
    note: 'Eighth + two sixteenths on double kick, the galloping heavy-metal figure.' },
  { id: 'breakdown', name: 'Half-time Breakdown', family: 'Metal & Punk', region: 'USA (metalcore)', bpm: 140,
    layers: { crash: 'x.......x.......', snare: '........x.......', kick: 'x..x..x...x..x..' },
    note: 'Snare only on beat 3; kick locks to a syncopated guitar chug.' },

  // ───────── Funk, Soul & Disco ─────────
  { id: 'disco', name: 'Disco', family: 'Funk, Soul & Disco', region: 'New York / Philadelphia', bpm: 120,
    layers: { ohat: '..x...x...x...x.', hat: 'x...x...x...x...', snare: '....x.......x...', kick: 'x...x...x...x...' },
    note: 'Four-on-the-floor with open hats on every off-beat.' },
  { id: 'funky-drummer', name: 'Funky Drummer-style', family: 'Funk, Soul & Disco', region: 'USA', bpm: 100,
    layers: { hat: 'xxxxxxx.xxxxx.xx', ohat: '.......x.....x..', snare: '....X..o.o.oX..o', kick: 'x.x.......x..x..' },
    note: 'Simplified. Ghost-note snare and open-hat lifts typical of late-60s James Brown funk.' },
  { id: 'go-go', name: 'Go-Go Swing', family: 'Funk, Soul & Disco', region: 'Washington DC', bpm: 95, swing: 0.15,
    layers: { cowbell: 'x..x..x...x.x...', congaH: '..x...x...x.x.x.', snare: '....x.......x...', kick: 'x...x..x....x...' },
    note: 'Simplified. Cowbell and congas carry a clave-like pocket over a lazy swung kit.' },
  { id: 'new-jack', name: 'New Jack Swing', family: 'Funk, Soul & Disco', region: 'USA', bpm: 105, swing: 0.3,
    layers: { hat: 'x.x.x.x.x.x.x.x.', clap: '....x.......x...', snare: '....x.......x...', kick: 'x..x..x...x..x..' },
    note: 'Simplified. Heavily swung sixteenths with a syncopated drum-machine kick.' },

  // ───────── Hip-Hop & Breaks ─────────
  { id: 'amen', name: 'Amen Break (bar 1)', family: 'Hip-Hop & Breaks', region: 'USA', bpm: 136,
    layers: { ride: 'x.x.x.x.x.x.x.x.', snare: '....x..o.o..x..o', kick: 'x.x.......xx....' },
    note: 'First bar of the most sampled break in history, the backbone of jungle and drum & bass.' },
  { id: 'boom-bap', name: 'Boom Bap', family: 'Hip-Hop & Breaks', region: 'New York', bpm: 90, swing: 0.2,
    layers: { hat: 'x.x.x.x.x.x.x.x.', snare: '....x.......x...', kick: 'x......x..x.....' },
    note: 'Hard kick, cracking snare, loose swing: 90s East Coast hip-hop.' },
  { id: 'trap', name: 'Trap', family: 'Hip-Hop & Breaks', region: 'Atlanta', bpm: 140,
    layers: { hat: 'x.x.x.x.x.xxxxxx', clap: '........x.......', kick: 'x......x..x.....' },
    note: 'Half-time clap on 3, rolling hi-hats (real rolls use triplets and 32nds), 808 kick.' },
  { id: 'lofi', name: 'Lo-fi Hip-Hop', family: 'Hip-Hop & Breaks', region: 'Global', bpm: 80, swing: 0.35,
    layers: { hat: 'x.x.x.xxx.x.x.x.', snare: '....x.......x...', kick: 'x.......x.x.....' },
    note: 'Lazy, heavily swung, quantised-but-not-quite.' },

  // ───────── Electronic ─────────
  { id: 'house', name: 'House', family: 'Electronic', region: 'Chicago', bpm: 124,
    layers: { shaker: 'oxoxoxoxoxoxoxox', ohat: '..x...x...x...x.', clap: '....x.......x...', kick: 'x...x...x...x...' },
    note: 'Four-on-the-floor, clap on 2 & 4, off-beat open hat.' },
  { id: 'techno', name: 'Techno', family: 'Electronic', region: 'Detroit / Berlin', bpm: 130,
    layers: { hat: 'oooxoooxoooxooox', ohat: '..x...x...x...x.', rim: '...x..x.......x.', kick: 'x...x...x...x...' },
    note: 'Relentless kick, off-beat hats and a syncopated rim for motion.' },
  { id: 'electro', name: 'Electro', family: 'Electronic', region: 'New York / Detroit', bpm: 125,
    layers: { hat: 'x.x.x.x.x.x.x.x.', clap: '....x.......x...', kick: 'x.....x...x.....' },
    note: 'TR-808 syncopated kick under a clap backbeat.' },
  { id: 'two-step', name: 'UK Garage 2-Step', family: 'Electronic', region: 'London', bpm: 132, swing: 0.3,
    layers: { shaker: 'xxxxxxxxxxxxxxxx', ohat: '..x...x...x...x.', snare: '....x.......x...', kick: 'x.........x.....' },
    note: 'Kick skips beat 3; the swing in the sixteenths does the work.' },
  { id: 'dnb', name: 'Drum & Bass Two-Step', family: 'Electronic', region: 'UK', bpm: 174,
    layers: { ride: 'x.x.x.x.x.x.x.x.', snare: '....x..o....x...', kick: 'x.........x.....' },
    note: 'The classic two-step: kick on 1 and the "and" of 3, snare on 2 and 4.' },
  { id: 'dubstep', name: 'Dubstep', family: 'Electronic', region: 'London', bpm: 140,
    layers: { hat: 'x.x.x.x.x.x.x.x.', snare: '........x.......', kick: 'x.........x.....' },
    note: 'Half-time: one snare per bar on beat 3, lots of space for sub-bass.' },
  { id: 'jersey-club', name: 'Jersey Club', family: 'Electronic', region: 'Newark, USA', bpm: 140,
    layers: { clap: '....x.......x...', kick: 'x...x...x..x.x..' },
    note: 'Simplified. The five-kick figure is often swung toward triplets in practice.' },

  // ───────── Latin America ─────────
  { id: 'son-clave', name: 'Son Clave (3-2)', family: 'Latin America', region: 'Cuba', bpm: 100,
    layers: { clave: 'x..x..x...x.x...', shaker: 'xoxoxoxoxoxoxoxo' },
    note: 'The key pattern of Cuban music: three strokes then two.' },
  { id: 'rumba-clave', name: 'Rumba Clave (3-2)', family: 'Latin America', region: 'Cuba', bpm: 110,
    layers: { clave: 'x..x...x..x.x...', congaH: '....x.......x...', congaL: '......xx......xx' },
    note: 'Like son clave, but the third stroke is delayed by a sixteenth.' },
  { id: 'salsa', name: 'Salsa (2-3)', family: 'Latin America', region: 'Cuba / New York', bpm: 180,
    layers: { clave: '..x.x...x..x..x.', cowbell: 'x...x...x...x...', congaH: '....x.......x...', congaL: '......xx......xx' },
    note: 'Simplified ensemble: 2-3 clave, bongo bell on the beat, conga tumbao open tones on 4-and.' },
  { id: 'bossa', name: 'Bossa Nova', family: 'Latin America', region: 'Rio de Janeiro', bpm: 130,
    layers: { hat: 'x.x.x.x.x.x.x.x.', rim: 'x..x..x...x..x..', kick: 'x..xx..xx..xx..x' },
    note: 'Cross-stick bossa clave over a dotted surdo-style bass drum.' },
  { id: 'samba', name: 'Samba (kit)', family: 'Latin America', region: 'Rio de Janeiro', bpm: 100,
    layers: { shaker: 'XxxXXxxXXxxXXxxX', tomL: 'x...X...x...X...', kick: 'x..xx..xx..xx..x' },
    note: 'Simplified. Surdo accent falls on the second beat of each 2/4 bar.' },
  { id: 'baiao', name: 'Baião', family: 'Latin America', region: 'Northeast Brazil', bpm: 100,
    layers: { triangle: 'xxXxxxXxxxXxxxXx', kick: 'x..x....x..x....' },
    note: 'Zabumba bass figure (dotted eighth + sixteenth) under a constant triangle.' },
  { id: 'cumbia', name: 'Cumbia', family: 'Latin America', region: 'Colombia', bpm: 95,
    layers: { guiro: 'x.xxx.xxx.xxx.xx', congaH: '..x...x...x...x.', kick: 'x.......x.......' },
    note: 'Güiro long-short-short scrape with off-beat drum accents.' },
  { id: 'milonga', name: 'Milonga (3-3-2)', family: 'Latin America', region: 'Río de la Plata', bpm: 100,
    layers: { kick: 'x..x..x.x..x..x.' },
    note: 'The 3+3+2 grouping that underpins milonga and early tango.' },

  // ───────── Caribbean ─────────
  { id: 'habanera', name: 'Habanera', family: 'Caribbean', region: 'Cuba', bpm: 90,
    layers: { kick: 'x..xx.x.x..xx.x.' },
    note: 'Dotted eighth, sixteenth, two eighths: travelled to tango, Bizet and New Orleans.' },
  { id: 'one-drop', name: 'Reggae One Drop', family: 'Caribbean', region: 'Jamaica', bpm: 75, swing: 0.2,
    layers: { hat: 'x.x.x.x.x.x.x.x.', rim: '........x.......', kick: '........x.......' },
    note: 'Nothing on beat 1; kick and cross-stick land together on 3.' },
  { id: 'rockers', name: 'Reggae Rockers', family: 'Caribbean', region: 'Jamaica', bpm: 80,
    layers: { hat: '..x...x...x...x.', rim: '....x.......x...', kick: 'x.......x.......' },
    note: 'Popularised by Sly Dunbar: kick on 1 and 3, more drive than one drop.' },
  { id: 'steppers', name: 'Reggae Steppers', family: 'Caribbean', region: 'Jamaica / UK', bpm: 78,
    layers: { hat: 'x.x.x.x.x.x.x.x.', rim: '........x.......', kick: 'x...x...x...x...' },
    note: 'Kick on every beat, march-like; a foundation of dub.' },
  { id: 'ska', name: 'Ska', family: 'Caribbean', region: 'Jamaica', bpm: 150,
    layers: { rim: '..x...x...x...x.', hat: 'x.x.x.x.x.x.x.x.', snare: '....x.......x...', kick: 'x.......x.......' },
    note: 'Off-beat skank (shown on rim) over a shuffled R&B backbeat.' },
  { id: 'dembow', name: 'Dembow / Reggaeton', family: 'Caribbean', region: 'Jamaica → Puerto Rico / DR', bpm: 95,
    layers: { hat: 'x.x.x.x.x.x.x.x.', snare: '...x..x....x..x.', kick: 'x...x...x...x...' },
    note: 'Four-on-the-floor kick with the tresillo-derived snare.' },

  // ───────── West & Central Africa ─────────
  { id: 'afrobeat', name: 'Afrobeat', family: 'West & Central Africa', region: 'Lagos, Nigeria', bpm: 110,
    layers: { hat: 'XxxXxxXxXxxXxxXx', snare: '...o..x.o.o.x...', kick: 'x......x..x.....' },
    note: 'Simplified. In the Tony Allen tradition: busy interlocking hats, ghosted snare, sparse kick.' },
  { id: 'afrobeats', name: 'Afrobeats', family: 'West & Central Africa', region: 'Nigeria / Ghana', bpm: 104,
    layers: { shaker: 'xoxoxoxoxoxoxoxo', rim: '...x..x....x..x.', kick: 'x.....x...x.....' },
    note: 'Simplified. Modern pop groove; the rim echoes the tresillo/dembow figure.' },
  { id: 'gahu', name: 'Gahu Bell', family: 'West & Central Africa', region: 'Ewe, Ghana / Benin', bpm: 120,
    layers: { bell: 'x..x..x...x...x.', kick: 'x...x...x...x...' },
    note: 'One of the six "distinguished timelines" analysed by Godfried Toussaint.' },
  { id: 'shiko', name: 'Shiko', family: 'West & Central Africa', region: 'Nigeria', bpm: 110,
    layers: { bell: 'x...x.x...x.x...' },
    note: 'A five-stroke timeline; the most even of Toussaint\'s six.' },
  { id: 'soukous', name: 'Soukous Timeline', family: 'West & Central Africa', region: 'DR Congo', bpm: 130,
    layers: { clave: 'x..x..x...xx....', kick: 'x...x...x...x...' },
    note: 'Clave-like timeline with two adjacent strokes in the second half.' },
  { id: 'bembe', name: 'Standard Bell (Bembé)', family: 'West & Central Africa', region: 'Yoruba / Ewe → Cuba', bpm: 100, steps: 12, perBeat: 3,
    layers: { bell: 'x.x.xx.x.x.x', shaker: 'xoxxoxxoxxox', kick: 'x..x..x..x..' },
    note: 'The 7-stroke 12-pulse bell, heard across West Africa and the Afro-Cuban 6/8.' },

  // ───────── Southern Africa ─────────
  { id: 'amapiano', name: 'Amapiano', family: 'Southern Africa', region: 'Gauteng, South Africa', bpm: 113,
    layers: { shaker: 'xoxoxoxoxoxoxoxo', rim: '...x..x....x....', log: 'x..x..x...x...x.', kick: 'x...x...x...x...' },
    note: 'Simplified. Log-drum bass is the signature; patterns vary a lot by producer.' },
  { id: 'gqom', name: 'Gqom', family: 'Southern Africa', region: 'Durban, South Africa', bpm: 126,
    layers: { tomH: '..x.....x..x....', clap: '....x.......x...', kick: 'x..x..x...x.....' },
    note: 'Simplified. Broken, tom-heavy kick pattern with no four-on-the-floor.' },

  // ───────── Middle East & North Africa ─────────
  { id: 'maqsum', name: 'Maqsum', family: 'Middle East & North Africa', region: 'Egypt / Levant', bpm: 110,
    layers: { tek: '..x...x.....x...', dum: 'x.......x.......' },
    note: 'D T – T D – T – : the most common Arabic 4/4 rhythm.' },
  { id: 'baladi', name: 'Baladi', family: 'Middle East & North Africa', region: 'Egypt', bpm: 100,
    layers: { tek: '......x.....x...', dum: 'x.x.....x.......' },
    note: 'D D – T D – T – : maqsum with a doubled opening dum.' },
  { id: 'saidi', name: 'Saidi', family: 'Middle East & North Africa', region: 'Upper Egypt', bpm: 105,
    layers: { tek: '..x.........x...', dum: 'x.....x.x.......' },
    note: 'D T – D D – T – : associated with the cane dance.' },
  { id: 'ayoub', name: 'Ayoub', family: 'Middle East & North Africa', region: 'Egypt / Sudan', bpm: 100,
    layers: { tek: '...x..x....x..x.', dum: 'x...x...x...x...' },
    note: 'A driving 2/4 trance rhythm, shown twice per cycle.' },
  { id: 'malfuf', name: 'Malfuf', family: 'Middle East & North Africa', region: 'Egypt', bpm: 120,
    layers: { tek: '...x..x....x..x.', dum: 'x.......x.......' },
    note: 'Fast 2/4: one dum and two teks (3+3+2 feel).' },

  // ───────── South Asia ─────────
  { id: 'teentaal', name: 'Teentaal', family: 'South Asia', region: 'North India (Hindustani)', bpm: 120, perBeat: 1,
    layers: { dayan: 'Xxxxxxxxxxxxxxxx', bayan: 'Xxxxxxxx....xxxx' },
    note: '16 matras (4+4+4+4): dha dhin dhin dha ×2, dha tin tin ta, ta dhin dhin dha. The bass drops out in the khali section.' },
  { id: 'keherwa', name: 'Keherwa', family: 'South Asia', region: 'North India', bpm: 160, perBeat: 1,
    layers: { dayan: 'X.xxx.xxX.xxx.xx', bayan: 'Xx....x.Xx....x.' },
    note: '8 matras (dha ge na ti | na ka dhi na), shown twice. The everyday folk/film tala.' },
  { id: 'dadra', name: 'Dadra', family: 'South Asia', region: 'North India', bpm: 140, steps: 12, perBeat: 2,
    layers: { dayan: 'X.x.x.x.x.x.', bayan: 'X.x.........' },
    note: '6 matras (dha dhi na | dha ti na), one matra per two steps.' },

  // ───────── Europe ─────────
  { id: 'waltz', name: 'Waltz', family: 'Europe', region: 'Austria', bpm: 160, steps: 12, perBeat: 4,
    layers: { snare: '....x...x...', kick: 'x...........' },
    note: 'Bar of 3/4 in sixteenths: oom-pah-pah.' },
  { id: 'polka', name: 'Polka', family: 'Europe', region: 'Bohemia', bpm: 120,
    layers: { snare: '..x...x...x...x.', kick: 'x...x...x...x...' },
    note: 'Bass on the beat, snare on the off-beat: the ancestor of the punk skank beat.' },
  { id: 'bulerias', name: 'Bulerías / Soleá compás', family: 'Europe', region: 'Andalusia, Spain', bpm: 220, steps: 12, perBeat: 1,
    layers: { palmas: 'ooXooXoXoXoX', cajon: '..x..x.x.x.x' },
    note: '12-beat flamenco compás, accents on 3, 6, 8, 10, 12.' },

  // ───────── Jazz & Blues ─────────
  { id: 'swing-ride', name: 'Swing Ride', family: 'Jazz & Blues', region: 'USA', bpm: 140, steps: 12, perBeat: 3,
    layers: { ride: 'x..x.xx..x.x', hat: '...x.....x..', kick: 'o..o..o..o..' },
    note: '"Ding, ding-a-ding" ride with hi-hat foot on 2 and 4 and feathered kick.' },
  { id: 'shuffle', name: 'Blues Shuffle', family: 'Jazz & Blues', region: 'Chicago / Texas', bpm: 100, steps: 12, perBeat: 3,
    layers: { hat: 'x.xx.xx.xx.x', snare: '...x.....x..', kick: 'x.....x.....' },
    note: 'Triplet long-short shuffle on hats.' },

  // ───────── Euclidean timelines ─────────
  { id: 'tresillo', name: 'Tresillo E(3,8)', family: 'Euclidean timelines', region: 'Afro-Cuban / global', bpm: 100,
    layers: { clave: euclid(3, 8) + euclid(3, 8) },
    note: 'E(3,8) shown twice. Three strokes spread as evenly as possible over eight pulses.' },
  { id: 'cinquillo', name: 'Cinquillo E(5,8)', family: 'Euclidean timelines', region: 'Cuba', bpm: 100,
    layers: { clave: euclid(5, 8) + euclid(5, 8) },
    note: 'E(5,8) shown twice. Found in danzón and merengue.' },
  { id: 'e5-16', name: 'E(5,16)', family: 'Euclidean timelines', region: 'Brazil', bpm: 120,
    layers: { bell: euclid(5, 16) },
    note: 'A rotation of the bossa-nova timeline (Toussaint).' },
  { id: 'e7-16', name: 'E(7,16)', family: 'Euclidean timelines', region: 'Brazil', bpm: 110,
    layers: { bell: euclid(7, 16) },
    note: 'A samba necklace pattern (Toussaint).' },
  { id: 'e9-16', name: 'E(9,16)', family: 'Euclidean timelines', region: 'Central Africa', bpm: 110,
    layers: { bell: euclid(9, 16) },
    note: 'Used in rhythms of the Central African Republic (Toussaint).' }
];
