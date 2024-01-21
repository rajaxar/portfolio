import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Index from "./pages";
import './styles/styles.css';
import Layout from "./components/Layout";

function App() {
  return (
    <Router
      style={{
        "width": "100dvw",
        "height": "100dvh",
      }}
    >
        <Layout>
          <Routes>
              <Route exact path="/" element={<Index />} />
          </Routes>
        </Layout>
    </Router>
);
}

export default App;
