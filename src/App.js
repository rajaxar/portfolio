import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import './styles/styles.css';
import '@mantine/core/styles.css';
import Layout from "./components/Layout";
import Home from "./components/Home";
import About from "./components/About";
import Learnings from "./components/Learnings";
import Projects from "./components/Projects";
import NBAWireframe from "./components/Projects/nba_contract";

function App() {
  let windowDict = {};
  try {
    windowDict = window.location.search.split('?')[1].split('&').reduce((acc, curr) => {
      const [key, value] = curr.split('=');
      acc[key] = value;
      return acc;
    }, {});
  } catch (e) {}
  const [page, setPage] = useState(windowDict.ref? windowDict.ref : '');
  let Component;
  switch (page) {
    case 'home':
      Component = Home;
      break;
    case 'about':
      Component = About;
      break;
    case 'learnings':
      Component = Learnings;
      break;
    case 'projects':
      Component = Projects;
      break;
    case 'nba_contract':
      Component = NBAWireframe;
      break;
    default:
      Component = Home;
  }

  return (
    <Router>
      <Layout setPage={setPage} page={page}>
        <Component windowDict={windowDict}/>
      </Layout>
    </Router>
  );
}

export default App;
