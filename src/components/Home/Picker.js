import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { chips } from '../../data/picker';

/**
 * The picker: "Raj can ___", stamped into being.
 *
 * Pick a chip up off the tray and carry it. It's held at its own angle,
 * wobbling about its centre and leaning into the direction of travel. Let go
 * inside the "Raj can ___" rectangle and it fills the blank and prints that
 * claim's proof underneath. Let go anywhere else and it leaves a real
 * impression on the page instead — the phrase in ink at exactly the angle it
 * was held at, wavered and speckled like a rubber stamp — and the sentence is
 * left alone. Impressions hold for a while, then fade; at most
 * MAX_IMPRESSIONS stay on the sheet, oldest lifting first.
 *
 * A plain click doesn't stamp — it jiggles the chip in place, the hint that
 * it can be picked up. Keyboard activation (Enter/Space) stamps directly, so
 * the claim and its proof stay reachable without a pointer. Under
 * prefers-reduced-motion there is no drag, jiggle or fade: a click stamps
 * straight into the sentence.
 *
 * Continuous motion (the ghost following the pointer) is written straight
 * onto a ref's style in a rAF loop — React never re-renders on a move. The
 * floating layers (ghost, impressions, ink burst) are portalled to <body> so
 * no ancestor's transform or filter can re-anchor them.
 */

const DRAG_THRESHOLD = 6; // px of movement before a mouse press counts as a drag
const HOLD_MS = 260; // touch: how long to hold before the stamp lifts
const TOUCH_SLOP = 10; // touch: movement before the hold lands means "scroll"
const SPRING_BACK_MS = 420;
const IMPACT_MS = 280;
const PRESS_INK_MS = 320;
const JIGGLE_MS = 460;
const MAX_IMPRESSIONS = 8;
const INKS = ['blue', 'pink', 'key', 'yellow', 'green'];

