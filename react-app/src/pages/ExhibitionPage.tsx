import React from 'react';
import './ExhibitionPage.scss';
import { Artist, Exhibition, PLACEHOLDER_ARTISTS, PLACEHOLDER_EXHIBITIONS, Project, SITE_DATA } from '../common';
import ExhibitionItem from '../components/ExhibitionItem';
import { useParams } from 'react-router-dom';
import ArtistList from '../components/ArtistList';
import ExhibitionList from '../components/ExhibitionList';
import Data from '../data/data';
import parse from 'html-react-parser';
import UI from '../common-ui';
import ProjectList from '../components/ProjectList';
import { render } from '@testing-library/react';

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
    if (!exhibition.mediaGallery || exhibition.mediaGallery.length === 0) {
      return null;
    }
    return (
      <div className='media-gallery-wrapper'>
        <div>
          Media Gallery:
        </div>
        <div className='media-gallery'>
          {
            exhibition.mediaGallery.map((media, index) => {
              return (
                <img key={ index } src={ media } alt='Media gallery item' />
              );
            })
          }
        </div>
      </div>
    );
  }

  const renderProjects = (exhibition: Exhibition) => {
    if (!exhibition.projects || exhibition.projects.length === 0) {
      return null;
    }
    // locate projects in SITE_DATA.projects
    const projects: Project[] = [];
    exhibition.projects.forEach(projectId => {
      const project = SITE_DATA.projects.find(project => project.id === projectId);
      if (project) {
        projects.push(project);
      }
    });

      return (
      <div className='artist-projects'>
        { UI.renderTextTitle('Projects') }
        <ProjectList projects={projects} />
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
        {renderProjects(exhibition)}
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