import React from 'react';
import './AppHeader.scss';
import { Link, useParams } from 'react-router-dom';

interface AppHeaderProps {
  // Define your component's props here
}

const AppHeader: React.FC<AppHeaderProps> = () => {
  const { id } = useParams();

  return (
    <div className='app-header-wrapper'>
      <div className='app-header-title'>
        <Link to='/'>new media</Link>
      </div>
      <div className='app-header-nav'>
        <Link to='/exhibition/1'>Exhibitions</Link>&nbsp;|&nbsp;
        <Link to='/artist/1'>Artists</Link>&nbsp;|&nbsp;
        <Link to='/project/1'>Projects</Link>
      </div>
    </div>
  );
};

export default AppHeader;