export default function Picker() {
  const [activeId, setActiveId] = useState(null);
  const [stampCount, setStampCount] = useState(0); // re-keys the clause so each stamp presses in
  const [dragId, setDragId] = useState(null);
  const [impressions, setImpressions] = useState([]);
  const [reduced, setReduced] = useState(false);
  const [mounted, setMounted] = useState(false);

  const ghostRef = useRef(null);
  const sentenceRef = useRef(null);
  const impactRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const dragStartTimeRef = useRef(0);
  const startRef = useRef({ x: 0, y: 0, width: 0, height: 0, chipId: null, downX: 0, downY: 0 });
  const dragStartedRef = useRef(false);
  const didDragRef = useRef(false); // swallows the click that follows a real drag
  const rafRef = useRef(0);
  const springTimerRef = useRef(0);
  const impressionIdRef = useRef(0);
  const baseRotRef = useRef(0); // the angle this stamp is held at, picked at pickup
  const leanRef = useRef(0); // smoothed lean into the direction of travel
  const lastXRef = useRef(0);
  const rotRef = useRef(0); // the angle actually on screen — the impression lands at it
  const globalRef = useRef(null); // page-level safety-net listeners, live only mid-drag
  const carriedRef = useRef(false); // button came up but we never saw the release
  const holdTimerRef = useRef(0);
  const touchRef = useRef(false);

  // Once a stamp is lifted on touch, the page must not scroll under the
  // finger. React's touch listeners are passive, so this is a native one.
  useEffect(() => {
    const block = (e) => {
      if (dragStartedRef.current) e.preventDefault();
    };
    document.addEventListener('touchmove', block, { passive: false });
    return () => {
      document.removeEventListener('touchmove', block);
      window.clearTimeout(holdTimerRef.current);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => {
      mq.removeEventListener('change', onChange);
      cancelAnimationFrame(rafRef.current);
      window.clearTimeout(springTimerRef.current);
      document.body.classList.remove('is-picker-dragging');
      detachGlobal();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The safety net. If the page lags, the pointer leaves the window, or the
  // browser drops pointer capture, the chip can miss its own release and the
  // stamp would be stuck in hand. These page-level listeners keep the stamp
  // following the cursor, catch a release the chip didn't see, and if the
  // button is already up, let the very next click put the stamp down (that
  // click is swallowed so it can't also follow a link underneath). Escape
  // puts the stamp back on the tray.
  const detachGlobal = () => {
    const g = globalRef.current;
    if (!g) return;
    window.removeEventListener('pointermove', g.onMove, true);
    window.removeEventListener('pointerup', g.onUp);
    window.removeEventListener('pointerdown', g.onDown, true);
    window.removeEventListener('keydown', g.onKey);
    globalRef.current = null;
    carriedRef.current = false;
  };

  const swallowNextClick = () => {
    const swallow = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener('click', swallow, { capture: true, once: true });
    window.setTimeout(() => window.removeEventListener('click', swallow, true), 600);
  };

  const attachGlobal = () => {
    detachGlobal();
    const onMove = (e) => {
      if (!dragStartedRef.current) return;
      pointerRef.current = { x: e.clientX, y: e.clientY };
      if (e.pointerType !== 'touch' && e.buttons === 0) carriedRef.current = true;
    };
    const onUp = (e) => {
      if (!dragStartedRef.current || carriedRef.current) return;
      didDragRef.current = true;
      dropStamp(e);
    };
    const onDown = (e) => {
      if (!dragStartedRef.current) return;
      // a stamp still in hand with no button held: this click puts it down
      e.preventDefault();
      e.stopPropagation();
      swallowNextClick();
      dropStamp(e);
    };
    const onKey = (e) => {
      if (e.key === 'Escape' && dragStartedRef.current) cancelDrag();
    };
    window.addEventListener('pointermove', onMove, true);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointerdown', onDown, true);
    window.addEventListener('keydown', onKey);
    globalRef.current = { onMove, onUp, onDown, onKey };
  };

  const stamp = (id) => {
    setActiveId(id);
    setStampCount((n) => n + 1);
  };

  const leaveImpression = (chip, pageX, pageY, rot) => {
    const n = impressionIdRef.current++;
    const impression = {
      key: n,
      label: chip.label,
      x: pageX,
      y: pageY,
      rot: rot.toFixed(2), // lands at exactly the angle it was held at
      ink: INKS[n % INKS.length],
    };
    setImpressions((list) => [...list, impression].slice(-MAX_IMPRESSIONS));
  };

  const removeImpression = (key) => (e) => {
    if (e.animationName !== 'picker-impression-fade') return;
    setImpressions((list) => list.filter((i) => i.key !== key));
  };

  const positionGhost = (clientX, clientY, elapsed = 0) => {
    if (!ghostRef.current) return;
    const { width, height } = startRef.current;
    // Held in the hand: the stamp keeps the angle it was picked up at,
    // wobbles symmetrically about its own centre (two sine waves at different
    // rates, so it's a wriggle, not a metronome), and leans into the
    // direction it's being carried.
    const wobble = elapsed ? Math.sin(elapsed * 0.008) * 1.4 + Math.sin(elapsed * 0.019 + 0.7) * 0.6 : 0;
    const rot = baseRotRef.current + wobble + leanRef.current;
    rotRef.current = rot;
    ghostRef.current.style.transform = `translate3d(${clientX - width / 2}px, ${clientY - height / 2}px, 0) rotate(${rot}deg) scale(1.04)`;
  };

  const overSentence = (x, y) => {
    if (!sentenceRef.current) return false;
    const r = sentenceRef.current.getBoundingClientRect();
    return x >= r.left - 8 && x <= r.right + 8 && y >= r.top - 8 && y <= r.bottom + 8;
  };

  const trackLoop = () => {
    const { x, y } = pointerRef.current;
    const vx = x - lastXRef.current;
    lastXRef.current = x;
    // a gentle lean into the direction of travel — capped well under the
    // pickup angle, so the stamp's own tilt always reads first
    const targetLean = Math.max(-2, Math.min(2, vx * 0.08));
    leanRef.current += (targetLean - leanRef.current) * 0.1;
    positionGhost(x, y, performance.now() - dragStartTimeRef.current);
    if (sentenceRef.current) sentenceRef.current.classList.toggle('is-drop-hover', overSentence(x, y));
    rafRef.current = requestAnimationFrame(trackLoop);
  };

  const beginDrag = (chip, chipEl) => {
    const rect = chipEl.getBoundingClientRect();
    startRef.current = { ...startRef.current, x: rect.left, y: rect.top, width: rect.width, height: rect.height, chipId: chip.id };
    dragStartedRef.current = true;
    dragStartTimeRef.current = performance.now();
    // a stamp is never square to the sheet: it's picked up at its own angle,
    // either way, and held there
    baseRotRef.current = (Math.random() < 0.5 ? -1 : 1) * (1.5 + Math.random() * 3.5);
    leanRef.current = 0;
    lastXRef.current = pointerRef.current.x;
    setDragId(chip.id);
    attachGlobal();
    document.body.classList.add('is-picker-dragging');
    if (sentenceRef.current) sentenceRef.current.classList.add('is-drop-ready');
    if (ghostRef.current) {
      ghostRef.current.style.transition = 'none';
      ghostRef.current.textContent = chip.label;
      positionGhost(pointerRef.current.x, pointerRef.current.y);
    }
    rafRef.current = requestAnimationFrame(trackLoop);
  };

  const finishDrag = () => {
    cancelAnimationFrame(rafRef.current);
    detachGlobal();
    document.body.classList.remove('is-picker-dragging');
    if (sentenceRef.current) sentenceRef.current.classList.remove('is-drop-ready', 'is-drop-hover');
    dragStartedRef.current = false;
  };

  // Released. Into the sentence: it fills the blank and prints the proof, no
  // sticker. Anywhere else: it leaves a sticker where it landed, at the angle
  // it was held at, and the sentence is left alone.
  const dropStamp = (e) => {
    const rot = rotRef.current;
    const intoSentence = overSentence(e.clientX, e.clientY);
    finishDrag();
    const chip = chips.find((c) => c.id === startRef.current.chipId);
    if (!chip) return;
    if (!intoSentence) {
      leaveImpression(chip, e.pageX, e.pageY, rot);
      if (ghostRef.current) ghostRef.current.style.transition = 'none';
      setDragId(null);
      return;
    }
    stamp(chip.id);
    if (impactRef.current) {
      impactRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      impactRef.current.classList.remove('is-active');
      // eslint-disable-next-line no-unused-expressions
      impactRef.current.offsetWidth; // restart the burst on a rapid second stamp
      impactRef.current.classList.add('is-active');
      window.setTimeout(() => impactRef.current && impactRef.current.classList.remove('is-active'), IMPACT_MS);
    }
    // the impression replaces the ghost in the same frame
    if (ghostRef.current) ghostRef.current.style.transition = 'none';
    setDragId(null);
  };

  // Cancelled by the system (a scroll gesture, an alert, a lost pointer): no
  // stamp, the ghost springs back to the tray.
  const cancelDrag = () => {
    finishDrag();
    if (ghostRef.current) {
      ghostRef.current.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      ghostRef.current.style.transform = `translate3d(${startRef.current.x}px, ${startRef.current.y}px, 0) rotate(0deg)`;
    }
    springTimerRef.current = window.setTimeout(() => setDragId(null), SPRING_BACK_MS);
  };

  const pulse = (el, cls, ms) => {
    if (!el) return;
    el.classList.remove(cls);
    // eslint-disable-next-line no-unused-expressions
    el.offsetWidth;
    el.classList.add(cls);
    window.setTimeout(() => el.classList.remove(cls), ms);
  };

  const onChipPointerDown = (chip) => (e) => {
    if (reduced || dragStartedRef.current) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    didDragRef.current = false;
    // a stamp still springing back to the tray doesn't block the next pickup
    window.clearTimeout(springTimerRef.current);
    window.clearTimeout(holdTimerRef.current);
    setDragId(null);
    const chipEl = e.currentTarget;
    touchRef.current = e.pointerType === 'touch';
    if (touchRef.current) {
      // Touch: press and hold to pick up, so a swipe across the tray still
      // scrolls the page. Moving before the hold lands cancels it.
      holdTimerRef.current = window.setTimeout(() => {
        if (startRef.current.chipId === chip.id && !dragStartedRef.current) {
          if (navigator.vibrate) navigator.vibrate(8);
          beginDrag(chip, chipEl);
        }
      }, HOLD_MS);
    }
    pulse(chipEl.querySelector('.picker-chip__ink'), 'is-pressed', PRESS_INK_MS);
    // Throws if the pointer is already gone by the time this runs (a lagging
    // page); the page-level safety net covers the rest of the drag without it.
    try {
      chipEl.setPointerCapture(e.pointerId);
    } catch (err) {
      /* no capture — fine */
    }
    pointerRef.current = { x: e.clientX, y: e.clientY };
    startRef.current = { chipId: chip.id, downX: e.clientX, downY: e.clientY, x: 0, y: 0, width: 0, height: 0 };
    dragStartedRef.current = false;
  };

  const onChipPointerMove = (chip) => (e) => {
    if (reduced || startRef.current.chipId !== chip.id) return;
    pointerRef.current = { x: e.clientX, y: e.clientY };
    if (!dragStartedRef.current) {
      const dx = e.clientX - startRef.current.downX;
      const dy = e.clientY - startRef.current.downY;
      const d = Math.hypot(dx, dy);
      if (touchRef.current) {
        // moved before the hold landed: it's a scroll, not a pickup
        if (d > TOUCH_SLOP) {
          window.clearTimeout(holdTimerRef.current);
          startRef.current.chipId = null;
        }
      } else if (d > DRAG_THRESHOLD) {
        beginDrag(chip, e.currentTarget);
      }
    }
  };

  const onChipPointerUp = (chip) => (e) => {
    window.clearTimeout(holdTimerRef.current);
    if (reduced || startRef.current.chipId !== chip.id) return;
    const chipEl = e.currentTarget;
    if (chipEl.hasPointerCapture(e.pointerId)) chipEl.releasePointerCapture(e.pointerId);
    if (dragStartedRef.current) {
      didDragRef.current = true;
      dropStamp(e);
    }
    startRef.current.chipId = null;
  };

  const onChipPointerCancel = (chip) => () => {
    window.clearTimeout(holdTimerRef.current);
    if (startRef.current.chipId !== chip.id) return;
    if (dragStartedRef.current) cancelDrag();
    startRef.current.chipId = null;
  };

  const onChipClick = (chip) => (e) => {
    if (didDragRef.current) {
      didDragRef.current = false; // the drag already stamped
      return;
    }
    // Keyboard activation (detail === 0) and reduced motion stamp directly.
    // A pointer click only jiggles: the hint that it can be picked up.
    if (reduced || e.detail === 0) {
      stamp(chip.id);
      return;
    }
    pulse(e.currentTarget, 'is-jiggling', JIGGLE_MS);
  };

  const activeChip = activeId ? chips.find((c) => c.id === activeId) : null;
  const draggedChip = dragId ? chips.find((c) => c.id === dragId) : null;

  const floating = (
    <>
      <svg className="picker-defs" aria-hidden="true" focusable="false" width="0" height="0">
        <defs>
          {/* uneven rubber-stamp edges: a short-wavelength waver, small enough
              that the phrase stays legible */}
          <filter id="stamp-rough" x="-10%" y="-30%" width="120%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="3" result="sn" />
            <feDisplacementMap in="SourceGraphic" in2="sn" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {impressions.map((imp) => (
        <div
          key={imp.key}
          className={`picker-impression picker-impression--${imp.ink}`}
          style={{ left: imp.x, top: imp.y, '--rot': `${imp.rot}deg` }}
          onAnimationEnd={removeImpression(imp.key)}
          aria-hidden="true"
        >
          {imp.label}
        </div>
      ))}

      <div ref={ghostRef} className={`picker-chip picker-ghost${dragId ? ' is-active' : ''}`} aria-hidden="true">
        {draggedChip ? draggedChip.label : ''}
      </div>

      <div ref={impactRef} className="picker-impact" aria-hidden="true" />
    </>
  );

  return (
    <div className="picker">
      <h2 className="sr-only">What Raj can do</h2>

      <p className="picker-sentence" ref={sentenceRef} aria-live="polite">
        <span className="picker-sentence__stem">Raj can </span>
        {/* the full stop lives inside the clause, so it can never wrap onto a
            line of its own */}
        {activeChip ? (
          <span className="picker-sentence__clause" key={stampCount}>
            {activeChip.label}
            <span className="picker-sentence__stop">.</span>
          </span>
        ) : (
          <span className="picker-sentence__placeholder">
            ___<span className="picker-sentence__stop">.</span>
          </span>
        )}
      </p>

      {/* Always rendered, with room reserved for three lines, so the tray
          never jumps when a claim's proof arrives. */}
      <p className="picker-proof">{activeChip ? activeChip.proof : ''}</p>

      <div className="picker-row" role="group" aria-label="Things Raj can do — drag one onto the page">
        {chips.map((c) => {
          const active = activeId === c.id;
          const dragging = dragId === c.id;
          return (
            <button
              key={c.id}
              type="button"
              className={`picker-chip${active ? ' is-stamped' : ''}${dragging ? ' is-dragging' : ''}`}
              aria-pressed={active}
              onPointerDown={onChipPointerDown(c)}
              onPointerMove={onChipPointerMove(c)}
              onPointerUp={onChipPointerUp(c)}
              onPointerCancel={onChipPointerCancel(c)}
              onClick={onChipClick(c)}
            >
              {c.label}
              <span className="picker-chip__ink" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {mounted && createPortal(floating, document.body)}
    </div>
  );
}
