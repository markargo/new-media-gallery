import React, { useEffect } from 'react';
import './HomePage.scss';
import { PLACEHOLDER_EXHIBITIONS } from '../constants';

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
              <div key={ ex.id } className='exhibition-item'>
                <a href={`/exhibition/${ex.id}`}>
                  <img src={ ex.img } alt='Exhibition' />
                  <div className='exhibition-title'>
                    { ex.name }
                  </div>
                </a>
              </div>
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