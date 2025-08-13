# Codebase Guide for `/portfolio`

This repository hosts a personal portfolio site built with [Create React App](https://create-react-app.dev/). It combines React components, Mantine UI, Material UI, D3 visualisations and custom styles to showcase projects and learnings.

## Getting Started

1. **Install dependencies** – use the legacy peer dependency flag to bypass the React 15 requirement of `tableau-react`
   ```bash
   npm install --legacy-peer-deps
   ```
2. **Run the development server** – serves at http://localhost:3000
   ```bash
   npm start
   ```
3. **Run the test suite** – executes tests once (no watch mode)
   ```bash
   npm test -- --watchAll=false --passWithNoTests
   ```
4. **Create a production build**
   ```bash
   npm run build
   ```
5. **Deploy to GitHub Pages** – publishes `build/` to `gh-pages`
   ```bash
   npm run deploy
   ```

## Project Structure

- `src/` – React source
  - `App.js` sets up routing via query parameters rather than `<Route>` components.
  - `components/` – feature components (Home, About, Projects, D3 visualisations, etc.)
  - `pages/` – simple wrappers around component views
  - `styles/` – global CSS (`styles.css`) and font assets
- `public/` – static assets, images and `index.html`

### Styling and UI
- Global styles live in `src/styles/styles.css`; fonts are loaded from the `assets/` folder.
- Components primarily use inline styles and `styled-components`; Mantine and Material UI are available for higher‑level UI primitives.
- When referencing static assets inside React code, prefer `process.env.PUBLIC_URL` (e.g. `process.env.PUBLIC_URL + '/image.png'`).

### Data Visualisations
- `src/components/Projects` contains D3 and Scrollama based visualisations. Many of these render full‑screen stories and should maintain existing styling and scrolling behaviour.

## Development Notes

- Follow the existing component conventions: functional components with PascalCase filenames.
- The application is configured with `react-scripts`; if CRA best practices conflict with current setup, defer to the existing implementation.
- Add tests alongside components when possible; use React Testing Library for unit tests.
- Ensure any new commands or build steps are reflected in this AGENTS file.

## Deployment

The site is deployed to GitHub Pages via the `gh-pages` package. Running `npm run deploy` builds the application and pushes the contents of `build/` to the `gh-pages` branch, making the site available at `https://rajaxar.github.io/portfolio/`.

---
Use this document to record future findings or conventions so that subsequent agents have a clear starting point.
