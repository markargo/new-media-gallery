import React from 'react';
import './ArtistPage.scss';
import { useParams } from 'react-router-dom';
import ArtistList from '../components/ArtistList';
import { PLACEHOLDER_ARTISTS, PLACEHOLDER_EXHIBITIONS, PLACEHOLDER_IMAGE_LG } from '../constants';
import ExhibitionList from '../components/ExhibitionList';

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

  const renderTextTitle = (text: string) => {
    return (
      <div className='text-header'>
        { text }
      </div>
    );
  }
  
  const renderTextBlock = (text: string) => {
    return (
      <div className='text-block'>
        { text }
      </div>
    );
  }
  
  const renderTextSection = (title: string, text: string) => {
    return (
      <div className='text-section'>
        { renderTextTitle(title) }
        { renderTextBlock(text) }
      </div>
    );
  }

  const renderHeaderImage = () => {
    return (
      <div className='header-image'>
        <img src={PLACEHOLDER_IMAGE_LG} alt='Artist' />
      </div>
    );
  }

  const renderHeaderTitle = () => {
    const artist = PLACEHOLDER_ARTISTS.find(artist => artist.id === id);
    return (
      <div className='header-title'>
        { artist ? artist.name : 'Artist' }
      </div>
    );
  }

  const renderLinks = () => {
    return [
      renderTextTitle('Links'),
      <div className='artist-links'>
        <a href='#'>Website</a>
        <a href='#'>Instagram</a>
        <a href='#'>Twitter</a>
      </div>
    ];
  }

  const renderBio = () => {
    return (
      <div className='artist-bio'>
        { renderTextSection('Bio', 'This is a bio.') }
      </div>
    );
  }

  const renderExhibitions = () => {
    return (
      <div className='artist-exhibitions'>
        { renderTextTitle('Exhibitions') }
        <ExhibitionList exhibitions={PLACEHOLDER_EXHIBITIONS} />
      </div>
    );
  }

  const renderProjects = () => {
    return (
      <div className='artist-projects'>
        { renderTextTitle('Projects') }
      </div>
    );
  }

  const renderArtist = () => {
    return (
      <div>
        { renderHeaderImage() }
        { renderHeaderTitle() }
        { renderBio() }
        { renderLinks() }
        { renderProjects() }
        { renderExhibitions() }
        {/* /* renderHeaderTitle() */
        /* renderHeaderImage() */
        /* renderHeaderDesc() */
        /* renderFeaturedExhibitions() */
        /* renderFeaturedProjects() */
        /* renderFooterDesc() */ }
      </div>
    );
  }

  console.log(id);

  return (
    <div className='artist-page-wrapper'>
      <div className='page-container'>
      {
        id ? renderArtist() : renderArtistList()
      }
      </div>
    </div>
  );
};

export default ArtistPage;