---
name: Raj Shah — Portfolio
description: One press sheet — a portfolio printed in spot inks on paper that is never white.
colors:
  press-paper: "#f7f3e8"
  rich-black: "#0b0b0b"
  cornflower-blue: "#718fc4"
  dusty-pink: "#de56a9"
  sage-green: "#6f907a"
  soft-teal: "#2f8fa1"
  mustard-yellow: "#deb250"
  blue-deep: "#4a6ba8"
typography:
  display:
    fontFamily: "Big Shoulders Display, Archivo, system-ui, sans-serif"
    fontSize: "210px"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.033em"
  headline:
    fontFamily: "Big Shoulders Display, Archivo, system-ui, sans-serif"
    fontSize: "52px"
    fontWeight: 900
    lineHeight: "58px"
    letterSpacing: "normal"
  title:
    fontFamily: "Big Shoulders Display, Archivo, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 900
    lineHeight: "32px"
    letterSpacing: "0.01em"
  lead:
    fontFamily: "Archivo, system-ui, -apple-system, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "32px"
    letterSpacing: "-0.004em"
  body:
    fontFamily: "Archivo, system-ui, -apple-system, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  body-small:
    fontFamily: "Archivo, system-ui, -apple-system, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  label:
    fontFamily: "Martian Mono, JetBrains Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0.16em"
  contact:
    fontFamily: "Big Shoulders Display, Archivo, system-ui, sans-serif"
    fontSize: "36px"
    fontWeight: 900
    lineHeight: "38px"
  contact-compact:
    fontFamily: "Big Shoulders Display, Archivo, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 900
    lineHeight: "32px"
  apparatus:
    fontFamily: "Redaction 20, Archivo, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "17.55px"
  spine:
    fontFamily: "Martian Mono, JetBrains Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "1.35"
    letterSpacing: "normal"
  lead-compact:
    fontFamily: "Archivo, system-ui, -apple-system, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "28px"
  headline-compact:
    fontFamily: "Big Shoulders Display, Archivo, system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 900
    lineHeight: "38px"
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
    rounded: "{rounded.none}"
  entry-number:
    typography: "{typography.apparatus}"
    textColor: "{colors.rich-black}"
  spine:
    typography: "{typography.label}"
    textColor: "{colors.rich-black}"
  ink-chip:
    # one per entry, set to that entry's own ink; the mustard is shown as the value
    backgroundColor: "{colors.mustard-yellow}"
    rounded: "{rounded.none}"
    width: "12px"
    height: "12px"
---

# Design System: Raj Shah — Portfolio

## Overview

**Creative North Star: "The Riso Drum"**

The whole shell is one press sheet. Not a page that contains printed things — a
single sheet that was printed: paper with a real stock, ink that owns fields,
registration marks in the border, and a masthead built from three plates that
were misaligned by a millimetre on purpose. The interface never apologises for
being a website, but it never stops behaving like an object either.

The world arrives out of a refusal. It refuses the arrangement this category
always ships — cream ground, one accent, high-contrast serif, a "Hi, I'm Raj"
hero, a uniform card grid, gradient mesh, smooth scroll — and it refuses that
arrangement's twin just as hard: the fake terminal, the mono-everything
developer page. What is left is print discipline. Space is measured, type is
set, and the only visual special effects are the ones a press actually makes.

Density is high but the page is quiet: seven projects run as one ruled column of
entries, each an image field, a title, and the project's own words. Nothing is
decorated to look important. Colour does a job — it fills a plate, a chip, an
image field, a band — and black does all the talking, because on this paper black
is the only ink that can be read.

**Key Characteristics:**
- One press sheet: a single 12-column sheet, top rule down to the last project entry.
- Three screened plates in the masthead, deliberately misregistered.
- Paper `#F7F3E8`, never white — it renders about `#E6E2D8` under the grain. Black `#0B0B0B`, never pure.
- Colour is field-only. Black carries every word below display size.
- No shadows, no gradients, no blur. Depth is layer offset and ink density.
- Hard edges everywhere: zero corner radius anywhere in the system.
- Nearly all type is uppercase; display is condensed and very heavy.

## Colors

