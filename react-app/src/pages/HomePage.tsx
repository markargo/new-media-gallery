import React from 'react';
import './HomePage.scss';

interface HomePageProps {
  // Define your component's props here
}

const HomePage: React.FC<HomePageProps> = () => {
  return (
    <div className='home-page-wrapper'>
      <h1>Home Page</h1>
    </div>
  );
};

export default HomePage;