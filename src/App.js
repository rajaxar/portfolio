import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import './styles/styles.css';
import './styles/riso.css';
import '@mantine/core/styles.css';
import Layout from "./components/Layout";
import Home from "./components/Home";
import NBAWireframe from "./components/Projects/nba_contract";
import SurvivorBlog from "./components/Projects/survivor_blog";
import { applyHead, pageFromLocation, urlFor } from "./lib/seo";

const SURFACES = {
  home: Home,
  nba_contract: NBAWireframe,
  survivor: SurvivorBlog,
};

function App() {
  // The address decides what renders. The two stories own real paths now
  // (/nba-contract-year/, /survivor-diversity/); the old ?ref= form resolves to
  // the same surfaces, because every link shared before today points at it.
  const [page, setPage] = useState(pageFromLocation);

  // The surfaces that still read a dictionary off the query string take it as a
  // prop, so it is still assembled here.
  let windowDict = {};
  try {
    windowDict = window.location.search.split('?')[1].split('&').reduce((acc, curr) => {
      const [key, value] = curr.split('=');
      acc[key] = value;
      return acc;
    }, {});
  } catch (e) {}

  // The page owns the document head: title, description, share card, canonical
  // and structured data. In the prerender step this runs before the HTML is
  // serialised, which is the whole point of the exercise.
  useEffect(() => { applyHead(page); }, [page]);

  // Navigating is a real navigation. Without the pushState the address bar
  // never moves, so a reader who copies the URL copies the wrong page and a
  // crawler only ever sees one of them.
  const navigate = useCallback((next) => {
    const target = SURFACES[next] ? next : 'home';
    setPage(target);
    const url = urlFor(target);
    if (window.location.pathname !== url) {
      window.history.pushState({ page: target }, '', url);
    }
  }, []);

  // Back and forward have to land somewhere real too.
  useEffect(() => {
    const sync = () => setPage(pageFromLocation());
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  // Arrived on the old ?ref= address: swap it for the real one without adding
  // a history entry, so the reader's address bar names the page they are on.
  useEffect(() => {
    const legacy = new URLSearchParams(window.location.search).get('ref');
    if (legacy && window.location.pathname !== urlFor(pageFromLocation())) {
      window.history.replaceState({ page }, '', urlFor(pageFromLocation()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Component = SURFACES[page] || Home;

  return (
    <Router>
      <Layout setPage={navigate} page={page}>
        <Component windowDict={windowDict} />
      </Layout>
    </Router>
  );
}

export default App;
