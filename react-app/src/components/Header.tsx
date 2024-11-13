import React from 'react';
import './Header.scss';
import { Link, useParams } from 'react-router-dom';

interface HeaderProps {
  // Define your component's props here
}

const Header: React.FC<HeaderProps> = () => {
  const { id } = useParams();

  return (
    <div className='app-header-wrapper'>
      <div className='app-header-title'>
        new media
      </div>
      <div className='app-header-nav'>
        <Link to='/'>Home</Link>&nbsp;|&nbsp; 
        <Link to='/exhibition/1'>Exhibitions</Link>&nbsp;|&nbsp;
        <Link to='/artist/1'>Artists</Link>&nbsp;|&nbsp;
        <Link to='/project/1'>Projects</Link>
      </div>
    </div>
  );
};

export default Header;