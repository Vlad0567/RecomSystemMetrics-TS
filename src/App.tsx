import React, { useEffect } from 'react';
import { HashRouter  as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import InitData from './pages/InitData';
import CalculateData from './pages/CalculateData';
import HybridData from './pages/HybridData';
import './App.css';

import data from './data.json';

function App() {

  useEffect(() => {
    const storedData = localStorage.getItem('data');
    if (!storedData) {
      localStorage.setItem('data', JSON.stringify(data));
      console.log('Данные записаны в localStorage');
    } else {
      console.log('Данные уже есть в localStorage');
    }
  }, []);

  return (
    <Router>
      <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/InitData" element={<InitData />} />
        <Route path="/CalculateData" element={<CalculateData />} />
        <Route path="/HybridData" element={<HybridData />} />
      </Routes>  
      </div>
    </Router>
  );
}

export default App;
