import React, { useEffect, useMemo, useRef, useState } from 'react';

/**
 * The halftone sketch: a small printed dot cloud that keeps re-plotting
 * itself, and occasionally makes sense of itself.
 *
 * Read one way it's a patch of halftone — dots of unequal size, multiplied and
 * pulled a hair off true. Read the other, it's data. Each press re-plots the
 * dots, and the randoms and the structured plots alternate so the sketch keeps
 * showing its hand and then taking it back:
 *
 *   cloud · line · cloud · bars · cloud · parabola · cloud · by-ink · cloud · map
 *
 * The clouds are genuinely random, but NOT uniform noise. Uniform reads as a
 * machine generating coordinates: evenly thin right up to the edge, and it
 * advertises the frame it lives in. These are clumped instead — a handful of
 * loose centres with most dots near one and a minority thrown well clear — and
 * the cloud is drawn in a box BIGGER than the plot's, so the field drifts out
 * past the frame on the open sides. Both are the same idea: a handful of dots
 * tossed at paper, not a grid with jitter. When a structured plot comes round,
 * the dots TIGHTEN back into the plot box, and the frame asserts itself then.
 *
 * Each dot keeps its size, its ink pair, its delay and its data coordinate for
 * the visit — it is the same dot each time — but every cloud redraws where they
 * land, so the randoms in a cycle are different data sets.
 *
 * A bigger figure means MORE DOTS, never fatter ones: the dot size is set so
 * the dots keep the physical size they had in a smaller box, and the count does
 * the work of filling a bigger one.
 *
 * Each dot prints in TWO of the three drums' inks. Where the two cross, the
 * multiply turns pink+blue to violet and pink+yellow to a warm orange, so the
 * field carries all three inks and mixes them rather than laying down two flat
 * colours. (blue+yellow was tried and dropped: its olive reads as a green the
 * field was never given.)
 *
 * Desktop draws in a square; narrower screens get a flat strip with the same
 * shapes re-laid for it — the parcels become three bands rather than a pie.
 */

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Counts. The desktop field is set to the number of land cells in the raster
   below (144), so when the map comes round it prints COMPLETE — one dot per
   cell. The strip takes a sparser field, because at that size a full one turns
   to mud; its map is a stipple of about two thirds of the land. */
const COUNT = { wide: 144, flat: 96 };

/* Two pairs, not three. blue+yellow multiplies into an olive that reads as a
   green the field was never given, and green is not one of the sketch's inks —
   so the pairs are pink+blue (violet) and pink+yellow (orange), which keeps
   all three inks present and mixes them without inventing a fourth colour. */
const INK_PAIRS = [
  ['pink', 'blue'],
  ['pink', 'yellow'],
];

/* The three parcels the by-ink plot sorts into. */
const SORTS = ['pink', 'blue', 'yellow'];

/**
 * A coarse world raster, 24 columns by 12 rows, '#' = land. Hand-drawn at 15° of
 * longitude a cell and about 11.7° of latitude — chunky, but the continents are
 * all in the right place and the Atlantic is a real gap. Rows run north to
 * south from 65°N to about 61°S. Antarctica is left off, as most world maps cut
 * it.
 *
 * It is only ever used as a list of cells: `LAND` below flattens it, and each
 * dot takes one cell. Drawing it rather than shipping a GeoJSON keeps the
 * sketch a few hundred bytes and costs no request.
 */
const MAP = [
  '..####..###.###########.',
  '.########.##############',
  '...#####...############.',
  '....####...###########..',
  '.....##....##########...',
  '......##...##########...',
  '.......#...####.#.####..',
  '.......###.#####...###..',
  '........###.####...####.',
  '........###.###....####.',
  '........##............##',
  '........#...............',
];
const MAP_COLS = 24;
const MAP_ROWS = 12;

