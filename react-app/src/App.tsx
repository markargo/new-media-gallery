import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.scss';

import HomePage from './pages/HomePage';
import ArtistPage from './pages/ArtistPage';
import ProjectPage from './pages/ProjectPage';

function App() {
  return (
    <Router>
      <div className='app-wrapper'>
        <div className='app-navigation'>
          <Link to='/'>Home</Link>&nbsp;|&nbsp; 
          <Link to='/artist/1'>Artist</Link>&nbsp;|&nbsp;
          <Link to='/project/1'>Project</Link>
        </div>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/artist/:id" element={<ArtistPage />} />
          <Route path="/project/:id" element={<ProjectPage />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
