---
name: Raj Shah — Portfolio
description: One press sheet — a portfolio printed in spot inks on paper that is never white.
colors:
  press-paper: "#f6f0e2"
  rich-black: "#0b0b0b"
  riso-pink: "#fb79b1"
  riso-blue: "#5285e3"
  riso-green: "#4caf85"
  riso-teal: "#3f97a0"
  riso-yellow: "#f6ce5c"
  blue-deep: "#1b3a8f"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Big Shoulders Display, Archivo, system-ui, sans-serif"
    fontSize: "210px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.033em"
  headline:
    fontFamily: "Bricolage Grotesque, Archivo, system-ui, sans-serif"
    fontSize: "52px"
    fontWeight: 800
    lineHeight: "58px"
    letterSpacing: "-0.02em"
  headline-compact:
    fontFamily: "Bricolage Grotesque, Archivo, system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 800
    lineHeight: "38px"
  title:
    fontFamily: "Bricolage Grotesque, Archivo, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 800
    lineHeight: "32px"
    letterSpacing: "-0.012em"
  lead:
    fontFamily: "Archivo, system-ui, -apple-system, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "32px"
    letterSpacing: "-0.004em"
  lead-compact:
    fontFamily: "Archivo, system-ui, -apple-system, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "28px"
  sheet-base:
    fontFamily: "Archivo, system-ui, -apple-system, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  body:
    fontFamily: "Archivo, system-ui, -apple-system, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  label:
    fontFamily: "Bricolage Grotesque, Archivo, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0.16em"
  contact:
    fontFamily: "Bricolage Grotesque, Archivo, system-ui, sans-serif"
    fontSize: "36px"
    fontWeight: 800
    lineHeight: "38px"
    letterSpacing: "-0.01em"
  contact-compact:
    fontFamily: "Bricolage Grotesque, Archivo, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 800
    lineHeight: "32px"
  apparatus:
    fontFamily: "Redaction 20, Archivo, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "17.55px"
  spine:
    fontFamily: "Bricolage Grotesque, Archivo, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: "14.85px"
    letterSpacing: "0.12em"
rounded:
  none: "0px"
spacing:
  base: "24px"
  gutter: "24px"
  margin-top: "72px"
  margin-side: "96px"
  margin-bottom: "96px"
  measure: "66ch"
components:
  runtime-link:
    typography: "{typography.label}"
    textColor: "{colors.rich-black}"
  contact-link:
    typography: "{typography.contact}"
    textColor: "{colors.rich-black}"
  facet-tag:
    typography: "{typography.label}"
    textColor: "{colors.rich-black}"
    rounded: "{rounded.none}"
    padding: "4px 9px"
  project-card:
    backgroundColor: "{colors.press-paper}"
    textColor: "{colors.rich-black}"
    rounded: "{rounded.none}"
  masthead-plate:
    typography: "{typography.display}"
    textColor: "{colors.rich-black}"
    rounded: "{rounded.none}"
  entry-number:
    typography: "{typography.apparatus}"
    textColor: "{colors.rich-black}"
  spine:
    typography: "{typography.spine}"
    textColor: "{colors.rich-black}"
  ink-chip:
    # one per entry, set to that entry's own ink; pink is shown as the value
    backgroundColor: "{colors.riso-pink}"
    rounded: "{rounded.none}"
    width: "12px"
    height: "12px"
---

# Design System: Raj Shah — Portfolio

## Overview

**Creative North Star: "The Riso Drum"**

The shell is one press sheet. Not a page that contains printed things — a single
sheet that was printed: paper with a real stock, ink that owns fields, and a
masthead built from three plates that were misaligned on purpose. The interface
never apologises for being a website, but it never stops behaving like an object
either.

The world arrives out of a refusal. It refuses the arrangement this category
always ships — cream ground, one accent, high-contrast serif, a "Hi, I'm Raj"
hero, a uniform card grid, gradient mesh, smooth scroll — and it refuses that
arrangement's twin just as hard: the fake terminal, the mono-everything developer
page. What is left is print discipline: space is measured, type is set, and the
only visual effects are the ones a press makes — displaced edges, ink laid at a
density, and two plates crossing into a third colour where they overlap.

