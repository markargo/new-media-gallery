import React from 'react';
import './ProjectPage.scss';
import { Link, useParams } from 'react-router-dom';
import ExhibitionList from '../components/ExhibitionList';
import { Artist, PLACEHOLDER_ARTISTS, PLACEHOLDER_EXHIBITIONS, PLACEHOLDER_IMAGE_LG, PLACEHOLDER_PROJECTS, Project } from '../constants';
import ProjectList from '../components/ProjectList';
import { render } from '@testing-library/react';

interface ProjectPageProps {

}

const ProjectPage: React.FC<ProjectPageProps> = () => {
  const { id } = useParams();


  const renderProjectList = () => {
    return (
      <ProjectList projects={PLACEHOLDER_PROJECTS} />
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

  const renderHeaderTitle = (project: Project | undefined) => {
    return [
      <div className='header-title'>
        { project ? project.name : 'Project' }
      </div>,
      <div className='header-title-artists'>
        by&nbsp; 
        { 
          project?.artists.map((aid, index) => {
            const artist = PLACEHOLDER_ARTISTS.find(a => a.id === aid);
            const bits: JSX.Element[] = [
              <Link key={ index } to={'/artist/'+artist?.id}>
                { artist?.name }
              </Link>
            ];
            if (project.artists.length > 1 && index < project.artists.length - 2) {
              bits.push(<span key={ index + 1 }>,&nbsp;</span>);
            }
            else if (index === project.artists.length - 2) {
              bits.push(<span key={ index + 1 }> and </span>);
            }
            return (bits);
          })
        }
      </div>
    ];
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

  const renderStatement = (project: Project | undefined) => {
    return (
      <div className='project-statement'>
        { renderTextBlock(project?.desc || '') }
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

  const renderProject = () => {
    const project = PLACEHOLDER_PROJECTS.find(proj => proj.id === id);
    return (
      <div>
        { renderHeaderImage() }
        { renderHeaderTitle(project) }
        { renderStatement(project) }
        { renderLinks() }
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
    <div className='project-page-wrapper'>
      <div className='page-container'>
      {
        id ? renderProject() : renderProjectList()
      }
      </div>
    </div>
  );

};

export default ProjectPage;