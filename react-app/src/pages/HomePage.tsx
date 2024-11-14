import React, { useEffect } from 'react';
import './HomePage.scss';
import { PLACEHOLDER_EXHIBITIONS } from '../constants';
import ExhibitionItem from '../components/ExhibitionItem';

interface HomePageProps {
  // Define your component's props here
}

const HomePage: React.FC<HomePageProps> = () => {

  const exhibitions = PLACEHOLDER_EXHIBITIONS;

  const renderFeaturedExhibitions = () => {
    return (
      <div className='featured-exhibitions'>
        { 
          exhibitions.map((ex, index) => {            
            return ex.isFeatured ? (
              <ExhibitionItem key={ ex.id } exhibition={ ex } isLink={ true } />
            ) : null;
          })
        }
      </div>
    );
  }

  return (
    <div className='home-page-wrapper'>
      <div className='page-container'>
        { renderFeaturedExhibitions() }
      </div>
    </div>
  );
};

export default HomePage;