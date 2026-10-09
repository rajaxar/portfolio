import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import tone from '../../assets/tone.png';

/**
 * The brayer: a little ink roller resting at the foot of the sheet.
 *
 * Pick it up and roll it across the page: it lays a band of ink along its
 * path, speckled through the same tone plate as everything else and wavered
 * at the edges, and the band slowly lifts away. Each pass takes the next ink
 * on the drum — pink, blue, yellow, green. Put it down and it stays where you
 * left it; pick it up from there next time. Carry it to the top or bottom
 * edge of the window and the page scrolls, laying ink as it goes.
 *
 * Desktop only: on a touch screen a roller fights the scroll, and the sheet
 * already has stamps to drag. The live stroke is written straight into an
 * SVG polyline via a ref, never through React state, so rolling costs no
 * re-renders.
 */

// The build bakes each page's HTML (scripts/prerender.js), and that snapshot
// includes this component's <body> portal. The app renders fresh rather than
// hydrating, so the baked copy would linger — and its empty 0×0 #roller-mask,
// first in the document, would win the id lookup and mask every stroke out.
// Clear it before React mounts the live one.
if (typeof document !== 'undefined') {
  document.querySelectorAll('body > .roller-layer, body > .roller--loose').forEach((n) => n.remove());
}

const THRESHOLD = 4;
const MAX_STROKES = 4;
const INKS = ['pink', 'blue', 'yellow', 'green'];
const EDGE = 70; // px from the window edge where carrying starts to scroll
const MAX_SCROLL = 18; // px per frame at the very edge

