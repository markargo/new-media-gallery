import React from 'react';
import './ExhibitionPage.scss';
import { Artist, PLACEHOLDER_ARTISTS, PLACEHOLDER_EXHIBITIONS } from '../constants';

interface ExhibitionPageProps {
  // Define your component's props here
}

const ExhibitionPage: React.FC<ExhibitionPageProps> = () => {

  const [headerImage, setHeaderImage] = React.useState<string>(PLACEHOLDER_EXHIBITIONS[0].img);
  const [headerTitle, setHeaderTitle] = React.useState<string>(PLACEHOLDER_EXHIBITIONS[0].name);
  const [headerDesc, setHeaderDesc] = React.useState<string>(PLACEHOLDER_EXHIBITIONS[0].desc);
  const [featuredArtists, setFeaturedArtists] = React.useState<Artist[]>(PLACEHOLDER_ARTISTS);
  const [footerDesc, setFooterDesc] = React.useState<string>(PLACEHOLDER_EXHIBITIONS[0].footer);
  const [mediaGallery, setMediaGallery] = React.useState<string[]>(PLACEHOLDER_EXHIBITIONS[0].mediaGallery);

  const renderHeaderImage = () => {
    return (
      <div className='header-image'>
        <img src={ headerImage } alt='Exhibition header' />
      </div>
    );
  }

  const renderHeaderTitle = () => {
    return (
      <div className='header-title'>
        { headerTitle }
      </div>
    );
  }

  const renderHeaderDesc = () => {
    return (
      <div className='header-desc'>
        { headerDesc }
      </div>
    );
  }

  const renderArtistList = (list: Artist[]) => {
    return (
      <div className='artist-list-wrapper'>
        {
          list.map((artist, index) => {
            return (
              <div key={ artist.id } className='artist-list-item'>
                <a href={`/artist/${artist.id}`}>{ artist.name }</a>
              </div>
            );
          }
        )}
      </div>
    )
  }

  const renderFeaturedArtists = () => {
    return (
      <div className='featured-artists'>
        Featuring work by: <br />
        { renderArtistList(featuredArtists) }
      </div>
    );
  }

  const renderFooterDesc = () => {
    return (
      <div className='footer-desc'>
        { footerDesc }
      </div>
    );
  }

  const renderMediaGallery = () => {
    return (
      <div className='media-gallery-wrapper'>
        <div>
          Media Gallery:
        </div>
        <div className='media-gallery'>
          {
            mediaGallery.map((media, index) => {
              return (
                <img key={ index } src={ media } alt='Media gallery item' />
              );
            })
          }
        </div>
      </div>
    );
  }

  return (
    <div className='exhibition-page-wrapper'>
      <div className='page-container'>
        {renderHeaderImage()}
        {renderHeaderTitle()}
        {renderHeaderDesc()}
        {renderFeaturedArtists()}
        {renderFooterDesc()}
        {renderMediaGallery()}
      </div>
    </div>
  );
};

export default ExhibitionPage;