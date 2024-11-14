import React from 'react';
import './ArtistList.scss';
import { Artist } from '../constants';
import { Link } from 'react-router-dom';

interface ArtistListProps {
  // Define your component's props here
  artists: Artist[];
}

const ArtistList: React.FC<ArtistListProps> = ({ artists }) => {

  return (
    <div className='artist-list-wrapper'>
      {
        artists.map((artist, index) => {
          return (
            <div className='artist-list-item' key={ index }>
              <Link to={ `/artist/${ artist.id }` }>{ artist.name }</Link>
            </div>
          );
        })
      }
    </div>
  );
};

export default ArtistList;