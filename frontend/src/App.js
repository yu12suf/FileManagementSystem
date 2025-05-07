// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import FilesView from "./FilesView";
import Report3 from "./Report3";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/FilesView" element={<FilesView />} />
        <Route path="/Report3" element={<Report3 />} />
      </Routes>
    </Router>
  );
};

export default App;
