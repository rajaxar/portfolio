import React from 'react';
import Topbar from '../Navbar';

/**
 * The shell.
 *
 * Two different worlds live behind this router, so the layout has exactly two
 * branches and they do not share a wrapper:
 *
 *  - The story surfaces (?ref=survivor, ?ref=nba_contract) keep the gradient
 *    shell they were built for, at the same offsets and overflow, with no
 *    chrome. This branch is deliberately identical to the behaviour that was
 *    here before the redesign.
 *
 *  - Everything else is the press sheet: paper, grain, a twelve-column grid,
 *    and the runtime in place of the old navbar.
 */

const STORY_PAGES = ['nba_contract', 'survivor'];

// Surfaces that compose themselves on the twelve-column sheet grid. Everything
// else predates this world and lays out full width.
const GRID_PAGES = ['home', '', 'record_variants'];

function Layout({ children, setPage, page }) {
  if (STORY_PAGES.includes(page)) {
    return (
      <div id="gradient" style={{ overflow: 'auto', position: 'fixed', inset: '0' }}>
        <div
          style={{
            width: '100dvw',
            height: '100dvh',
            marginTop: '0rem',
            position: 'absolute',
            top: '0rem',
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="sheet">
      <div className="sheet__grain" aria-hidden="true" />
      {/* A soft wash of ink pooled in the empty margins — the overprint haze a
          press leaves where a plate runs heavy. It sits behind the content and
          only in the corners, so it adds colour and softness to the whole sheet
          without ever sitting under a block of text. */}
      <div className="washes" aria-hidden="true" />
      {/* Home composes itself on the twelve-column grid. The other surfaces
          predate this world and lay themselves out full width, so they get the
          paper and the runtime without the grid — squeezing them into one
          column track would have broken them. They still wear the old world's
          type and colours and want their own pass. */}
      <div className={GRID_PAGES.includes(page) ? 'sheet__grid' : 'sheet__flow'}>
        <Topbar setPage={setPage} page={page} />
        {children}
      </div>
    </div>
  );
}

export default Layout;
