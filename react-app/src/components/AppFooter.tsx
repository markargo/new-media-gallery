import React from 'react';
import './AppFooter.scss';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

interface AppFooterProps {
  // Define your component's props here
}

const AppFooter: React.FC<AppFooterProps> = () => {
  const { id } = useParams();

  return (
    <div className='footer-wrapper'>
        <Link to='https://www.torontomu.ca/new-media/' target='_blank' rel='noopener noreferrer'>
          <img className='footer-logo' src={'/footer/new-media-logo.png'} alt='Logo' />
        </Link>
    </div>
  );
};

export default AppFooter;