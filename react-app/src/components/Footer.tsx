import React from 'react';
import './Footer.scss';
import { useParams } from 'react-router-dom';

interface FooterProps {
  // Define your component's props here
}

const Footer: React.FC<FooterProps> = () => {
  const { id } = useParams();

  return (
    <div className='footer-wrapper'>
    </div>
  );
};

export default Footer;