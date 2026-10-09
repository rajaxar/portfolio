import React from 'react';

/**
 * The masthead: one line of type printed as three separate ink plates.
 *
 * Each plate is toned by its own scatter screen, and the tones still relate the
 * way they did when they were lattices: the key plate shows ~68% ink, pink
 * ~66%, blue ~39%. That hierarchy is what keeps the key dominant and lets the
 * pink and blue read through it. What changed is the screen itself — the angled
 * dot grids are gone. A lattice only exists to stop three plates moiréing, so
 * with a scatter the angles had no job left; unequal specks read as grain
 * rather than as halftone dots. The specks are wrapped across the tile edge so
 * the repeat stays seamless.
 *
 * The key plate sits at .86 opacity, so the pink and blue read through its gaps
 * instead of being covered by a solid block.
 *
 * The type is live SVG text: selectable, searchable, and named once to assistive
 * technology by the h1 in the parent. The edges are displaced by feTurbulence,
 * which is ink spread — not a blur, and deliberately not a drop shadow.
 */
function Masthead() {
  /* Mixed case, not caps: Bricolage Extra Bold's whimsy — the ink-trap notches,
     the slight irregularity in its curves — lives in the lowercase, and caps
     flattened it into a generic poster shout. The viewBox and screen rects
     below are sized for the caps-only glyph run and are wider than mixed case
     needs, which is fine — the text starts flush left regardless. */
  const label = 'Raj Shah';

  return (
    <svg className="masthead__plate" viewBox="-14 -6 1010 292" aria-hidden="true" focusable="false">
      <defs>
        {/* Scatter screens, not lattices. Coverage is unchanged from the dot
            grids they replace (a 39%, b 66%, c 68% of the plate shows ink) and
            so is the tile pitch; only the regularity is gone. */}
        <pattern id="riso-screen-a" width="8" height="8" patternUnits="userSpaceOnUse">
          <g fill="#fff">
            <circle cx="4.48" cy="-0.61" r="1.31" /><circle cx="4.48" cy="7.39" r="1.31" />
            <circle cx="4.06" cy="4.7" r="1.32" /><circle cx="0.75" cy="2.43" r="1.58" />
            <circle cx="8.75" cy="2.43" r="1.58" /><circle cx="6.48" cy="5.55" r="1.02" />
            <circle cx="-0.14" cy="-0.28" r="0.98" /><circle cx="-0.14" cy="7.72" r="0.98" />
            <circle cx="7.86" cy="-0.28" r="0.98" /><circle cx="7.86" cy="7.72" r="0.98" />
          </g>
        </pattern>
        <pattern id="riso-screen-b" width="14" height="14" patternUnits="userSpaceOnUse">
          <g fill="#fff">
            <circle cx="-0.72" cy="-1.51" r="2.66" /><circle cx="-0.72" cy="12.49" r="2.66" />
            <circle cx="13.28" cy="-1.51" r="2.66" /><circle cx="13.28" cy="12.49" r="2.66" />
            <circle cx="8.29" cy="5.93" r="1.65" /><circle cx="1.82" cy="2.69" r="2.19" />
            <circle cx="15.82" cy="2.69" r="2.19" /><circle cx="3.09" cy="6.37" r="2.08" />
            <circle cx="1.2" cy="9.94" r="1.58" /><circle cx="15.2" cy="9.94" r="1.58" />
            <circle cx="7.18" cy="10.28" r="2.06" /><circle cx="9.21" cy="8.69" r="2.26" />
            <circle cx="11.42" cy="2.74" r="1.94" /><circle cx="1.38" cy="0.55" r="1.69" />
            <circle cx="1.38" cy="14.55" r="1.69" /><circle cx="15.38" cy="0.55" r="1.69" />
            <circle cx="15.38" cy="14.55" r="1.69" /><circle cx="5.18" cy="4.04" r="1.95" />
          </g>
        </pattern>
        <pattern id="riso-screen-c" width="10" height="10" patternUnits="userSpaceOnUse">
          <g fill="#fff">
            <circle cx="1.12" cy="3.93" r="1.16" /><circle cx="11.12" cy="3.93" r="1.16" />
            <circle cx="1.39" cy="1.12" r="1.77" /><circle cx="1.39" cy="11.12" r="1.77" />
            <circle cx="11.39" cy="1.12" r="1.77" /><circle cx="11.39" cy="11.12" r="1.77" />
            <circle cx="7.58" cy="1.47" r="1.36" /><circle cx="4.48" cy="4.13" r="1.63" />
            <circle cx="4.03" cy="1.98" r="2.0" /><circle cx="4.03" cy="11.98" r="2.0" />
            <circle cx="3.65" cy="-0.45" r="1.45" /><circle cx="3.65" cy="9.55" r="1.45" />
            <circle cx="2.17" cy="5.85" r="1.34" /><circle cx="-0.46" cy="-1.61" r="1.64" />
            <circle cx="-0.46" cy="8.39" r="1.64" /><circle cx="9.54" cy="-1.61" r="1.64" />
            <circle cx="9.54" cy="8.39" r="1.64" /><circle cx="2.04" cy="8.36" r="1.47" />
          </g>
        </pattern>
        <mask id="riso-mask-a">
          <rect x="-60" y="-60" width="1140" height="420" fill="url(#riso-screen-a)" filter="url(#riso-soften)" />
        </mask>
        <mask id="riso-mask-b">
          <rect x="-60" y="-60" width="1140" height="420" fill="url(#riso-screen-b)" filter="url(#riso-soften)" />
        </mask>
        <mask id="riso-mask-c">
          <rect x="-60" y="-60" width="1140" height="420" fill="url(#riso-screen-c)" filter="url(#riso-soften)" />
        </mask>
        {/* The screens are scatter, so the specks need an edge that isn't a cut
            circle: a sub-pixel blur turns each one into a soft blob and lets
            overlapping specks merge, which is what makes the plate read as
            grain rather than as dots. */}
        <filter id="riso-soften" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.0" />
        </filter>
        <filter id="riso-bleed" x="-14%" y="-14%" width="128%" height="128%">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" seed="17" result="noise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="3.6"
            xChannelSelector="R"
            yChannelSelector="G"
            result="edge"
          />
          <feGaussianBlur in="edge" stdDeviation="0.5" />
        </filter>
      </defs>

      <g className="ink ink--pink" filter="url(#riso-bleed)">
        <text x="0" y="210" fontSize="210" letterSpacing="-3" fill="var(--pink)">
          {label}
        </text>
      </g>
      <g className="ink ink--blue" filter="url(#riso-bleed)">
        <text x="0" y="210" fontSize="210" letterSpacing="-3" fill="var(--blue)">
          {label}
        </text>
      </g>
      <g className="ink ink--key" filter="url(#riso-bleed)">
        <text x="0" y="210" fontSize="210" letterSpacing="-3" fill="var(--ink)">
          {label}
        </text>
      </g>
    </svg>
  );
}

export default Masthead;
