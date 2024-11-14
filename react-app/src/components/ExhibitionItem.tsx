import React from 'react';
import './ExhibitionItem.scss';
import { Exhibition } from '../constants';

interface ExhibitionItemProps {
  isLink?: boolean;
  exhibition: Exhibition;
}

const ExhibitionItem: React.FC<ExhibitionItemProps> = ({ exhibition, isLink=false, }) => {

  const renderContents = () => {
    return (
      <div className='exhibition-item-contents'>
        <img src={ exhibition.img } alt='Exhibition' />
        <div className='exhibition-item-title'>
          { exhibition.name }
        </div>
      </div>
    )
  }

  return (
    <div className='exhibition-item-wrapper'>
      <div className='exhibition-item'>
        { 
          isLink ? 
          <a href={`/exhibition/${exhibition.id}`}>
            { renderContents() }
          </a> 
          : renderContents() 
        }
      </div>
    </div>
  );
};

export default ExhibitionItem;