import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
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
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/exhibition/" element={<ExhibitionPage />} />
          <Route path="/exhibition/:id" element={<ExhibitionPage />} />
          <Route path="/artist/" element={<ArtistPage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/project/" element={<ProjectPage />} />
          <Route path="/project/:id" element={<ProjectPage />} />
          <Route path="/" element={<Navigate to={"/exhibition/metamorphosis"} replace />}/>
        </Routes>
        {/* <AppFooter /> */}
      </div>
    </Router>
  );
}

export default App;
