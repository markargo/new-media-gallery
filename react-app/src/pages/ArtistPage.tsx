import React from 'react';
import './ArtistPage.scss';
import { useParams } from 'react-router-dom';

interface ArtistPageProps {
  // Define your component's props here
}

const ArtistPage: React.FC<ArtistPageProps> = () => {
  const { id } = useParams();

  return (
    <div className='artist-page-wrapper'>
      <h1>Artist Page ({id})</h1>
    </div>
  );
};

export default ArtistPage;