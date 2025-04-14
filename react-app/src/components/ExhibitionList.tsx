import React from 'react';
import './ExhibitionList.scss';
import { Exhibition } from '../common';
import ExhibitionItem from './ExhibitionItem';

interface ExhibitionListProps {
  // Define your component's props here
  exhibitions: Exhibition[];
}

const ArtistList: React.FC<ExhibitionListProps> = ({ exhibitions }) => {

  return (
    <div className='exhibition-list-wrapper'>
      {
        exhibitions.map((ex, index) => {
          return (
            <ExhibitionItem 
              key={ index } 
              exhibition={ ex } 
              isLink={ true }
            />
          );
        })
      }
    </div>
  );
};

export default ArtistList;