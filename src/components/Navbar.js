import React from 'react';

/**
 * The sheet's runtime: who this is on the left, where you can go on the right.
 *
 * The resume link is wired to the real PDF in public/, because that artifact is
 * a confirmed keeper and a hiring reader should be able to reach it from the
 * first screen without hunting. Nothing here is a dead link.
 *
 * The old navbar's "Portfolio Projects" entry is gone on purpose: the work now
 * lives on the front sheet, so a second surface for it would be a second answer
 * to the same question. `?ref=projects` has since been retired outright — the
 * route and the surface are both gone, so an old bookmark or a stale link now
 * falls through to the default surface rather than to the older answer.
 */

const NAV = [
  { id: 'home', label: 'Work' },
];

function Topbar({ page, setPage }) {
  return (
    <>
      <hr className="rule" style={{ gridColumn: '1 / span 12' }} />
      <div className="topbar" style={{ gridColumn: '1 / span 12' }}>
        <span className="stamp">Portfolio</span>
        <nav className="topbar__nav">
          {NAV.map((item) =>
            page === item.id ? (
              /* The page you are already standing on is a marker, not a control.
                 As a <button> it announced itself as the current page and then
                 did nothing when clicked — so the first click a cautious reader
                 made taught them the page was broken. A <span> cannot be
                 clicked into doing nothing. */
              <span key={item.id} className="stamp topbar__link" aria-current="page">
                {item.label}
              </span>
            ) : (
              <button
                key={item.id}
                type="button"
                className="stamp topbar__link"
                onClick={() => setPage(item.id)}
              >
                {item.label}
              </button>
            )
          )}
          <a
            className="stamp topbar__link"
            href={process.env.PUBLIC_URL + '/Raj_Shah_Resume.pdf'}
            target="_blank"
            rel="noreferrer"
          >
            Resume
          </a>
        </nav>
      </div>
    </>
  );
}

export default Topbar;
