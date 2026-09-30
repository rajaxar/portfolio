/**
 * How to reach Raj.
 *
 * Both are real now. The wording stays bare — "Email", "LinkedIn" — because the
 * confirmed product constraint is that a contact route exists on this site AND
 * that the site never reads as an active job search. No availability language,
 * no badges, nothing a current employer could read as notice.
 */

const contacts = [
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:rajvshahjax@gmail.com',
    // The imprint: what the press sets at the foot of the sheet. Printed on
    // hover/focus in the apparatus face, so a reader who wants the address in a
    // tracking sheet can read it without opening a mail client first.
    imprint: 'rajvshahjax@gmail.com',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/raj-v-shah/',
    external: true,
    imprint: 'linkedin.com/in/raj-v-shah',
  },
];

export default contacts;
