import React from 'react';
import './ProjectPage.scss';
import { Link, useParams } from 'react-router-dom';
import ExhibitionList from '../components/ExhibitionList';
import { Artist, PLACEHOLDER_ARTISTS, PLACEHOLDER_EXHIBITIONS, PLACEHOLDER_IMAGE_LG, PLACEHOLDER_PROJECTS, Project, SITE_DATA, UNKNOWN_ARTIST } from '../constants';
import ProjectList from '../components/ProjectList';
import parse from 'html-react-parser';

interface ProjectPageProps {

}

const ProjectPage: React.FC<ProjectPageProps> = () => {
  const { id } = useParams();


  const renderProjectList = () => {
    return (
      <ProjectList projects={SITE_DATA.projects} />
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
        { parse(text) }
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

  const renderHeaderImage = (project: Project | undefined) => {
    if (!project) {
      return (
        <div className='header-image'>
          <img src={PLACEHOLDER_IMAGE_LG} alt='Artist' />
        </div>
      );
    }
    return (
      <div className='header-image'>
        {/* <img src={PLACEHOLDER_IMAGE_LG} alt='Artist' /> */}
        <img src={ project.img } onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER_IMAGE_LG; }} alt={project.name}></img>
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
            const artist = SITE_DATA.artists.find(a => a.id === aid) || UNKNOWN_ARTIST;
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

  const renderLinks = (project: Project | undefined) => {
    if (!project || !project.links || project.links.length === 0) {
      return null;
    }

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

  const renderExhibitions = (project: Project | undefined) => {
    if (!project || !project.exhibitions || project.exhibitions.length === 0) {
      return null;
    }
    return (
      <div className='artist-exhibitions'>
        { renderTextTitle('Exhibitions') }
        <ExhibitionList exhibitions={SITE_DATA.exhibitions.filter(ex => project?.exhibitions.includes(ex.id))} />
      </div>
    );
  }

  const renderProject = () => {
    const project = SITE_DATA.projects.find(proj => proj.id === id);
    return (
      <div>
        { renderHeaderImage(project) }
        { renderHeaderTitle(project) }
        { renderStatement(project) }
        { renderLinks(project) }
        { renderExhibitions(project) }
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