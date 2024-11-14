import React from 'react';
import './ArtistPage.scss';
import { useParams } from 'react-router-dom';
import { render } from '@testing-library/react';
import ArtistList from '../components/ArtistList';
import { PLACEHOLDER_ARTISTS } from '../constants';

interface ArtistPageProps {
  // Define your component's props here
}

const ArtistPage: React.FC<ArtistPageProps> = () => {
  const { id } = useParams();

  const renderArtistList = () => {
    return (
      <ArtistList artists={PLACEHOLDER_ARTISTS} />
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