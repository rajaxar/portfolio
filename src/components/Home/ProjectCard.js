import React from 'react';
import { FACETS } from '../../data/projects';

/**
 * One project, printed.
 *
 * The artwork is duotoned into its field's ink — greyscale, multiplied onto the
 * ink, toned — so it belongs to the same printed world instead of fighting the
 * palette. Only the light inks are used behind it: black artwork on the
 * cornflower fails contrast the same way pale ink on paper does, inverted.
 *
 * Each entry carries a running head: its number in the apparatus face, and a
 * chip of the ink its field is printed in. A proof sheet states which ink each
 * plate runs, and the chip is that statement — colour doing a job at the
 * smallest scale on the page rather than only filling a block.
 *
 * The destination line ("Opens Google Drive") was removed on Raj's call. The
 * `where` field is still in the data because it is genuinely useful and nothing
 * is committed yet, but nothing prints it now.
 */
function ProjectCard({ project, index }) {
  const external = project.external
    ? { target: '_blank', rel: 'noreferrer' }
    : {};
  const number = String(index + 1).padStart(2, '0');

  return (
    <a
      className={`proj field--${project.field}`}
      href={project.link}
      /* The card is one link, so without this its accessible name is the whole
         subtree: the number, the title, the full description and the tags. The
         AX tree read it as a ~40-word string with the title repeated, because
         .proj__title::before/::after carry the text again via attr() to draw the
         pink/blue fringe. Naming the link overrides the subtree, so a screen
         reader gets the project and where it goes. The destination is Raj's own
         `where` string — the words the visible "Opens ___" line used before he
         cut it, kept here because they are the only thing that tells a
         screen-reader user that the link leaves the site. */
      aria-label={`${project.title} — ${project.where}`}
      {...external}
    >
      <div className="proj__head">
        <span className="proj__no">{number}</span>
        <span className="proj__chip" aria-hidden="true" />
      </div>
      <div className="proj__field">
        <img src={process.env.PUBLIC_URL + project.image} alt="" />
      </div>
      <div className="proj__text">
        <h3 className="proj__title" data-title={project.title}>{project.title}</h3>
        <p className="proj__body">{project.description}</p>
        <div className="proj__tags">
          {project.facets.map((facet) => (
            <span key={facet} className="tag">
              {FACETS[facet]}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

export default ProjectCard;