Density is high but the page is quiet: seven projects run as one ruled run of
entries, each an image field, a title, and the project's own words. Nothing is
decorated to look important. Colour does a job — it fills a plate, a chip, an
image field, a band — and black does all the talking, because black is the only
ink here that can be read.

**Key Characteristics:**
- One press sheet: a single 12-column sheet, top rule down to the last entry.
- Three plates in the masthead, deliberately misregistered, printed **solid**.
- Paper `#f6f0e2`, never white — it measures about `#e4dfd2` as it renders under
  the grain plate. Black `#0b0b0b`, never pure.
- Colour is field-only. Black carries every word.
- No shadows, and no blur or gradient used as elevation. Depth is layer offset and
  ink density. Softness is a separate device: edge displacement, feathering and
  gaussian tone plates, never a shadow.
- Hard edges everywhere: zero corner radius anywhere in the system.
- One display family (Bricolage Grotesque), one text family (Archivo), one
  apparatus face (Redaction 20) used for a single thing.

## Colors

A press operator's palette: two paper neutrals and six printing inks, none of
which carries type except the deepest blue. The inks are the true riso primaries
rather than a swatch-book approximation — an earlier pass used muted mustard,
cornflower and sage, and it read as a vintage newspaper instead of a riso print.

### Primary
- **Riso Pink** (#fb79b1): the ink that runs through the most of the sheet. The
  masthead's first plate, image fields, `::selection`, and the left impression of
  every project title's printed fringe. 1.86:1 on the rendered paper — never text.
- **Riso Blue** (#5285e3): the second of the two inks that carry the page. The
  masthead's second plate, the right impression of every title's fringe, and a
  field ink. Luminous on purpose: the field's soft tone mask collapses a dark navy
  to a muddy lavender, so the ink has to be bright to survive the mask and still
  overprint the pink into a true violet where the two cross. 2.71:1 — field only.
- **Blue at Print Density** (#1b3a8f): the same ink taken down to a working
  weight, and **the only colour on the sheet allowed to carry type** — 7.71:1 on
  the rendered paper. It is the focus ring, the hovered project title, the hovered
  entry number and the hovered contact link and rule.

### Secondary
- **Riso Yellow** (#f6ce5c): the page's widest field. It fills the bio's plate
  (80% into paper, rendering `#e6c870`), takes a turn in the image-field cycle,
  and is one of the three colour-bar chips. 1.14:1 — a ground, never a mark; black
  on it measures 12.05:1.
- **Riso Green** (#4caf85): a spot accent carrying a declared field class with no
  current assignment in the run. 2.03:1.

### Tertiary
- **Riso Teal** (#3f97a0): declared and unassigned, kept as a reserved field ink
  rather than deleted — it is light enough to print dark artwork on, which is the
  entry requirement for a field ink. 2.57:1.

### Neutral
- **Press Paper** (#f6f0e2): the sheet itself, deliberately lighter than the
  reference stock, because the grain plate multiplies the whole page — it measures
  `#e4dfd2` as it renders.
- **Rich Black** (#0b0b0b): all text, all rules, all borders. 14.79:1 on the
  rendered paper — the only ink that clears small-text contrast by a wide margin.

### Named Rules
**The Colour Owns Fields Rule.** An ink fills a plate, a chip, a rule, an image
field or a band. It never colours a word: against the rendered paper the best of
the five spot inks is blue at 2.71:1, and all five fail even the 3:1 large-text
floor. Black does all the talking, and it may sit *on* any field — black over the
field inks as they render measures 11.65:1 on yellow, 7.79:1 on pink and 6.10:1 on
blue, which is the worst case.

**The Never-White Rule.** Paper is `#f6f0e2`, never `#FFF`. Black is `#0b0b0b`,
never `#000`. Pure white and pure black are the two things a press never gives
you. The retired Learnings surface still hardcodes `#ffffff`; it is not part of
this sheet.

## Typography

**Display Font:** Bricolage Grotesque (with Big Shoulders Display, Archivo, system-ui)
**Body Font:** Archivo (with system-ui, -apple-system)
**Apparatus Font:** Redaction 20 (with Archivo, system-ui) — entry numbers only

**Character:** One heavy grotesque against one neutral grotesque, with a decayed
apparatus face reserved for catalogue marks. Bricolage Extra Bold carries the
display *and* every label — an earlier build ran a separate mono for the runtime
and the tags, and folding both into the display family is what turned the labels
from a techno caption into an editorial one. The name is set in **mixed case**, not
caps: Bricolage's whimsy — the ink-trap notches, the slight irregularity in its
curves — lives in the lowercase, and caps flattened it into a poster shout.

**The apparatus face.** Redaction is a typeface *about* photocopy decay: Jeremy
Mickel and Forest Young made it for Titus Kaphar and Reginald Dwayne Betts'
Redaction project at MoMA PS1, building bitmap flecks and inktrap logic into the
letterforms across seven grades. Grade 20 is the one used — the apparatus sets at
13px and has to stay legible, so it takes the decay as texture rather than as
damage. It is vendored from `@fontsource/redaction-20` under the SIL OFL and
self-hosted, so the deploy carries no runtime dependency and no third party can
withdraw the face. It is the press's apparatus, not a second display face.

### Hierarchy
- **Display** (800, 210px, leading 1, tracking -0.033em): the masthead only. One
  line, `Raj Shah`, the single largest object on the site, printed as three plates.
- **Headline** (800, 52/58px): the bridge line under the masthead — the line a
  screening reader actually reads, so it stays a display step rather than a
  caption. Drops to 34/38px below 620px. It carries **no top margin**: the plates'
  own boxes already hold about 55px of dead air below the ink, so a declared gap on
  top of that put the tagline 139px from the name while its own ink sat 113px above
  the bio — further from the line it belongs to than from the block below it.
  Flush against the plate, the name-to-tagline ink gap is 67px.
- **Title** (800, 28/32px, tracking -0.012em): project titles, in Title Case. The
  leading is 32 rather than 30 because the longest title already fills 90.5% of its
  column, and a wrapped two-line title at 1.07 crosses itself.
- **Lead** (400, 20/32px, tracking -0.004em): the bio paragraph, capped to a
  66-character measure (796px at this size). Drops to 18/28px below 620px.
- **Body** (400, 14/20px, 88% opacity): the project descriptions, and the page's
  real reading surface — capped to the same 66-character measure (529px). The
  sheet's *inherited* base is 16/24px; no role on this surface renders at 16.
- **Label** (400, 11px, tracking 0.16em, uppercase): the runtime stamp and the
  facet tags — one rank, one face. The tags carry the same size in the display
  face at 600 weight and 0.12em tracking.
- **Contact** (800, 36/38px, tracking -0.01em): the contact links, one full step
  above Title so the sheet's last line reads as an address rather than a heading.
  Held at 30/32 below 620px, where two of them no longer fit a 326px column.
- **Apparatus** (400, 13/17.55px, Redaction 20): the entry numbers, and nothing
  else. Leading is 1.35 rather than a lattice step, deliberately: a fallback face
  with taller metrics would clip a numeral otherwise.
- **Spine** (600, 11px, tracking 0.12em, uppercase): the four competencies running
  up the paper border, bottom to top.

### Named Rules
**The One Display Mass Rule.** 210px display type appears exactly once per page, in
the masthead. Nothing else is allowed to compete with it.

**The 11px Floor Rule.** Functional text never sets below 11px.

**The Optical Leading Rule.** The 24px lattice governs space — margins, padding,
gaps, the rhythm units. It does not govern the type ladder's leading: each size
carries the leading that size needs (lead 20/32, title 28/32, body 14/20, contact
36/38). Rounding those onto 24px would break the faces rather than align them.

**The Retained-But-Inert Rule.** A declaration that does nothing may only be kept
where it becomes live the moment a dependency changes — the display rules carry
`font-stretch` for a face with a width axis, and it is inert today because
Bricolage is requested as `opsz,wght` with no `wdth`. Anything else is dead code to
remove: the masthead's three scatter screens, its three masks and the `riso-soften`
filter are unreferenced now that the plates print solid, and the `mask: none` below
620px points at a mask nothing sets.

## Layout

One sheet, 12 columns on a 24px gutter (68.66px columns at a 1280px viewport),
with page margins of 72px top and 96px sides and bottom. **Both** prose blocks are
capped at the 66-character measure — the 20px lead (796px) and the 14px project
bodies (529px).

The home surface is a grid whose children claim columns: the masthead spans all
12, the project run spans all 12 as its own 2-column grid, and the contacts span
all 12. The running text sits on a yellow plate that bleeds 20px into the left
margin so the copy stays optically aligned with the masthead beyond it. That plate
is printed through the tone plate and wavered by the same displacement filter the
image fields use, so it renders as a soft pale yellow (`#e6c870`) rather than a
flat saturated band — black on it measures 12.05:1.

Two printed apparatus marks live in the 96px paper border: the **colour bar**, the
ink-calibration strip a printer prints down a sheet's edge (three 11px spot chips
at `left: 24px`, under the top margin), and the **spine**, the four competencies
set vertically and running bottom-to-top. Both withdraw below 1080px, where the
border narrows to 32px and they would land on the copy.

Responsive behaviour is print-faithful correction rather than gradual shrink. Below
1080px the side margin drops to 32px, the colour bar and spine withdraw, the ink
block withdraws (in one column it would only crush the name), and the run collapses
to one column. Below 620px three things change character: the runtime wraps to its
own row instead of clipping, the bridge and contacts drop one step, and the field's
take-up layer thins from 0.16 to 0.08 — on artwork that is already small, that layer
reads as dirt rather than as ink.

## Elevation & Depth

**No shadows. None anywhere.** A press does not cast shadows, so neither does the
interface, and there is no shadow vocabulary to document because there are no
shadows. "No gradients, no blur" is scoped the same way: neither may stand in for
elevation. Both are permitted as material — the ink washes are radial gradients and
the screens are gaussian-blurred — and neither is a light source.

Depth is conveyed by two press-native means. **Layer offset** — the masthead's three
plates are transformed at different offsets and deliberately not aligned, so the
type reads as three impressions that missed registration. The project titles carry
the same device at their own scale, as a whisper: a pink impression pulled one way,
a blue one the other, the rich-black key on top, all multiplied so the overlaps
darken like ink.

**Ink density** is the second means, and the one that earns the word "printed". A
field is not a solid colour with texture sprinkled over it; the ink is laid down
*through* a soft gaussian plate (`src/assets/tone.png`, alpha mean 0.70), so
roughly 70% of any field is ink and the remaining 30% is paper reading through. That
is what keeps the fills light, less saturated and translucent instead of opaque, and
it is why the inks can sit at their reference values instead of being tinted down.
The same plate read large — 1200px against the 400px tile — is laid over the top for
uneven take-up, because ink never goes down evenly. Three deposit densities cycle
through the run by position (1 / 0.86 / 0.94).

Softness belongs in this section too, because it is made of the same materials and
nothing else. A field edge dissolves rather than ends — the image frames and the bio
plate carry a long-wavelength displacement, so they waver a few pixels off true. The
grain plate multiplies the whole page at 0.68. The ink washes pool three spot inks
into the empty corners, multiplied, at 46% pink, 42% blue and 40% yellow. Paper
reads through every field. **Nothing here is feathered by a blur standing in for
depth; everything is feathered the way ink is.**

### Named Rules
**The Flat-By-Doctrine Rule.** No `box-shadow`, no gradient-as-elevation, no
blur-as-elevation. If a surface needs to feel closer, it gets more ink or a heavier
deposit — never a shadow.

**The Scale-Relative Offset Rule.** Misregistration is a ratio, not a measurement.
The masthead's 6.5px offset is 3.1% of a 210px cap height; the same 3.1% at a 28px
title is 0.87px, i.e. invisible. Each size carries the offset it needs to read,
which is why the titles use ±0.55 to 0.7px and take the colour impressions down to
`opacity: .5` so the result reads as a press halo rather than a colour split.

**The One Device Rule.** Every interaction on this surface moves the same per-layer
offset the print is built from. `--slip` is the state (9px at rest, 16px on hover,
30px while Alt is held); `--drift` is what the scroll and the knock add. The plates
read their sum, so the page never grows a second vocabulary in order to be playful.
Nothing animates a layout property — only `transform` and `opacity` — and every one
of them is disarmed under `prefers-reduced-motion`.

**The Delight-Not-Volume Rule.** An interaction is worth having when it rewards
curiosity and costs nothing: the press knocks out of register when the name is
touched and settles back, and the plates drift with the scroll and come into
register when it stops. Intensity stays proportional to how often the gesture
repeats.

## Shapes

Hard-edged and rectangular throughout: a single `rounded` step, `0px`. Nothing in
the system has a corner radius, including image fields, tags, plates and the sheet
itself. A press cuts paper square, and that discipline is what keeps a rounded
element from reading as pasted in from another page.

Form is carried by rules instead of radii. A 1px hairline
(`rgba(11,11,11,0.24)`) underlines the runtime links; a heavier
`rgba(11,11,11,0.55)` draws facet tag borders; a 2px solid rich black closes the top
of every project entry. Every one of those rules is drawn through a displacement
filter, so a 2px line reads as pulled ink rather than as a ruler. Image fields are
clipped rectangles with a fixed 2.6:1 aspect ratio, so a run of them reads as a set
of printed plates rather than a gallery of arbitrary thumbnails.

Curves are allowed where the material is ink rather than paper. The ink block's two
drums are circles and its key ring is an ellipse, each displaced so neither is a
true circle — the form is refused *in the mark*, not forbidden in the drawing.

## Components

Everything in this system is a printed element first and a control second: the
interactive parts are typeset labels with a rule under them, not buttons.

### Runtime links (nav)
- **Shape:** zero radius, no background, no padding; a 1px hairline underline
  (`{colors.rich-black}` at 24%).
- **Primary:** Bricolage at the label step — 11px, 0.16em tracking, uppercase, in
  `{colors.rich-black}`. The runtime is type, not a control bar.
- **Hover / Focus:** the underline goes to full rich black; `aria-current="page"`
  renders the same treatment, so the current page and the hovered link read
  identically by design.
- **Note:** the underline is the only affordance, and the hit area is the text
  itself. At label size that is a small target — a deliberate consequence of
  printing the runtime as type rather than as a toolbar.

### Contact links
- **Shape:** zero radius, display type, 4px padding below the baseline with a 2px
  hand-printed rule under it.
- **Primary:** Bricolage 800 at 36/38px in `{colors.rich-black}`. Held at 30/32
  below 620px, where two of them no longer fit a 326px column.
- **Hover / Focus:** the rule and the word take `{colors.blue-deep}` together.
- **The imprint (delight pass):** hovering or focusing a contact link sets its
  address beneath it in the apparatus face — Redaction 20, 13px, 0.75 opacity — the
  press's convention of setting the imprint at the foot of the sheet. It is a
  `::after` with `content: attr(data-imprint)`, fed from `src/data/contacts.js`, and
  it is **absolutely positioned** so the reveal can never shift the layout under the
  cursor. Two declarations are load-bearing: `text-transform: none`, because the
  link is display type and an uppercased email is a wrong address, and
  `font-weight: 400`, because Redaction 20 ships one weight and the inherited 800
  would be synthesised. It lands in the link's accessible name, so it is the one
  place on the surface that tells a screen reader where a link actually goes.

### Facet tags
- **Shape:** zero radius, 4px / 9px padding, 1px border at `rgba(11,11,11,0.55)`,
  no fill.
- **Style:** Bricolage 11px, 0.12em tracking, uppercase, `{colors.rich-black}`.
- **State:** static at rest. On hovering the entry they belong to, the border goes
  to full black; a tag hovered directly inks in solid — black fill, paper text —
  like an uninked stamp pressed down. They deliberately carry no colour fill: an
  earlier pass colour-coded them per competency and it was cut, because the colour
  decoded to nothing a reader could learn.

### Project entry
- **Corner Style:** none.
- **Background:** `{colors.press-paper}`; the image field behind it cycles the light
  inks only. The run currently uses pink, yellow and blue; green and teal carry
  declared field classes but no assignment.
- **Shadow Strategy:** none; see Elevation & Depth.
- **Border:** a 2px rich black rule across the top of each entry, and a 2px rule
  under the image field, both displaced so neither is straight.
- **Internal Padding:** spacing in whole 24px units; the run's row gap is 72px.
- **Title:** the misregistered plate treatment at title scale, dialled down to a
  hint — a pink impression at `translate(-0.7px, 0.55px)`, a blue one at
  `translate(0.55px, -0.45px)`, both at `opacity: .5`, the rich-black key on top,
  all multiplied so overlaps darken. At full strength this read as anaglyph rather
  than as a press. The type stays live, selectable and searchable; the impressions
  are pseudo-elements carrying the title via `attr()`, not images.
- **Image field:** the ink is laid *through* `tone.png` at 400px — the grain, alpha
  mean 0.70 — so paper reads through roughly 30% of the field, with the same plate
  at 1200px multiplied over it at 0.16 for uneven take-up. Three deposit densities
  cycle by position (1 / 0.86 / 0.94). A chroma floor of the same ink at 26% into
  paper sits underneath, so the masked deposit reads as saturated printed ink rather
  than a pastel. The texture sits on the field and never behind type.
- **Motion:** a row prints as it arrives — the artwork takes its ink, then the fill
  resolves over the field, over 0.7–0.9s. Hovering a printed entry pulls its title
  plates a little further apart (±1.4px / ±1.1px), takes up more ink (0.16 → 0.22),
  settles the artwork a hair closer, wakes the running head and inks the tags. Under
  `prefers-reduced-motion` the row is simply present.
- **Uniformity:** all seven entries are identical in width and treatment. The run
  ends on a ragged half-row rather than promoting an entry to full width — an
  earlier build made the seventh card a two-column feature and it was cut, because a
  run of printed plates reads as a set or not at all.

### Ink chip
A 12px square in the entry's own ink, set from the same `--field-ink` custom
property that prints the field. A press declares which ink each plate runs on, and
this is that declaration — colour doing a job at the smallest scale on the page. It
carries no text, so it answers to no contrast ratio. On hovering its entry it grows
to a 1.4 swatch.

### Running head
The first line of every project entry: its number at the left, its ink chip at the
right. The number is `01`–`07`, zero-padded, in the apparatus face — catalogue
discipline, and also how a reader says "the third one". It is set plainly, without
caps or wide tracking, because a two-character string is scanned rather than read;
on hover it takes `{colors.blue-deep}`. The entry's 2px rich-black top rule sits
above it.

### Bio plate
The running text owns an ink, like every other field on the sheet. The plate bleeds
one 24px step into the left margin so the copy stays optically aligned with the
masthead above it, and it is printed through the tone plate with wavering edges
rather than poured on as a flat hex — paper reads through roughly 43% of it. The
mass is deliberately tight: a roomier plate was read as a third focal point
competing with the masthead, so the padding came down while the field stayed.

### Masthead plate (signature)
Three SVG `<text>` elements carry the same string in three inks, each at its own
offset, each displaced by the same turbulence filter so the glyph edges read as ink
spread rather than as a cut vector, with the black key at `opacity: .86` so the pink
and blue read through it. **The three plates print solid, and that is the decision,
not a defect** — an earlier build toned each plate with its own scatter screen applied
as a mask on the glyphs, and that treatment was dropped deliberately. The type
is live SVG text — selectable, searchable, and named once to assistive technology by
the `h1`. On hover the plates separate further; holding Alt latches them fully apart;
scrolling drifts them apart in proportion to velocity, and they settle back into
register when the scroll stops. The one secret: a pointer-down on the name (or `r`)
knocks the whole press out of register for a beat, then it settles.

**Removable dead code.** The dropped treatment's apparatus is still in the tree —
three scatter `<pattern>`s, three `<mask>`es and the `riso-soften` filter in
`Masthead.js`, plus a matching `mask: none` at ≤620px in `riso.css` — and nothing
references any of it. All of it is safe to delete. It is left in place only until the
owner says otherwise, and this record documents the render, which is solid.

### Ink block (signature)
The masthead's companion: two overlapping ink discs, pink and blue, each displaced
and multiplied so that where they cross they overprint into a deep magenta, with a
key-black ellipse ring a hair out of register. The motif is the colour test a printer
pulls to check registration before a run. It holds a fixed measure (clamp 190–300px)
so it reads as a plate rather than a stretch, and withdraws below 1080px. Hovering
it pulls the two drums apart the way a press knocks out of register, with the key
ring holding still so the spread reads against a fixed register.

### Spine
The four competencies, running up the paper border, withdrawn below 1080px. Set at
11px Bricolage, 600 weight, uppercase, 0.12em tracking — the same rank as the
runtime and the tags. It is `aria-hidden`, because the same four facets are already
carried by the entry tags and this copy would otherwise be read twice.

### Colour bar
The ink-calibration strip a printer prints down a sheet's edge: three 11px spot
chips stacked at the top of the paper border. Static and decorative.

### Registration marks (removed)
Four corner crop-crosses sat in the paper border for a round and were cut — they
read as print cosplay rather than as this sheet's own world. They are documented here
only so they are not reinstated as decoration.

## Do's and Don'ts

### Do:
- **Do** keep every word in `{colors.rich-black}`. It is the only ink that clears
  small-text contrast on this paper (14.79:1 as it renders), and the only other
  colour allowed to carry type is `{colors.blue-deep}` at 7.71:1.
- **Do** give an ink a field: a plate, chip, rule, band or image field.
- **Do** size misregistration as a ratio. The offset that reads at 210px is
  invisible at 28px; each size carries the offset it needs.
- **Do** set functional text at 11px or above.
- **Do** keep spacing on the 24px lattice, and let leading follow the size.
- **Do** reach for layer offset, ink density or edge displacement when something
  needs weight or softness. A displaced edge and an alpha-masked deposit are this
  system's two softness devices.
- **Do** keep the 2.6:1 image field ratio so a run of projects reads as a set.
- **Do** check that a declaration is still referenced before trusting it, and delete
  it when it is not. The masthead's scatter screens and the `mask: none` override are
  unreferenced today. An unreferenced mechanism is not evidence of a lost intent —
  ask before restoring a treatment, because a removed one may have been removed on
  purpose.

### Don't:
- **Don't** use white or pure black. `#FFF` and `#000` are both wrong here.
- **Don't** put colour on text — pink (1.86:1), blue (2.71:1), green (2.03:1), teal
  (2.57:1) and yellow (1.14:1) all fail even the 3:1 large-text floor.
  `{colors.blue-deep}` is the single exception.
- **Don't** add a shadow, or use a blur or a gradient standing in for elevation.
  Softness comes from displacement, feathering and the tone plate instead.
- **Don't** round a corner. The system has exactly one radius, and it is `0px`.
- **Don't** add a second display family or introduce an italic. One display face,
  one text face, one apparatus face.
- **Don't** add a second 210px display mass; the masthead is the page's only one.
- **Don't** let a decorative screen or a deposit layer sit behind type anywhere.
- **Don't** apply the masthead's offset numbers to smaller type. The device is the
  ratio, not the measurement.
- **Don't** give the bridge a top margin. The plate's own box already supplies the
  air; adding to it inverts the hierarchy and reads as a detached block.