/* Flattened to one entry per land cell, then SHUFFLED with a fixed seed. The
   shuffle matters: the map is sometimes drawn with fewer dots than it has cells
   (on the strip), and raster order would spend every dot on the top rows and
   leave the southern hemisphere empty. A fixed seed keeps it stable between
   visits rather than reshuffling under the reader. */
const LAND = (() => {
  const cells = [];
  MAP.forEach((row, r) => {
    for (let c = 0; c < row.length; c += 1) if (row[c] === '#') cells.push({ c, r });
  });
  const rand = mulberry32(20251009);
  for (let i = cells.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    const t = cells[i];
    cells[i] = cells[j];
    cells[j] = t;
  }
  return cells;
})();

const newSeed = () => (Math.random() * 2 ** 31) | 0;

/* ---- the cloud's box, and how the dots get scattered into it ----------------
 * Drawn in a box BIGGER than the plot's, so the field drifts out past the frame
 * on the sides where the sheet is open (chiefly left, up and down). A field
 * that never leaves its square is announcing the square; the frame should only
 * assert itself when a structured plot pulls the dots back into it.
 *
 * The positions are clumped, not uniform: a handful of loose centres, most dots
 * falling near one, a minority thrown well clear. Uniform noise reads as a
 * machine, and clumping keeps the boundary quiet on its own, because the mass
 * sits in the middle of the clumps rather than at the edge. */
const BLEED = {
  // desktop: the sheet is open to the left, above and below, so the cloud
  // drifts out past the frame on those sides
  wide: { left: 0.26, right: 0.12, top: 0.2, bottom: 0.16 },
  // the strip: a phone has no margin to run into, and a field sliding under the
  // bezel is not a mark, it is a bug — so the bleed is vertical only, and the
  // drawing stays inside the page's own margin
  flat: { left: 0, right: 0, top: 0.08, bottom: 0.06 },
};

/** The cloud box for a layout, as fractions of the plot (0..1 = the plot box). */
const boxOf = (b) => ({ x0: -b.left, x1: 1 + b.right, y0: -b.top, y1: 1 + b.bottom });

const clampRange = (v, a, b) => Math.max(a, Math.min(b, v));

/** Roughly normal: mean 0, sd ≈ 0.29. */
const gauss = (rand) => (rand() + rand() + rand() + rand() - 2) / 2;

/** Where the whole field lands for this cloud, in the given cloud box. */
function cloudPositions(count, rand, box) {
  const clusters = Math.max(4, Math.round(count / 14));
  const centres = Array.from({ length: clusters }, () => ({
    x: box.x0 + rand() * (box.x1 - box.x0),
    y: box.y0 + rand() * (box.y1 - box.y0),
  }));
  const NEAR = 0.085 / 0.29; // a dot that belongs to a clump
  const FAR = 0.3 / 0.29; // one thrown well clear of it
  return Array.from({ length: count }, (_, i) => {
    const c = centres[i % clusters];
    const s = rand() < 0.16 ? FAR : NEAR;
    return {
      cx: clampRange(c.x + gauss(rand) * s, box.x0, box.x1),
      cy: clampRange(c.y + gauss(rand) * s, box.y0, box.y1),
    };
  });
}

/** A dot's coordinate inside the PLOT, from where it landed in the cloud box. */
const toPlot = (v, a, b) => (v - a) / (b - a);

/**
 * A full set: cloud position, plot coordinate, size, delay, ink pair, parcel.
 *
 * `noise` is a separate, roughly normal wobble, used by the line and the
 * parabola so their dots print a hair off the guide instead of on a ruler.
 * `sort` is its own draw, so the by-ink plot splits roughly evenly instead of
 * following the ink pairs, which would pile two thirds of the field into one
 * wedge.
 */
function freshPoints(count, box) {
  const rand = mulberry32(newSeed());
  const pos = cloudPositions(count, rand, box);
  return pos.map((p) => ({
    cx: p.cx,
    cy: p.cy,
    px: toPlot(p.cx, box.x0, box.x1),
    py: toPlot(p.cy, box.y0, box.y1),
    noise: rand() + rand() + rand() - 1.5, // roughly normal
    r: 0.55 + rand() * 0.9, // halftone: unequal dot sizes
    delay: Math.round(rand() * 180),
    inks: INK_PAIRS[Math.floor(rand() * INK_PAIRS.length)],
    sort: SORTS[Math.floor(rand() * SORTS.length)],
  }));
}

