import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.scss';

import HomePage from './pages/HomePage';
import ArtistPage from './pages/ArtistPage';
import ProjectPage from './pages/ProjectPage';
import ExhibitionPage from './pages/ExhibitionPage';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';

function App() {
  return (
    <Router>
      <div className='app-wrapper'>
        <AppHeader />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exhibition/:id" element={<ExhibitionPage />} />
          <Route path="/artist/" element={<ArtistPage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/project/:id" element={<ProjectPage />} />
        </Routes>
        <AppFooter />
      </div>
    </Router>
  );
}

export default App;
