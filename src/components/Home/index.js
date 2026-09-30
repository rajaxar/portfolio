import React, { useEffect, useRef, useState } from 'react';
import Masthead from './Masthead';
import ProjectCard from './ProjectCard';
import { projects } from '../../data/projects';
import contacts from '../../data/contacts';

/**
 * The shell: one press sheet, masthead over a ruled run of the work.
 *
 * Absorbs what the old Projects surface did — all seven projects are here, each
 * with its own artwork, its own words and its competency tags — so the visitor's
 * whole job is choosing which one to open.
 */

function Home() {
  const wrapRef = useRef(null);

  // Alt latches the plates apart. Transient, self-clearing, no extra markup:
  // the misregistration is the interaction, not decoration bolted on top.
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'Alt') document.body.classList.add('sheet--apart');
    };
    const up = (e) => {
      if (e.key === 'Alt') document.body.classList.remove('sheet--apart');
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      document.body.classList.remove('sheet--apart');
    };
  }, []);

  // The motion preference is watched live rather than sampled once at mount: a
  // reader who turns "reduce motion" on while the sheet is open should get the
  // still sheet straight away, and turning it back off should re-arm. Sampling
  // at mount left every listener attached, so the transitions were killed by CSS
  // while the transforms snapped instead of being absent.
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // The press. Three interactions, one device: everything here moves the same
  // per-layer offset the print itself is built from, so the page never grows a
  // second vocabulary to be playful in.
  useEffect(() => {
    if (reduced) return undefined;

    // JS opts in to the hidden state, so a browser without it renders all seven
    // projects rather than an empty sheet.
    document.documentElement.classList.add('has-motion');

    const wrap = wrapRef.current;
    let lastY = window.scrollY;
    let settle = 0;

    // 1. The plates answer the scroll: they drift apart with velocity and come
    //    back into register when you stop. The transform's own .55s transition
    //    does the easing, so there is no frame loop to leak.
    const onScroll = () => {
      if (!wrap) return;
      const y = window.scrollY;
      const v = Math.min(14, Math.abs(y - lastY) * 0.5);
      lastY = y;
      wrap.style.setProperty('--drift', v.toFixed(1) + 'px');
      window.clearTimeout(settle);
      settle = window.setTimeout(() => wrap.style.setProperty('--drift', '0px'), 110);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // 2. Every row prints as it arrives: the screen resolves onto the field and
    //    the artwork takes its ink.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-printed');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 }
    );
    const rows = Array.from(document.querySelectorAll('.proj'));
    rows.forEach((row) => io.observe(row));

    // 3. The secret: touch the printed name and the press knocks out of
    //    register for a beat, then settles back. Bound on the document rather
    //    than as a JSX handler so no ARIA is implied for a decorative easter
    //    egg — and mirrored on `r` so it is reachable without a pointer.
    let knockTimer = 0;
    const knock = () => {
      if (!wrap) return;
      wrap.style.setProperty('--drift', '26px');
      document.body.classList.add('sheet--knock');
      window.clearTimeout(knockTimer);
      knockTimer = window.setTimeout(() => {
        wrap.style.setProperty('--drift', '0px');
        document.body.classList.remove('sheet--knock');
      }, 240);
    };
    const onPointerDown = (e) => {
      if (e.target.closest && e.target.closest('.masthead__wrap')) knock();
    };
    const onKeyDown = (e) => {
      // Modifiers are not ours. `e.key === 'r'` is true while Cmd/Ctrl is held,
      // so every reload — Cmd/Ctrl+R, and Shift+R's hard reload — used to flash
      // the press out of register on its way to the new page.
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      // Nor is the key ours when it is going into a field.
      const t = e.target;
      if (t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName || ''))) return;
      if (e.key === 'r' || e.key === 'R') knock();
    };
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
      io.disconnect();
      window.clearTimeout(settle);
      window.clearTimeout(knockTimer);
      document.documentElement.classList.remove('has-motion');
      document.body.classList.remove('sheet--knock');
    };
  }, [reduced]);

  return (
    <>
      {/* The spine. A printed sheet has something running down its edge, and the
          four competencies are the right thing to put there: they are the
          positioning, they belong at the margin rather than in the middle, and
          they are already available to assistive tech through the tags, so this
          copy is hidden from it rather than read twice. It withdraws below
          1080px, where the border is too narrow to hold it. */}
      <p className="spine" aria-hidden="true">
        Data Science &middot; ML Engineering &middot; Data Viz &middot; Civic Tech
      </p>

      {/* Registration marks in the paper border — the printed tell that this is a
          proof sheet rather than a page with a printed header. Crosses with a
          centre square: the conventional form is a circle, and a circle is the one
          thing this system cannot draw, because it has exactly one radius. */}
      <div className="regs" aria-hidden="true">
        <span className="reg reg--tl"><span className="reg__dot" /></span>
        <span className="reg reg--tr"><span className="reg__dot" /></span>
        <span className="reg reg--bl"><span className="reg__dot" /></span>
        <span className="reg reg--br"><span className="reg__dot" /></span>
      </div>

      <div className="masthead">
        <h1 className="sr-only">Raj Shah &mdash; data scientist and AI engineer</h1>
        <div className="masthead__wrap" ref={wrapRef}>
          <Masthead />
        </div>
        <p className="bridge mt3">Data scientist and AI engineer</p>
        <p className="lead mt3">
          My name is Raj Shah. I work on backend architecture, quasi-experimental work, and AI
          systems, and I have a passion in civic tech. I thrive in the intersection of classical
          statistical methods with software engineering.
        </p>
      </div>

      {/* The run is the page's main content, so it keeps a heading — but not a
          printed one. "Seven projects" was a label the reader did not need, and
          removing it from the page must not remove the h2 the h3s hang from. */}
      <h2 className="sr-only">Projects</h2>

      <div className="projects mt2">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>

      <div className="contacts mt2">
        {contacts.map((c) => (
          <a
            className="contact"
            key={c.id}
            href={c.href}
            data-imprint={c.imprint}
            {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})}
          >
            {c.label}
          </a>
        ))}
      </div>
    </>
  );
}

export default Home;