/**
 * Re-plot the SAME dots into a NEW cloud.
 *
 * Only where they land is redrawn, so the dots keep their sizes, their ink
 * pairs and their identity while the data underneath them changes — which is
 * what makes the later randoms read as new data rather than as the first cloud
 * reappearing.
 */
function replot(prev, box) {
  const rand = mulberry32(newSeed());
  const pos = cloudPositions(prev.length, rand, box);
  return prev.map((p, i) => ({
    ...p,
    cx: pos[i].cx,
    cy: pos[i].cy,
    px: toPlot(pos[i].cx, box.x0, box.x1),
    py: toPlot(pos[i].cy, box.y0, box.y1),
  }));
}

// Randoms and structured plots alternate, so every shape is bounded by two
// clouds and the sketch never shows its whole hand at once.
const SEQUENCE = [
  'cloud', 'line',
  'cloud', 'bars',
  'cloud', 'curve',
  'cloud', 'colour',
  'cloud', 'map',
];
const NEXT_LABEL = {
  cloud: 'a fitted line',
  line: 'a fresh cloud',
  bars: 'a fresh cloud',
  curve: 'a fresh cloud',
  colour: 'a fresh cloud',
  map: 'a fresh cloud',
};

/* The map needs a field dense enough to draw a coastline, and the strip has
   neither the room nor the dots for it, so the strip's cycle leaves it out. The
   run is otherwise the same, and every shape is still bounded by two clouds. */
const SEQUENCE_FLAT = SEQUENCE.filter((m) => m !== 'map');

const lineY = (x) => 0.82 - 0.62 * x;
const curveY = (x) => 0.16 + 2.6 * (x - 0.5) * (x - 0.5);
const clamp = (v) => Math.max(0.04, Math.min(0.96, v));

/* A rect of the given aspect that fits inside the drawing area, centred, in
   NORMALIZED coordinates. The fit is done in viewBox units and only then
   converted, because a fraction of the width and a fraction of the height are
   not the same distance — computing the aspect in fractions squashes a 2:1 map
   into 8:1. */
function fitRect(W, H, pad, aspect) {
  const uw = W - 2 * pad;
  const uh = H - 2 * pad;
  let w = uw;
  let h = w / aspect;
  if (h > uh) {
    h = uh;
    w = h * aspect;
  }
  return { x: (W - w) / 2 / W, y: (H - h) / 2 / H, w: w / W, h: h / H };
}

/* Candidate seats inside one pie wedge: a grid of angles by radii, then the
   group's dots spread evenly across them, so a wedge fills all the way to both
   of its edges rather than packing from one side. */
function pieSlots(k, a0, a1, R, W, H) {
  const NA = 16;
  const NR = 6;
  const inset = 0.1;
  const slots = [];
  const span = a1 - a0;
  for (let i = 0; i < NA; i += 1) {
    const a = a0 + span * inset + (i / (NA - 1)) * span * (1 - 2 * inset);
    for (let j = 0; j < NR; j += 1) {
      const r = R * (0.4 + (j / (NR - 1)) * 0.6);
      slots.push({
        x: (W / 2 + r * Math.cos(a)) / W,
        y: (H / 2 + r * Math.sin(a)) / H,
      });
    }
  }
  const S = slots.length;
  return Array.from({ length: k }, (_, i) =>
    slots[k === 1 ? 0 : Math.round((i * (S - 1)) / (k - 1))]
  );
}

/* The strip's version: a band per ink, its width set by how many dots belong to
   it, with the dots packed inside like a bar. */