A press operator's palette: two paper neutrals and five printing inks, none of
which carries small text. The inks are read off reference sheets rather than a
swatch book, which is why they are mustard, cornflower, a dusty pink, sage and a
soft teal instead of the riso primaries — those read as packaging rather than as
print.

### Primary
- **Cornflower Blue** (#718FC4): the structural ink. The masthead's second plate,
  and — at higher density — the only ink allowed anywhere near type. The
  cornflower itself measures 2.95:1 on paper, so it fails even the 3:1 large-text
  threshold. `--blue-deep` (#4A6BA8, 4.78:1) is the same ink at print density, and
  it is what the focus ring, the hovered title and the contact hover actually use.
- **Dusty Pink** (#DE56A9): the ink that runs through the most of the sheet. The
  masthead's first plate, image fields, `::selection`. At 3.15:1 on paper it fails
  the 3:1 large-text threshold, which is why it is only ever a field.

### Secondary
- **Sage Green** (#6F907A): taken from the botanical reference sheet, and it takes
  the fourth turn in the image-field cycle. 3.19:1 on paper.
- **Soft Teal** (#2F8FA1): light enough to print dark artwork on, which is why it
  takes a turn in the image-field cycle alongside the mustard and the pink.
  3.40:1 on paper.

### Tertiary
- **Mustard Yellow** (#DEB250): the page's widest field. Image fields, the band
  behind block elements. 1.79:1 on paper — it is a ground, never a mark. Rich
  black on it measures 9.93:1, so type printed *on* the mustard band is at home.

### Neutral
- **Press Paper** (#F7F3E8): the sheet itself, and deliberately lighter than the
  references it was read from — those are photographs, and this stock photographs
  darker than it prints. It also has to survive the grain plate, which multiplies
  the whole page; it renders about #E6E2D8.
- **Rich Black** (#0B0B0B): all text, all rules, all borders. ≈15.3:1 on the paper
  **as it renders** under the grain plate (17.75:1 on the bare token, before the
  multiply) — the only ink in the set that clears small-text contrast.

### Named Rules
**The Colour Owns Fields Rule.** An ink fills a plate, a chip, a rule, an image
field or a band. It never colours a word smaller than display size: against paper
none of the five inks clears 4.5:1, and the best of them (teal) reaches only
3.40:1. Black does all the talking, and it may sit *on* any of the five — measured
after the grain plate has multiplied both the type and its background, the worst
case is teal at 4.59:1.

**The Never-White Rule.** Paper is #F7F3E8, never #FFF. Black is #0B0B0B, never
#000. Pure white and pure black are the two things a press never gives you.

## Typography

**Display Font:** Big Shoulders Display (with Archivo, system-ui)
**Body Font:** Archivo (with system-ui, -apple-system)
**Label/Mono Font:** Martian Mono (with JetBrains Mono, ui-monospace)
**Apparatus Font:** Redaction 20 (with Archivo, system-ui) — entry numbers only

**Character:** A condensed, extremely heavy display face against a neutral
grotesque, with a wide-tracked mono for every annotation. Big Shoulders at 900
weight is the entire display voice. Note that with this face the weight is the only
axis that does anything: the family is requested as `wght@100..900` with no width
axis, so the `font-stretch: 82%` carried on all four display rules is inert — the
face is a condensed American Gothic by design, which is why nothing looks wrong.
Martian Mono's extra tracking (0.16em at 11px) is what makes a whisper of labels
feel stamped rather than typed.

**The apparatus face.** Redaction is a typeface *about* photocopy decay: Jeremy
Mickel and Forest Young made it for Titus Kaphar and Reginald Dwayne Betts'
Redaction project at MoMA PS1, building bitmap flecks and inktrap logic into the
letterforms across seven grades from clean to nearly illegible. Grade 20 is the one
used, because the apparatus sets at 13px and has to stay legible — it takes the
decay as texture rather than as damage. It is vendored from
`@fontsource/redaction-20` under the SIL OFL and self-hosted, so the deploy carries
no runtime dependency and no third party can withdraw the face. It is the press's
apparatus, not a second display face, which is why the rule below still holds.

### Hierarchy
- **Display** (900, 210px, leading 1, tracking -0.033em, width 82%): the masthead
  only. One line, RAJ SHAH, the single largest object on the site.
- **Headline** (900, 52/58px, uppercase): the bridge line under the masthead —
  the line a screening reader actually reads, so it stays a display step rather
  than a caption. Drops to 34/38px below 620px.
- **Title** (900, 28/32px, uppercase, tracking +0.01em): project titles. The
  leading is 32 rather than 30 because the longest title already fills 90.5% of
  its column, and a wrapped two-line uppercase title at 1.07 crosses itself.
- **Lead** (400, 20/32px): the bio paragraph, capped to a 66-character measure.
  Drops to 18/28px below 620px.
- **Body** (400, 14/20px, 88% opacity): the project descriptions, and the page's
  real reading surface — capped to the same 66-character measure as the lead.
  The sheet's *inherited* base is 16/24px; no role on this surface renders at 16.
- **Body small** (400, 14/20px): retained as a token; identical to Body above.
- **Label** (400, 11px, tracking 0.16em, uppercase): the runtime and the facet tags —
  always Martian Mono, always uppercase, and **one** rank: both the stamp and the
  tag carry 0.16em, so they no longer differ by sub-pixel tracking nor across
  breakpoints. A destination line ("Opens Google Drive")
  sat here until Raj cut it; the `where` field is still in the data and nothing
  prints it.
- **Contact** (900, 36/38px, uppercase): the contact links, one full step above
  Title so the sheet's last line reads as an address rather than a heading. Held
  at 30/32 below 620px, where two of them no longer fit a 326px column.
- **Apparatus** (400, 13/17.55px, sentence case, Redaction 20): the entry numbers in
  the running heads. Leading is 1.35 rather than a lattice step, deliberately: a
  fallback face with taller metrics would clip a numeral otherwise.
- **Spine** (400, 12px, Title Case, Martian Mono): the four competencies running
  up the paper border, bottom to top, at normal tracking. 12px because the 11px
  Floor Rule puts roman case on the higher step.

### Named Rules
**The One Display Mass Rule.** 210px display type appears exactly once per page,
in the masthead. Nothing else is allowed to compete with it.

**The 11px Floor Rule.** Functional text never sets below 11px, and 12px is the
floor once a line is set in roman case rather than uppercase.

**The Optical Leading Rule.** The 24px lattice governs space — margins, padding,
gaps, the rhythm units. It does not govern the type ladder's leading: each size
carries the leading that size needs (.lead 20/32, .proj__title 28/32,
.proj__body 14/20, .contact 36/38). Rounding those onto 24px would break the
faces rather than align them.

## Layout

One sheet, 12 columns on a 24px gutter, with page margins of 72px top and 96px
sides and bottom at full width. **Both** prose blocks are capped at the
66-character measure — the 20px lead (756px) and the 14px project bodies (529px).
Until the typeset pass only the lead carried the cap, so the bodies ran 75.5 of
their own characters in a 612px column, 102 at 1920px and 144 at 2560px, and the
one-column breakpoint at 1080px set them at 122. The cap holds the measure inside
45–75 at every width — the classic print maximum for a single column.

Four crosshair registration marks sit in the paper border, one per corner, drawn
as two 1.5px arms meeting at a 5px centre square. They are the sheet's proof-mark:
they make the page read as a press proof rather than a page with a printed header.
They are suppressed below 1080px, where the border narrows to 32px and a mark
would land on the copy.

The home surface is a grid whose children claim columns: the masthead spans 7, and
the project run spans all 12 as its own 2-column grid. The running text sits on a
mustard plate that bleeds 20px into the left margin so the copy stays
optically aligned with the masthead. That plate is printed through the tone plate
like every other ink here, at 57% ink against paper, so it renders as a soft pale
yellow (~`#d8bf87`) rather than the flat saturated band it was: 1.31x lighter, with
grain, and black type on it now measures 10.99:1.

Responsive behaviour is print-faithful corrections rather than a gradual shrink.
Below 1080px the side margin drops to 32px, the registration marks withdraw, and
the run collapses to one column. Below 620px three things change character: the
runtime wraps to its own row instead of clipping, the masthead prints **solid**
(at that size the scatter merges into grey mush, so the misregistration is what
remains), and the field's ink take-up thins from 0.16 to 0.08.

## Elevation & Depth

**No shadows. None anywhere.** This is a flat system, and the flatness is
doctrinal rather than a preference: a press does not cast shadows, so neither
does the interface. There is no shadow vocabulary to document because there are
no shadows.

Depth is conveyed by two press-native means instead. **Layer offset** — the
masthead's three plates are transformed at different offsets and deliberately not
aligned, so the type reads as three impressions that missed registration. The
project titles carry the same device at their own scale, as a whisper rather than
at volume: a pink impression pulled one way, a blue one the other, the rich-black
key on top, all multiplied so the overlaps darken like ink.

**Ink density** — the second means, and the one that earns the word "printed". A
field is not a solid colour with texture sprinkled over it; the ink is laid down
*through* a soft gaussian plate (`src/assets/tone.png`, alpha mean 0.70), so
roughly 70% of any field is ink and the remaining 30% is paper reading through.
That is what keeps the fills light, less saturated and translucent instead of
opaque, and it is why the inks can sit at their reference values instead of being
tinted down. The same plate read large — 1200px against the 400px grain — is laid
over the top for uneven take-up, because ink never goes down evenly. Three deposit
densities cycle through the run by position. The masthead's plates are toned by
scatter screens rather than dot lattices: a lattice only exists to stop three
plates moiréing, and with a scatter there are no angles to hold apart.

### Named Rules
**The Flat-By-Doctrine Rule.** No `box-shadow`, no `filter: blur()`, no
gradient-as-elevation. If a surface needs to feel closer, it gets more ink or a
heavier deposit — never a shadow.

**The Scale-Relative Offset Rule.** Misregistration is a ratio, not a
measurement. The masthead's 6.5px offset is 3.1% of a 210px cap height; the same
3.1% at a 28px title is 0.87px, i.e. invisible. Each size carries the offset it
needs to read, which means the ratio grows as the type shrinks — the titles use
±0.55 to 0.7px, and then take the colour impressions down to `opacity: .5` so the
result reads as a press halo rather than a colour split.

**The One Device Rule.** Every interaction on this surface moves the same
per-layer offset the print is built from. `--slip` is the state (9px at rest, 16px
on hover, 30px while Alt is held); `--drift` is what the scroll and the knock add.
The plates read their sum, so the page never grows a second vocabulary in order to
be playful. Nothing animates a layout property — only `transform` and `opacity` —
and every one of them is disarmed under `prefers-reduced-motion`.

## Shapes

Hard-edged and rectangular throughout: a single `rounded` step, `0px`. Nothing in
the system has a corner radius, including image fields, tags, plates and the
sheet itself.

The registration marks are the one place the conventional form was refused. A
printer's mark is normally a cross inside a circle, and a circle is the one shape
this system cannot draw — so they are crosses meeting at a 5px centre square, which
keeps the mark and the law.

Form is carried by rules instead of radii. A 1px hairline
(`rgba(11,11,11,0.24)`) underlines the runtime links; a heavier
`rgba(11,11,11,0.55)` draws facet tag borders; a 2px solid rich black closes the
top of every project entry. Image fields are clipped rectangles with a fixed
2.6:1 aspect ratio, so a run of them reads as a set of printed plates rather than
a gallery of arbitrary thumbnails.

## Components

Everything in this system is a printed element first and a control second: the
interactive parts are typeset labels with a rule under them, not buttons.

### Runtime links (nav)
- **Shape:** zero radius, no background, no padding; a 1px hairline underline
  (`{colors.rich-black}` at 24% via the rule token).
- **Primary:** Martian Mono at the label step — 11px, 0.16em tracking, uppercase,
  in `{colors.rich-black}`. The runtime is type, not a control bar.
- **Hover / Focus:** the underline goes to full rich black; `aria-current="page"`
  renders the same treatment, so the current page and the hovered link read
  identically by design.
- **Note:** the underline is the only affordance, and the hit area is the text
  itself. At label size that is a small target — a deliberate consequence of
  printing the runtime as type rather than as a toolbar.

### Contact links
- **Shape:** zero radius, uppercase display type, 4px padding below the baseline
  with a 2px rule under it.
- **Primary:** Big Shoulders Display 900, one full step above the title step
  (36/38px) in `{colors.rich-black}`. Held at 30/32 below 620px, where two of
  them no longer fit a 326px column.
- **Hover / Focus:** the 2px rule takes `{colors.riso-blue}`.
- **The imprint (delight pass):** hovering or focusing a contact link sets its
  address beneath it in the apparatus face — Redaction 20, 13px, 0.75 opacity —
  which is the press's own convention of setting the imprint at the foot of the
  sheet. It is a `::after` with `content: attr(data-imprint)`, fed from
  `src/data/contacts.js`, and it is **absolutely positioned** so the reveal can
  never shift the layout under the cursor. Two declarations are load-bearing:
  `text-transform: none`, because the link is uppercase and an uppercased email
  is a wrong address, and `font-weight: 400`, because Redaction 20 ships one
  weight and the inherited 900 would be synthesised. It also lands in the link's
  accessible name ("EMAIL rajvshahjax@gmail.com"), so it is the one place on the
  surface that tells a screen reader where a link actually goes.

### Facet tags
- **Shape:** zero radius, 4px / 9px padding, 1px border at
  `rgba(11,11,11,0.55)`, no fill.
- **Style:** Martian Mono 11px, 0.12em tracking, uppercase, `{colors.rich-black}`.
- **State:** static labels. They deliberately carry no colour fill — an earlier
  pass colour-coded them per competency and was cut, because the colour decoded
  to nothing a reader could learn.

### Project entry
- **Corner Style:** none.
- **Background:** `{colors.press-paper}`; the image field behind it cycles the
  light inks only (mustard, dusty pink, soft teal, sage) — never the cornflower,
  which is too dark to print dark artwork on.
- **Shadow Strategy:** none; see Elevation & Depth.
- **Border:** a 2px rich black rule across the top of each entry, and a 2px rule
  under the image field.
- **Internal Padding:** spacing in whole 24px units; the run's row gap is 72px.
- **Title:** the misregistered plate treatment at title scale, dialled down to a
  hint — a dusty pink impression at `translate(-0.7px, 0.55px)`, a cornflower one
  at `translate(0.55px, -0.45px)`, both at `opacity: .5`, the rich-black key on
  top, all multiplied so overlaps darken. At full strength this read as anaglyph
  rather than as a press. The type stays live, selectable and searchable; the
  impressions are pseudo-elements carrying the title via `attr()`, not images.
- **Image field:** the ink is laid *through* `tone.png` at 400px — the grain, alpha
  mean 0.70 — so paper reads through roughly 30% of the field, with the same plate
  at 1200px multiplied over it at 0.16 for uneven take-up. Three deposit densities
  cycle by position (1 / 0.86 / 0.94). The texture sits on the field and never
  behind type.
- **Motion:** a row prints as it arrives — the artwork takes its ink, then the fill
  resolves over the field, over 0.7–0.9s. Hovering a printed entry pulls its title
  plates a little further apart (±1.4px / ±1.1px) and takes up more ink — the
  take-up layer goes 0.16 → 0.22. Under `prefers-reduced-motion` the row is simply
  present.
- **Uniformity:** all seven entries are identical in width and treatment. The run
  ends on a ragged half-row rather than promoting an entry to full width — an
  earlier build made the seventh card a two-column feature and it was cut, because
  a run of printed plates reads as a set or not at all.

### Registration mark
Four per sheet, one in each corner of the paper border.
- **Shape:** two 1.5px arms crossing at a 5px filled square. No circle — see Shapes.
- **Style:** `{colors.rich-black}` at 80% opacity, 26px overall.
- **State:** static and decorative. `aria-hidden`, and suppressed below 1080px where
  the border is too narrow to hold one without landing on the copy.

### Running head
The first line of every project entry: its number at the left, its ink chip at the right.
- **Number:** `01`–`07`, zero-padded, in the apparatus face. Catalogue discipline —
  a printed run is numbered, and numbering is also how a reader says "the third one".
- **Case and tracking, deliberately plain.** The numbers were briefly not the only
  apparatus on the sheet; when a slug sat at the foot it taught the lesson that
  applies here too: caps and wide tracking read worse once a string is long enough
  to read rather than scan. The number is two characters, so it is set plainly.
- **Ink chip:** a 12px square in the entry's own ink, set from the same
  `--field-ink` custom property that prints the field. A press declares which ink
  each plate runs on, and this is that declaration. It is a mark rather than a
  field, and it carries no text, so it answers to no contrast ratio.
- **Rule:** the entry's existing 2px rich-black top rule sits above it.

### Spine
The four competencies, running up the paper border.
- **Type:** `{typography.label}`, rotated to read bottom-to-top, Title Case at
  normal tracking. It was all caps and widely tracked to begin with; the detector
  flagged 53 characters of caps as harder to read and then flagged the wide
  tracking once the caps went, and it was right both times. Raj then asked for
  Title Case, which is where it settled — a spine is a reading string before it is
  a label.
- **Placement:** 26px into the 96px paper border, starting at the top margin.
- **Accessibility:** `aria-hidden`. The same four facets are already carried by the
  entry tags, so this copy is marked decorative rather than read twice.
- **Responsive:** withdrawn below 1080px, where the border drops to 32px and the
  spine would land on the copy.

### Masthead plate (signature)
The one place the world explains itself. Three `<text>` elements carry the same
string in three inks, each toned by its own scatter screen applied as a **mask on
the glyphs**, each at its own offset, with the black key plate at `opacity: .86`
so the pink and blue read through it. The screens hold the ink-density hierarchy
the old lattices encoded — key ~68%, pink ~66%, blue ~39% — but their specks are
unequal and blurred by 0.7, so overlapping specks merge into grain instead of
reading as dots. The type stays live, selectable and searchable — the screen is a
mask, never a texture behind text.
On hover the plates separate further; holding Alt latches them fully apart;
scrolling drifts them apart in proportion to velocity and they settle back into
register when the scroll stops. The one secret: a pointer-down on the name (or
`r`) knocks the whole press out of register for a beat, then it settles.

## Do's and Don'ts

### Do:
- **Do** keep every word below display size in `{colors.rich-black}`. It is the
  only ink that clears small-text contrast on this paper (≈15.3:1 as it renders,
  17.75:1 on the bare token), and it clears
  4.5:1 against all five field inks as they actually render under the grain — worst
  case teal at 4.59:1.
- **Do** give an ink a field: a plate, chip, rule, band or image field.
- **Do** size misregistration as a ratio. The offset that reads at 210px is
  invisible at 28px; each size carries the offset it needs (see the
  Scale-Relative Offset Rule).
- **Do** set functional text at 11px or above, and 12px or above once it is roman
  rather than uppercase.
- **Do** keep spacing on the 24px lattice, and let leading follow the size.
- **Do** reach for layer offset or ink density when something needs weight.
- **Do** keep the 2.6:1 image field ratio so a run of projects reads as a set.

### Don't:
- **Don't** use white or pure black. `#FFF` and `#000` are both wrong here.
- **Don't** put colour on small text — mustard (1.79:1), pink (3.15:1), green
  (3.19:1), teal (3.40:1) and the cornflower (2.95:1) all fail, and all five fail
  even the 3:1 large-text threshold. `{colors.blue-deep}` is the single exception
  (4.78:1) and is used only where it is needed.
- **Don't** add a shadow, a blur, or a gradient standing in for elevation.
- **Don't** round a corner. The system has exactly one radius, and it is `0px`.
- **Don't** add a second display face or introduce an italic.
- **Don't** add a second 210px display mass; the masthead is the page's only one.
- **Don't** let a decorative screen or a deposit layer sit behind type anywhere.
- **Don't** let a registration mark land on the copy. Below 1080px the paper border
  is 32px and the marks withdraw rather than crowd the text.
- **Don't** apply the masthead's offset numbers to smaller type. The device is the
  ratio, not the measurement.
