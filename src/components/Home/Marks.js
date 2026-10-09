import React, { useEffect, useRef, useState } from 'react';

/**
 * The record's marks — a family, not a row of the same disc.
 *
 * The masthead's ink block is the world's own icon: two drums crossing into a
 * third colour inside a registration ring. The instinct to put THAT object
 * everywhere is the wrong read of it — the motif is the press describing its
 * own method, and a method stated four times is a logo, not a language.
 *
 * So this file takes the discs as INSPO, not as a stamp. Each competency gets
 * its own mark drawn in the same vocabulary and a different geometry: lineart
 * strokes laid in the two drums' inks plus the key, multiplied so where the two
 * impressions cross they overprint the way ink does, each wavered by the same
 * hand-pulled displacement the sheet uses everywhere else. Four unique marks,
 * one grammar:
 *
 *   science  the curve    a distribution's arc, pink and blue crossed at the peak
 *   ml       the net      nodes and edges, the joins overprinting their nodes
 *   viz      the run      columns of unequal height, each a misregistered pair
 *   civic    the rings    overlapping ballots, crossing into violet
 *   key      the test     the registration discs themselves — used ONCE, at the
 *                         head of the record, as the section's own device and
 *                         the "show everything" reset. This is the only place
 *                         the discs appear, which is what keeps the four above
 *                         from reading as recoloured copies of it.
 */

/* Marks are small, so their waver is shorter-wavelength and smaller-amplitude
   than the field frames': at 30px a 4px displacement would eat the geometry. */
