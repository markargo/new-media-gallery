import React from 'react';
import './AppFooter.scss';
import { useParams } from 'react-router-dom';

interface AppFooterProps {
  // Define your component's props here
}

const AppFooter: React.FC<AppFooterProps> = () => {
  const { id } = useParams();

  return (
    <div className='footer-wrapper'>
    </div>
  );
};

export default AppFooter;