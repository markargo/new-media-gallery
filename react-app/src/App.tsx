import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.scss';

import HomePage from './pages/HomePage';
import ArtistPage from './pages/ArtistPage';
import ProjectPage from './pages/ProjectPage';
import ExhibitionPage from './pages/ExhibitionPage';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className='app-wrapper'>
        <Header />


        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exhibition/:id" element={<ExhibitionPage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/project/:id" element={<ProjectPage />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