export function MarkDefs() {
  return (
    <svg className="mark-defs" aria-hidden="true" focusable="false" width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <filter id="mark-rough" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.09" numOctaves="2" seed="11" result="m" />
          <feDisplacementMap in="SourceGraphic" in2="m" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

const GEOMETRY = {
  /* PLACEHOLDER — the fifth discipline the earlier pass flagged (AI engineering,
     split out of ML) has no real mark yet; this is a stand-in spark/node motif
     so the E/F mockups don't render an empty box, not a design decision. */
  ai: (
    <>
      <path className="mi mi--pink" d="M20 5V35M6 20H34M11 11L29 29M29 11L11 29" />
      <path className="mi mi--blue" d="M20 5V35M6 20H34M11 11L29 29M29 11L11 29" />
      <circle className="mi mi--key" cx="20" cy="20" r="2.6" />
    </>
  ),
  science: (
    <>
      <path className="mi mi--pink" d="M5 32C11 32 12 8 20 8 28 8 29 32 35 32" />
      <path className="mi mi--blue" d="M5 32C11 32 12 8 20 8 28 8 29 32 35 32" />
      <path className="mi mi--key" d="M4 32H36" />
    </>
  ),
  ml: (
    <>
      <g className="mi mi--blue">
        <line x1="10" y1="30" x2="20" y2="10" />
        <line x1="20" y1="10" x2="30" y2="30" />
        <line x1="10" y1="30" x2="30" y2="30" />
      </g>
      <g className="mi mi--pink">
        <circle cx="10" cy="30" r="4" />
        <circle cx="20" cy="10" r="4" />
        <circle cx="30" cy="30" r="4" />
      </g>
      <circle className="mi mi--key" cx="20" cy="10" r="4" />
    </>
  ),
  viz: (
    <>
      <g className="mi mi--pink">
        <line x1="9" y1="33" x2="9" y2="15" />
        <line x1="16" y1="33" x2="16" y2="7" />
        <line x1="23" y1="33" x2="23" y2="19" />
        <line x1="30" y1="33" x2="30" y2="11" />
      </g>
      <g className="mi mi--blue">
        <line x1="9" y1="33" x2="9" y2="15" />
        <line x1="16" y1="33" x2="16" y2="7" />
        <line x1="23" y1="33" x2="23" y2="19" />
        <line x1="30" y1="33" x2="30" y2="11" />
      </g>
      <line className="mi mi--key" x1="5" y1="33" x2="35" y2="33" />
    </>
  ),
  civic: (
    <>
      <circle className="mi mi--pink" cx="17" cy="20" r="11" />
      <circle className="mi mi--blue" cx="24" cy="21" r="11" />
      <circle className="mi mi--key" cx="20.5" cy="13" r="11" />
    </>
  ),
};

/** One competency's mark. Two inks and the key, multiplied, hand-pulled. */
export function CompetencyMark({ facet, className = '' }) {
  return (
    <svg
      className={`mark mark--${facet} ${className}`}
      viewBox="0 0 40 40"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <g className="mark__ink" filter="url(#mark-rough)">
        {GEOMETRY[facet]}
      </g>
    </svg>
  );
}

/**
 * The one motion these marks own: the drums orbit the ring.
 *
 * Hover and they turn, slowly. Leave and the angle is KEPT, so they stay where
 * you left them; a fresh visit starts at rest, and no persistence is claimed.
 *
 * The rotation is written straight onto the group's `transform` inside a rAF
 * loop with the angle in a ref, so the browser composites one transform per
 * frame and React re-renders ZERO times while it turns. That part matters: a
 * state-driven version re-renders the whole subtree sixty times a second, which
 * is how this kind of thing ends up janky. The paused state is not stored
 * anywhere either — the angle simply stops advancing — so there is no timer to
 * leak and nothing to clean up but the frame that is already in flight.
 *
 * One hook drives both discs on the sheet: the record's key mark and the
 * masthead's ink block. It is one device in two places, not two motions.
 */
export function useOrbit(rate, cx, cy) {
  const orbitRef = useRef(null);
  const angle = useRef(0);
  const vel = useRef(0); // current angular speed, °/s
  const target = useRef(0); // where the speed is heading
  const raf = useRef(0);
  const last = useRef(0);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const tick = (t) => {
    if (!last.current) last.current = t;
    // Clamped: a backgrounded tab hands back one enormous dt on return, and an
    // unclamped one would jump the drums most of the way round in a single step.
    const dt = Math.min(0.05, (t - last.current) / 1000);
    last.current = t;
    // The press SPINS UP and COASTS DOWN rather than switching on at a
    // threshold: the speed eases toward its target, so both the start and the
    // stop are graded instead of snapping. Coasting down takes about twice as
    // long as spinning up, which is what makes the return read slower than the
    // arrival. `tau` is the time constant of that ease, in seconds.
    const tau = target.current > vel.current ? 0.22 : 0.45;
    vel.current += (target.current - vel.current) * (dt / tau);
    angle.current = (angle.current + vel.current * dt) % 360;
    if (orbitRef.current) {
      orbitRef.current.setAttribute('transform', `rotate(${angle.current.toFixed(2)} ${cx} ${cy})`);
    }
    // Once it has coasted to a stop there is nothing left to animate.
    if (target.current === 0 && Math.abs(vel.current) < 0.08) {
      vel.current = 0;
      raf.current = 0;
      return;
    }
    raf.current = requestAnimationFrame(tick);
  };

  const run = () => {
    if (!raf.current) {
      last.current = 0;
      raf.current = requestAnimationFrame(tick);
    }
  };

  const start = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setSpinning(true);
    target.current = rate;
    run();
  };

  const stop = () => {
    // The drums begin collapsing at once, but the orbit does NOT stop dead: it
    // keeps turning and eases down, and the angle is never reset — the press
    // stopped mid-pull rather than being wound back.
    setSpinning(false);
    target.current = 0;
    run();
  };

  return {
    orbitRef,
    spinning,
    orbitProps: { onMouseEnter: start, onMouseLeave: stop, onFocus: start, onBlur: stop },
  };
}

/** The registration test — the discs. Hover and they orbit the ring. */
export function KeyMark({ className = '' }) {
  const { orbitRef, spinning, orbitProps } = useOrbit(24, 20, 20);

  return (
    <svg
      className={`mark mark--keyart${spinning ? ' is-spinning' : ''} ${className}`}
      viewBox="0 0 40 40"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      {...orbitProps}
    >
      <g className="mark__ink" filter="url(#mark-rough)">
        <g ref={orbitRef}>
          <g className="drum drum--blue">
            <circle cx="18" cy="19" r="12" />
          </g>
          <g className="drum drum--pink">
            <circle cx="23" cy="22" r="12" />
          </g>
        </g>
        <ellipse
          className="drum__ring"
          cx="20.5"
          cy="20"
          rx="13"
          ry="12.6"
          transform="rotate(-2.5 20.5 20)"
        />
      </g>
    </svg>
  );
}
