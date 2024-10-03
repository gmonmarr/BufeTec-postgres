import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddLawyer from './components/AddLawyer';
import AddClient from './components/AddClient';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-lawyer" element={<AddLawyer />} />
        <Route path="/add-client" element={<AddClient />} />
      </Routes>
    </Router>
  );
}

export default App;
