import React from 'react';
import './ExhibitionPage.scss';
import { Artist, Exhibition, PLACEHOLDER_ARTISTS, PLACEHOLDER_EXHIBITIONS, SITE_DATA } from '../constants';
import ExhibitionItem from '../components/ExhibitionItem';
import { useParams } from 'react-router-dom';
import ArtistList from '../components/ArtistList';
import ExhibitionList from '../components/ExhibitionList';
import Data from '../data/data';
import parse from 'html-react-parser';

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

  const renderHeaderItem = (exhibition: Exhibition) => {
    return (
      <ExhibitionItem 
        exhibition={ exhibition } 
        isLink={ false } 
      />
    )
  }

  // const renderHeaderImage = (exhibition: Exhibition) => {
  //   return (
  //     <div className='header-image'>
  //       <img src={ headerImage } alt='Exhibition header' />
  //     </div>
  //   );
  // }

  // const renderHeaderTitle = (exhibition: Exhibition) => {
  //   return (
  //     <div className='header-title'>
  //       { headerTitle }
  //     </div>
  //   );
  // }

  const renderHeaderDesc = (exhibition: Exhibition) => {
    return (
      <div className='header-desc'>
        { parse(exhibition.desc) }
      </div>
    );
  }

  const renderFeaturedArtists = (exhibition: Exhibition) => {
    const list = Data.artistsFromProjectIds(exhibition.projects);
    return (
      <div className='featured-artists'>
        Featuring work by: <br />
        { <ArtistList artists={ list } /> }
      </div>
    );
  }

  const renderFooterDesc = (exhibition: Exhibition) => {
    return (
      <div className='footer-desc'>
        { parse(exhibition.footer) }
      </div>
    );
  }

  const renderMediaGallery = (exhibition: Exhibition) => {
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
    const exhibition = SITE_DATA.exhibitions.find(exhibition => exhibition.id === id);
    if (!exhibition) {
      return <div>Exhibition not found</div>;
    }
    return (
      <>
        {renderHeaderItem(exhibition)}
        {/* {renderHeaderImage()} */}
        {/* {renderHeaderTitle()} */}
        {renderHeaderDesc(exhibition)}
        {renderFeaturedArtists(exhibition)}
        {renderFooterDesc(exhibition)}
        {renderMediaGallery(exhibition)}
      </>
    )
  }

  const renderExhibitionList = () => {
    return (
      <ExhibitionList exhibitions={ SITE_DATA.exhibitions } />
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