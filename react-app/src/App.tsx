import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.scss';

import HomePage from './pages/HomePage';
import ArtistPage from './pages/ArtistPage';
import ProjectPage from './pages/ProjectPage';
import ExhibitionPage from './pages/ExhibitionPage';

function App() {
  return (
    <Router>
      <div className='app-wrapper'>
        <div className='app-navigation'>
          <Link to='/'>Home</Link>&nbsp;|&nbsp; 
          <Link to='/exhibition/1'>Exhibitions</Link>&nbsp;|&nbsp;
          <Link to='/artist/1'>Artists</Link>&nbsp;|&nbsp;
          <Link to='/project/1'>Projects</Link>
        </div>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exhibition/:id" element={<ExhibitionPage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/project/:id" element={<ProjectPage />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
