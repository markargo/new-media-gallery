import React from 'react';
import './ArtistPage.scss';
import { useParams } from 'react-router-dom';
import { render } from '@testing-library/react';

interface ArtistPageProps {
  // Define your component's props here
}

const ArtistPage: React.FC<ArtistPageProps> = () => {
  const { id } = useParams();

  const renderArtistList = () => {
    return (
      <div className='artist-list-wrapper'>
        <div className='artist-list-item'>
          <a href='/artist/1'>Artist 1</a>
        </div>
        <div className='artist-list-item'>
          <a href='/artist/2'>Artist 2</a>
        </div>
        <div className='artist-list-item'>
          <a href='/artist/3'>Artist 3</a>
        </div>
      </div>
    );
  }

  const renderArtist = () => {
    /* renderHeaderImage() */
    /* renderHeaderTitle() */
    /* renderHeaderDesc() */
    /* renderFeaturedExhibitions() */
    /* renderFeaturedProjects() */
    /* renderFooterDesc() */
    return <></>;
  }

  console.log(id);

  return (
    <div className='artist-page-wrapper'>
      <div className='page-container'>
      {
        id === undefined ? renderArtistList() : renderArtist()
      }
      </div>
    </div>
  );
};

export default ArtistPage;