export default function Roller() {
  const [mounted, setMounted] = useState(false);
  const [carrying, setCarrying] = useState(false);
  const [pos, setPos] = useState(null); // null: docked by the links; else page coords where it was put down
  const [strokes, setStrokes] = useState([]);
  const [layer, setLayer] = useState({ w: 0, h: 0 });
  const [ink, setInk] = useState(0);

  const looseRef = useRef(null);
  const liveRef = useRef(null);
  const ptsRef = useRef([]);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pressRef = useRef(null); // { x, y } while the button is down, before pickup
  const carryingRef = useRef(false);
  const rafRef = useRef(0);
  const keyRef = useRef(0);
  const inkRef = useRef(0);
  const swallowClickRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.body.classList.remove('is-roller-carrying');
    };
  }, []);

  const place = (x, y) => {
    if (looseRef.current) looseRef.current.style.transform = `translate3d(${x - 36}px, ${y - 14}px, 0) rotate(-8deg)`;
  };

  const addPoint = () => {
    const px = pointerRef.current.x + window.scrollX;
    const py = pointerRef.current.y + window.scrollY;
    const pts = ptsRef.current;
    const last = pts[pts.length - 1];
    if (last && Math.hypot(px - last[0], py - last[1]) < 4) return;
    pts.push([px, py]);
    if (liveRef.current) liveRef.current.setAttribute('points', pts.map((p) => p.join(',')).join(' '));
  };

  // While carried, near the top or bottom edge of the window, scroll the page
  // — the roller keeps rolling as the sheet moves under it. (Following the
  // pointer and laying ink happen in the move handler itself, so they never
  // wait on a frame.)
  const loop = () => {
    const { y } = pointerRef.current;
    let dy = 0;
    if (y < EDGE) dy = -MAX_SCROLL * Math.min(1, (EDGE - y) / EDGE);
    else if (y > window.innerHeight - EDGE) dy = MAX_SCROLL * Math.min(1, (y - (window.innerHeight - EDGE)) / EDGE);
    if (dy) {
      window.scrollBy(0, dy);
      addPoint();
    }
    rafRef.current = requestAnimationFrame(loop);
  };

  const pickUp = () => {
    carryingRef.current = true;
    swallowClickRef.current = true;
    const doc = document.documentElement;
    setLayer({ w: doc.scrollWidth, h: doc.scrollHeight });
    ptsRef.current = [];
    if (liveRef.current) liveRef.current.setAttribute('points', '');
    setCarrying(true);
    document.body.classList.add('is-roller-carrying');
    place(pointerRef.current.x, pointerRef.current.y);
    addPoint();
    rafRef.current = requestAnimationFrame(loop);
  };

  const putDown = () => {
    cancelAnimationFrame(rafRef.current);
    carryingRef.current = false;
    document.body.classList.remove('is-roller-carrying');
    const pts = ptsRef.current;
    if (pts.length > 1) {
      const key = keyRef.current++;
      const points = pts.map((p) => p.join(',')).join(' ');
      const strokeInk = INKS[inkRef.current % INKS.length];
      setStrokes((list) => [...list, { key, points, ink: strokeInk }].slice(-MAX_STROKES));
      inkRef.current += 1;
      setInk(inkRef.current);
    }
    ptsRef.current = [];
    if (liveRef.current) liveRef.current.setAttribute('points', '');
    // it stays where it was put down
    setPos({ x: pointerRef.current.x + window.scrollX, y: pointerRef.current.y + window.scrollY });
    setCarrying(false);
  };

  // Page-level tracking for the whole gesture, so the roller can't lose the
  // pointer as it moves between its docked and loose homes.
  const onPointerDown = (e) => {
    if (e.pointerType === 'touch' || carryingRef.current) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault(); // no text selection while rolling
    swallowClickRef.current = false;
    pointerRef.current = { x: e.clientX, y: e.clientY };
    pressRef.current = { x: e.clientX, y: e.clientY };
    const move = (ev) => {
      pointerRef.current = { x: ev.clientX, y: ev.clientY };
      const p = pressRef.current;
      if (!carryingRef.current && p && Math.hypot(ev.clientX - p.x, ev.clientY - p.y) > THRESHOLD) pickUp();
      if (carryingRef.current) {
        place(ev.clientX, ev.clientY);
        addPoint();
      }
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      window.removeEventListener('blur', up);
      pressRef.current = null;
      if (carryingRef.current) putDown();
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    window.addEventListener('blur', up);
  };

  const onClick = (e) => {
    if (swallowClickRef.current) {
      swallowClickRef.current = false;
      return;
    }
    // a plain click: the drum turns over in place — "pick me up"
    const el = e.currentTarget;
    el.classList.remove('is-nudged');
    // eslint-disable-next-line no-unused-expressions
    el.offsetWidth;
    el.classList.add('is-nudged');
    window.setTimeout(() => el.classList.remove('is-nudged'), 520);
  };

  const removeStroke = (key) => (e) => {
    if (e.animationName !== 'roller-stroke-fade') return;
    setStrokes((list) => list.filter((s) => s.key !== key));
  };

  const nextInk = INKS[ink % INKS.length];

  const art = (
    <svg viewBox="0 0 64 52" aria-hidden="true" focusable="false">
      <g className="roller__art">
        {/* the drum, inked with whatever it will lay down next */}
        <rect className={`roller__drum roller__drum--${nextInk}`} x="5" y="3" width="54" height="20" />
        <g className="roller__ribs">
          <line x1="16" y1="3" x2="16" y2="23" />
          <line x1="30" y1="3" x2="30" y2="23" />
          <line x1="44" y1="3" x2="44" y2="23" />
        </g>
        <rect className="roller__drum-key" x="5" y="3" width="54" height="20" />
        <path className="roller__frame" d="M5 13 H2 V31 H32 V38" />
        <rect className="roller__handle" x="27" y="37" width="10" height="14" />
      </g>
    </svg>
  );

  const buttonProps = {
    type: 'button',
    'aria-label': 'Ink roller — drag it across the page',
    onPointerDown,
    onClick,
  };

  const loose = carrying || pos;

  const floating = (
    <>
      <svg
        className="roller-layer"
        width={layer.w}
        height={layer.h}
        style={{ width: layer.w, height: layer.h }}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <pattern id="roller-tone" patternUnits="userSpaceOnUse" width="260" height="260">
            <image href={tone} width="260" height="260" />
          </pattern>
          <mask id="roller-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={layer.w} height={layer.h} style={{ maskType: 'alpha' }}>
            <rect x="0" y="0" width={layer.w} height={layer.h} fill="url(#roller-tone)" />
          </mask>
          <filter id="roller-rough" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="8" result="rn" />
            <feDisplacementMap in="SourceGraphic" in2="rn" scale="7" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g mask="url(#roller-mask)">
          {strokes.map((s) => (
            <polyline
              key={s.key}
              className={`roller-stroke roller-stroke--${s.ink}`}
              points={s.points}
              onAnimationEnd={removeStroke(s.key)}
            />
          ))}
          <polyline ref={liveRef} className={`roller-stroke roller-stroke--live roller-stroke--${nextInk}`} points="" />
        </g>
      </svg>

      {loose && (
        <button
          {...buttonProps}
          ref={looseRef}
          className={`roller roller--loose${carrying ? ' is-carried' : ''}`}
          style={
            carrying
              ? {
                  // seeded at render so it never flashes at the corner before
                  // the carry loop takes over positioning
                  transform: `translate3d(${pointerRef.current.x - 36}px, ${pointerRef.current.y - 14}px, 0) rotate(-8deg)`,
                }
              : { position: 'absolute', left: pos.x - 36, top: pos.y - 14, transform: 'rotate(-8deg)' }
          }
        >
          {art}
        </button>
      )}
    </>
  );

  return (
    <>
      {/* docked by the links until it's first picked up; it keeps its place
          in the row so the links don't shift */}
      <button {...buttonProps} className={`roller roller--docked${loose ? ' is-away' : ''}`} tabIndex={loose ? -1 : 0}>
        {art}
      </button>
      {mounted && createPortal(floating, document.body)}
    </>
  );
}