function bandSlots(k, x0, x1, y0, y1, W, H) {
  const bw = (x1 - x0) * W;
  const bh = (y1 - y0) * H;
  const ncols = Math.max(1, Math.round(Math.sqrt((k * bw) / bh)));
  const nrows = Math.ceil(k / ncols);
  return Array.from({ length: k }, (_, i) => {
    const c = i % ncols;
    const r = Math.floor(i / ncols);
    return {
      x: x0 + ((c + 0.5) / ncols) * (x1 - x0),
      y: y0 + ((r + 0.5) / nrows) * (y1 - y0),
    };
  });
}

// normalized (0–1) target for every dot in a given mode
function layout(points, mode, opts) {
  const { bins, flat, W, H, pad } = opts;
  const n = points.length;

  if (mode === 'bars') {
    const counts = new Array(bins).fill(0);
    const placed = points.map((p) => {
      const b = Math.min(bins - 1, Math.floor(p.px * bins));
      const k = counts[b];
      counts[b] += 1;
      return { b, k };
    });
    const tallest = Math.max(...counts);
    const step = Math.min(0.13, 0.86 / tallest);
    return placed.map(({ b, k }) => ({ x: (b + 0.5) / bins, y: 0.95 - (k + 0.5) * step }));
  }

  if (mode === 'map') {
    const rect = fitRect(W, H, pad, MAP_COLS / MAP_ROWS);
    return points.map((p, i) => {
      const cell = LAND[Math.floor(((i + 0.5) * LAND.length) / n) % LAND.length];
      return {
        x: rect.x + ((cell.c + 0.5) / MAP_COLS) * rect.w,
        y: rect.y + ((cell.r + 0.5) / MAP_ROWS) * rect.h,
      };
    });
  }

  if (mode === 'colour') {
    const groups = SORTS.map((s) => points.map((p, i) => (p.sort === s ? i : -1)).filter((i) => i >= 0));
    const out = new Array(n);
    if (flat) {
      // three bands across the strip, each as wide as its share of the field
      let x = 0.03;
      groups.forEach((g) => {
        const k = g.length;
        if (!k) return;
        const bw = (0.94 * k) / n;
        const seats = bandSlots(k, x, x + bw * 0.9, 0.08, 0.92, W, H);
        g.forEach((idx, j) => {
          out[idx] = seats[j];
        });
        x += bw;
      });
    } else {
      // a pie: the field divided into three wedges, dots seated inside them
      const R = 0.86 * (Math.min(W, H) / 2 - pad);
      let a = -Math.PI / 2;
      groups.forEach((g) => {
        const k = g.length;
        if (!k) return;
        const span = (2 * Math.PI * k) / n;
        const seats = pieSlots(k, a, a + span, R, W, H);
        g.forEach((idx, j) => {
          out[idx] = seats[j];
        });
        a += span;
      });
    }
    return out;
  }

  return points.map((p) => {
    if (mode === 'line') return { x: p.px, y: clamp(lineY(p.px) + p.noise * 0.02) };
    if (mode === 'curve') return { x: p.px, y: clamp(curveY(p.px) + p.noise * 0.025) };
    // the random keeps the dot where it landed in the WIDE box, which is the
    // whole point: the frame is not told on until a structured plot comes round
    return { x: p.cx, y: p.cy };
  });
}

function useFlat() {
  const [flat, setFlat] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1080px)');
    setFlat(mq.matches);
    const on = (e) => setFlat(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return flat;
}

