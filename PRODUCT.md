# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and hiring managers screening Raj Shah for data science and AI engineering roles. They arrive from a CV, LinkedIn, or a job application, scan the site in one pass, and decide whether to make contact or pass the profile through. They are evaluating evidence of shipped work, not browsing for entertainment.

Readers who come for the two full-screen data stories are out of scope for this record: those pieces are separate standalone artifacts, not part of the shell this product describes.

## Product Purpose

A personal portfolio for Raj Shah that carries the proof a resume cannot — analytical work a hiring reader can actually open. The shell presents that work, holds his resume, and gives a visitor a route to reach him. Success is a hiring reader who leaves knowing what he builds and able to start a conversation.

## Positioning

The work is the claim: projects that pair classical statistical methods with the engineering to ship them — Bayesian fixed-effects modelling over 240,000+ pitches, fairness in federated learning, optimization for civic infrastructure — shown as working pieces rather than described in prose. The throughline is the intersection of statistical method and software engineering, which the incumbent site's About copy states directly.

Positioning, purpose and audience are confirmed unchanged by the user; the redesign is visual and structural, not a re-pivot. The phrasing above is drawn from the incumbent site's own copy and is evidence of positioning, not approved final copy.

## Operating Context

- Static, client-only site built with Create React App and published to GitHub Pages at https://rajaxar.github.io/portfolio/ by `npm run deploy` (gh-pages publishes `build/`).
- No backend, accounts, auth, or analytics in the repo.
- Navigation is by query parameter, not routes: `?ref=home|learnings|projects|nba_contract|survivor`.
- Raj is the sole author and editor: he edits project copy, the resume, and the data himself.
- The two full-screen story pieces render outside the site chrome (no nav, no shell background) and are linked as standalone artifacts.

## Capabilities and Constraints

Capabilities:

- Shell surfaces: Home (masthead, the seven-project run and the contact route), Projects, Learnings (placeholder only — its body reads "TODO: add more" and its nav link is commented out).
- The resume runs straight off the shell: the runtime's Resume link opens `public/Raj_Shah_Resume.pdf`. There is no About surface — it held the PDF plus a short greeting, which duplicated the resume and the Home bio.
- Two on-site scroll-driven stories (`?ref=survivor`, `?ref=nba_contract`); five further project entries link out to a Google Doc, Google Drive files, and an ArcGIS dashboard.
- Assets: font files under `src/styles/assets`, project images and data CSVs under `public/`.

Confirmed constraints:

- The rebuilt site must carry a contact route — email and LinkedIn. Their absence today was an oversight, not a decision.
- The site must never read as an active job search: no "open to work" framing, badges, or availability language that a current employer could read as notice.
- Keep the resume PDF, the project grid with its external links, and the two story pieces reachable as standalone artifacts.
- `npm install` requires `--legacy-peer-deps` because `tableau-react` pins React 15.

Undecided (recorded, not assumed):

- Whether `public/Raj_Shah_Resume.pdf` is current.
- Whether the Learnings page is kept, rewritten, or dropped.

## Brand Commitments

- The product is personal and self-authored: the name is Raj Shah, presented without employer, agency, or client branding.
- Voice and framing answer to the no-active-search constraint above — confident about the work, silent about availability.

## Evidence on Hand

- `public/Raj_Shah_Resume.pdf` — the resume, opened directly from the runtime's Resume link.
- `src/data/projects.js` — the 7 project entries (title, description, image, destination, facet tags), the single source both the Home run and the Projects surface read from.
- `src/components/Projects/survivor_blog.js` and `nba_contract.js` — the two on-site stories, with their chart modules (`nba_*.js`) alongside.
- `public/data/*.csv` plus `public/final_KDE.csv` — the stories' data, committed to the repo.
- Public assets: `survivor_title_red.png`, `title_nba.png`, `baseball.png`, `IDL.png`, `fund_vote.png`, `pitt.png`, `fakebook.png`.
- External destinations: one Google Doc, two Google Drive files, one ArcGIS dashboard.
- Absent, and not to be fabricated: testimonials, endorsements, client logos, press coverage, traffic or impact metrics, and a current contact address.

## Product Principles

- Proof over claims: a hiring reader is persuaded by work they can open, not by adjectives about it.
- The shell and the stories stay separable — the shell is the product here, and the stories must remain reachable on their own.
- Surface the next step without announcing a search: contact exists and is easy to find; availability is never stated.
- Raj is the content authority — his project copy, resume, and data are his, and any engine or default change must compose with his edits rather than replace them.
