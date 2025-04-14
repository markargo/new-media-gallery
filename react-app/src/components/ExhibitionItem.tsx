import React from 'react';
import './ExhibitionItem.scss';
import { Exhibition, PLACEHOLDER_IMAGE_LG } from '../constants';
import { Link } from 'react-router-dom';

interface ExhibitionItemProps {
  isLink?: boolean;
  hideTitle?: boolean;
  exhibition: Exhibition;
}

const ExhibitionItem: React.FC<ExhibitionItemProps> = ({ exhibition, isLink=false, hideTitle=false }) => {

  const renderTitle = () => {
    return (
      <div className='exhibition-item-title'>
        { exhibition.name }
      </div>
    )
  }

  const renderContents = () => {
    return (
      <div className='exhibition-item-contents'>
        {/* <img src={ exhibition.img } alt='Exhibition' /> */}
        <img src={ '/' + exhibition.img } onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER_IMAGE_LG; }} alt={exhibition.name}></img>        
        { !hideTitle ? renderTitle() : null }
      </div>
    )
  }

  return (
    <div className='exhibition-item-wrapper'>
      <div className='exhibition-item'>
        { 
          isLink ? 
          <Link to={`/exhibition/${exhibition.id}`}>
            { renderContents() }
          </Link> 
          : renderContents() 
        }
      </div>
    </div>
  );
};

export default ExhibitionItem;