export default function Scatter() {
  const flat = useFlat();
  const count = flat ? COUNT.flat : COUNT.wide;
  // the strip's cycle is one shape shorter: no map
  const seq = flat ? SEQUENCE_FLAT : SEQUENCE;
  // the cloud box is memoized on the layout, so the re-cut below fires when the
  // layout changes and not on every render
  const box = useMemo(() => boxOf(flat ? BLEED.flat : BLEED.wide), [flat]);
  const [points, setPoints] = useState(() => freshPoints(COUNT.wide, boxOf(BLEED.wide)));
  const [step, setStep] = useState(0);
  const mode = seq[step % seq.length];

  // The field is re-cut when the layout changes, so the flat strip takes the
  // sparser set AND the tighter box rather than the desktop field squeezed into
  // it — the desktop cloud is allowed to drift past the margin, the strip's is
  // not.
  useEffect(() => {
    setPoints((prev) => (prev.length === count ? prev : freshPoints(count, box)));
  }, [count, box]);

  // the drawing area, with a margin so dots never clip
  const W = flat ? 320 : 200;
  const H = flat ? 80 : 200;
  const pad = flat ? 8 : 12;
  const sx = (x) => pad + x * (W - 2 * pad);
  const sy = (y) => pad + y * (H - 2 * pad);
  /* This is a VIEWBOX scale, so when the box grows the dots grow with it. The
     desktop value is set to hold them at the physical size they had in the
     smaller box, and the count is what grew instead. It also lands the largest
     dots at very nearly one raster cell, which is what lets the map read as a
     dotted map rather than a solid blob. */
  const dotScale = flat ? 2.6 : 2.5;
  const targets = layout(points, mode, { bins: flat ? 11 : 7, flat, W, H, pad });

  const advance = () => {
    const next = (step + 1) % seq.length;
    // arriving at a random draws the data fresh; every structured plot then
    // works on whatever cloud is currently printed
    if (seq[next] === 'cloud') setPoints((prev) => replot(prev, box));
    setStep(next);
  };

  // Every claim stamped into "Raj can ___" re-plots the sketch once, as if
  // it had been pressed. The ref keeps the listener on the current step.
  const advanceRef = useRef(advance);
  advanceRef.current = advance;
  useEffect(() => {
    const onStamp = () => advanceRef.current();
    window.addEventListener('picker:stamp', onStamp);
    return () => window.removeEventListener('picker:stamp', onStamp);
  }, []);

  const curvePath = (() => {
    let d = '';
    for (let i = 0; i <= 40; i += 1) {
      const x = 0.03 + (i / 40) * 0.94;
      d += `${i ? 'L' : 'M'}${sx(x).toFixed(1)} ${sy(curveY(x)).toFixed(1)} `;
    }
    return d;
  })();

  return (
    <button
      type="button"
      className={`scatter scatter--${mode}${flat ? ' scatter--flat' : ''}`}
      aria-label={`A little printed data sketch. Press to re-plot it as ${NEXT_LABEL[mode]}.`}
      onClick={advance}
    >
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
        <defs>
          <filter id="scatter-rough" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="5" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g filter="url(#scatter-rough)">
          {/* one group per dot, so each prints its own pair of inks rather than
              the whole field being locked to two plates */}
          <g className="scatter__dots">
            {points.map((p, i) => (
              <g
                key={i}
                className="scatter__dotgroup"
                style={{
                  transform: `translate(${sx(targets[i].x).toFixed(2)}px, ${sy(targets[i].y).toFixed(2)}px)`,
                  transitionDelay: `${p.delay}ms`,
                }}
              >
                <circle className={`scatter__dot scatter__dot--${p.inks[0]}`} r={(p.r * dotScale).toFixed(2)} />
                <circle className={`scatter__dot scatter__dot--${p.inks[1]}`} r={(p.r * dotScale).toFixed(2)} />
              </g>
            ))}
          </g>
          {/* the key-ink guides, each drawn in when its shape arrives */}
          <line
            className="scatter__guide scatter__guide--line"
            x1={sx(0.03)}
            y1={sy(lineY(0.03))}
            x2={sx(0.97)}
            y2={sy(lineY(0.97))}
          />
          <line
            className="scatter__guide scatter__guide--bars"
            x1={sx(0)}
            y1={sy(0.97)}
            x2={sx(1)}
            y2={sy(0.97)}
          />
          <path className="scatter__guide scatter__guide--curve" d={curvePath} />
        </g>
      </svg>
    </button>
  );
}
