import React from 'react';
import './ExhibitionPage.scss';
import { Artist, PLACEHOLDER_ARTISTS, PLACEHOLDER_EXHIBITIONS } from '../constants';
import ExhibitionItem from '../components/ExhibitionItem';
import { useParams } from 'react-router-dom';
import ArtistList from '../components/ArtistList';

interface ExhibitionPageProps {
  // Define your component's props here
}

const ExhibitionPage: React.FC<ExhibitionPageProps> = () => {

  const { id } = useParams();

  const [headerImage, setHeaderImage] = React.useState<string>(PLACEHOLDER_EXHIBITIONS[0].img);
  const [headerTitle, setHeaderTitle] = React.useState<string>(PLACEHOLDER_EXHIBITIONS[0].name);
  const [headerDesc, setHeaderDesc] = React.useState<string>(PLACEHOLDER_EXHIBITIONS[0].desc);
  const [featuredArtists, setFeaturedArtists] = React.useState<Artist[]>(PLACEHOLDER_ARTISTS);
  const [footerDesc, setFooterDesc] = React.useState<string>(PLACEHOLDER_EXHIBITIONS[0].footer);
  const [mediaGallery, setMediaGallery] = React.useState<string[]>(PLACEHOLDER_EXHIBITIONS[0].mediaGallery);

  const renderHeaderItem = () => {
    return (
      <ExhibitionItem 
        exhibition={ PLACEHOLDER_EXHIBITIONS[0] } 
        isLink={ false } 
      />
    )
  }

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
      <ArtistList artists={ list } />
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

  const renderExhibition = () => {
    return (
      <>
        {renderHeaderItem()}
        {/* {renderHeaderImage()} */}
        {/* {renderHeaderTitle()} */}
        {renderHeaderDesc()}
        {renderFeaturedArtists()}
        {renderFooterDesc()}
        {renderMediaGallery()}
      </>
    )
  }

  const renderExhibitionList = () => {
    return (
      <div className='exhibition-list'>
        { PLACEHOLDER_EXHIBITIONS.map((ex, index) => {
          return (
            <ExhibitionItem 
              key={ ex.id } 
              exhibition={ ex } 
              isLink={ true } 
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className='exhibition-page-wrapper'>
      <div className='page-container'>
        { id ? renderExhibition() : renderExhibitionList() }
      </div>
    </div>
  );
};

export default ExhibitionPage;