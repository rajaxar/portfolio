import React from 'react';
import { useOrbit } from './Marks';

/**
 * The masthead's companion: a block of printed ink where the sheet used to run
 * empty. It is not decoration dropped into a void — it is the same press,
 * speaking the same vocabulary as the wordmark beside it. Overlapping ink discs,
 * pink and blue, each multiplied so where they cross they overprint into a third
 * colour the way two riso drums do on one pass. A key-black ring sits slightly
 * out of register, and the edges bleed through the same displacement the name
 * uses, so the art reads as ink laid on paper rather than vector fill.
 *
 * The motif is the colour test a printer pulls to check registration before a
 * run — the most honest image a two-drum press can make of itself. It carries
 * the page's discipline too: two inks and the key, no third hue, so it amplifies
 * the world instead of turning it into a rainbow.
 *
 * Hovering runs the test: the two drums orbit the ring, slowly, and separate a
 * little as they go. Let go and they collapse back in, keeping the angle they
 * reached — the press stopped mid-pull, not reset. The ring holds still, so the
 * spread always reads against a fixed register. The orbit is the SAME device as
 * the record's key mark (Marks.js), not a second motion bolted on here.
 *
 * Decorative: the masthead is already named to assistive tech by the h1.
 */
function MastheadArt() {
  const { orbitRef, spinning, orbitProps } = useOrbit(24, 202, 200);

  return (
    <svg
      className={`masthead__art-svg${spinning ? ' is-spinning' : ''}`}
      viewBox="0 0 400 400"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      {...orbitProps}
    >
      <defs>
        {/* Ink spread: the same device the wordmark uses, so the discs belong to
            the same impression. Edges are displaced, then softened a hair. */}
        <filter id="art-bleed" x="-14%" y="-14%" width="128%" height="128%">
          <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" seed="23" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4.2" xChannelSelector="R" yChannelSelector="G" result="edge" />
          <feGaussianBlur in="edge" stdDeviation="0.5" />
        </filter>
        {/* A long-wavelength displacement so the registration ring reads as a
            hand-pulled printed line — uneven weight, never a perfect circle. */}
        <filter id="ring-rough" x="-18%" y="-18%" width="136%" height="136%">
          <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="2" seed="9" result="rn" />
          <feDisplacementMap in="SourceGraphic" in2="rn" scale="8" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* The disc is ink at a density, not a lit sphere: the mask is nearly
            uniform so the ink reads flat, the way a riso drum lays it, with only
            the last few percent at the rim letting paper through so the edge is a
            printed edge rather than a cut vector one. */}
        <radialGradient id="art-ink" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="82%" stopColor="#fff" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.62" />
        </radialGradient>
        <mask id="art-disc-mask">
          <circle cx="200" cy="200" r="150" fill="url(#art-ink)" />
        </mask>
      </defs>

      {/* The two drums ride one group so the orbit turns them together, about
          the ring's own centre. Their separation on hover stays on the inner
          groups, so the pull and the turn never fight over one transform. */}
      <g ref={orbitRef}>
        {/* blue drum, pulled up-left — larger now, so it fills most of the ring */}
        <g className="ink ink--blue" filter="url(#art-bleed)">
          <circle cx="184" cy="190" r="146" fill="var(--blue)" mask="url(#art-disc-mask)" />
        </g>
        {/* pink drum, pulled down-right — the overlap overprints to a deep magenta */}
        <g className="ink ink--pink" filter="url(#art-bleed)">
          <circle cx="220" cy="212" r="146" fill="var(--pink)" mask="url(#art-disc-mask)" />
        </g>
      </g>
      {/* the key: a registration ring, a hair out of true — never orbits */}
      <g className="ink ink--key">
        <ellipse cx="202" cy="200" rx="151" ry="146" transform="rotate(-2.5 202 200)" fill="none" stroke="var(--ink)" strokeWidth="2.4" opacity="0.7" filter="url(#ring-rough)" />
      </g>
    </svg>
  );
}

export default MastheadArt;
