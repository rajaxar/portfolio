import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import './styles/styles.css';
import Layout from "./components/Layout";
import Home from "./components/Home";
import About from "./components/About";
import Learnings from "./components/Learnings";
import Projects from "./components/Projects";

function App() {
  const [page, setPage] = useState("");
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
    default:
      Component = Home;
  }

  return (
    <Router>
      <Layout setPage={setPage} page={page}>
        <Component />
      </Layout>
    </Router>
  );
}

export default App;
