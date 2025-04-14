import React from 'react';
import './ArtistPage.scss';
import { useParams } from 'react-router-dom';
import ArtistList from '../components/ArtistList';
import { Artist, PLACEHOLDER_ARTISTS, PLACEHOLDER_EXHIBITIONS, PLACEHOLDER_IMAGE_LG, Project, SITE_DATA } from '../common';
import ExhibitionList from '../components/ExhibitionList';
import ProjectList from '../components/ProjectList';
import UI from '../common-ui';

interface ArtistPageProps {
  // Define your component's props here
}

const ArtistPage: React.FC<ArtistPageProps> = () => {
  const { id } = useParams();

  const renderArtistList = () => {
    return (
      <ArtistList artists={SITE_DATA.artists} />
    );
  }


  
  const renderTextSection = (title: string, text: string) => {
    return (
      <div className='text-section'>
        { UI.renderTextTitle(title) }
        { UI.renderTextBlock(text) }
      </div>
    );
  }

  const renderHeaderImage = (artist: Artist) => {
    return (
      <div className='header-image'>
        <img src={PLACEHOLDER_IMAGE_LG} alt='Artist' />
        {/* <img src={ project.img } onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER_IMAGE_LG; }} alt={project.name}></img> */}
      </div>
    );
  }

  const renderHeaderTitle = (artist: Artist) => {
    return (
      <div className='header-title'>
        { artist ? artist.name : 'Artist' }
      </div>
    );
  }

  const renderLinks = (artist: Artist) => {
    if (!artist.links || artist.links.length === 0) {
      return null;
    }
    return [
      UI.renderTextTitle('Links'),
      <div className='artist-links'>
        <a href='#'>Website</a>
        <a href='#'>Instagram</a>
        <a href='#'>Twitter</a>
      </div>
    ];
  }

  const renderBio = (artist: Artist) => {
    if (!artist.bio) {
      return null;
    }
    return (
      <div className='artist-bio'>
        { renderTextSection('Bio', 'This is a bio.') }
      </div>
    );
  }

  const renderExhibitions = (artist: Artist) => {
    return (
      <div className='artist-exhibitions'>
        { UI.renderTextTitle('Exhibitions') }
        <ExhibitionList exhibitions={PLACEHOLDER_EXHIBITIONS} />
      </div>
    );
  }

  const renderProjects = (artist: Artist) => {
    if (!artist.projects || artist.projects.length === 0) {
      return null;
    }
    // locate projects in SITE_DATA.projects
    const projects: Project[] = [];
    artist.projects.forEach(projectId => {
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

  const renderArtist = () => {
    const artist = SITE_DATA.artists.find(artist => artist.id === id);
    if (!artist) {
      return <div>Artist not found</div>;
    }
    return (
      <div>
        {/* { renderHeaderImage(artist) } */}
        { renderHeaderTitle(artist) }
        { renderBio(artist) }
        { renderLinks(artist) }
        { renderProjects(artist) }
        {/* { renderExhibitions(artist) } */}
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