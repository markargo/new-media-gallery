import React, { useEffect } from 'react';
import './HomePage.scss';
import ExhibitionItem from '../components/ExhibitionItem';
import Data from '../data/data';

interface HomePageProps {
  // Define your component's props here
}

const HomePage: React.FC<HomePageProps> = () => {

  const exhibitions = Data.allExhibitions();

  const renderFeaturedExhibitions = () => {
    return (
      <div className='featured-exhibitions'>
        { 
          exhibitions.map((ex, index) => {            
            return ex.isFeatured ? (
              <ExhibitionItem key={ ex.id } exhibition={ ex } isLink={ true } hideTitle={true} />
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