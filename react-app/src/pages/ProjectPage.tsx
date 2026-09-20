import React from 'react';
import './ProjectPage.scss';
import { Link, useParams } from 'react-router-dom';
import ExhibitionList from '../components/ExhibitionList';
import { Artist, PLACEHOLDER_ARTISTS, PLACEHOLDER_EXHIBITIONS, PLACEHOLDER_IMAGE_LG, PLACEHOLDER_PROJECTS, Project, SITE_DATA, UNKNOWN_ARTIST } from '../common';
import ProjectList from '../components/ProjectList';
import parse from 'html-react-parser';
import Data from '../data/data';

interface ProjectPageProps {

}

const ProjectPage: React.FC<ProjectPageProps> = () => {
  const { id } = useParams();

  // Lightbox state: which set of images is open, and the active index.
  const [lightbox, setLightbox] = React.useState<{ images: string[]; index: number } | null>(null);

  const closeLightbox = React.useCallback(() => setLightbox(null), []);

  const stepLightbox = React.useCallback((delta: number) => {
    setLightbox(prev =>
      prev
        ? { ...prev, index: (prev.index + delta + prev.images.length) % prev.images.length }
        : prev
    );
  }, []);

  // Keyboard controls + body scroll lock while the lightbox is open.
  React.useEffect(() => {
    if (!lightbox) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeLightbox(); }
      else if (e.key === 'ArrowRight') { stepLightbox(1); }
      else if (e.key === 'ArrowLeft') { stepLightbox(-1); }
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox, closeLightbox, stepLightbox]);


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

  const renderHeaderImage = (project: Project) => {
    console.log(project.img);
    return (
      <div className='header-image'>
        {/* <img src={PLACEHOLDER_IMAGE_LG} alt='Artist' /> */}
        <img src={ '/' + project.img } onError={(e) => { console.error('issue with header image'); e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER_IMAGE_LG; }} alt={project.name}></img>
      </div>
    );
  }

  const renderHeaderTitle = (project: Project) => {
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

  const renderLinks = (project: Project) => {
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

  const renderStatement = (project: Project) => {
    return (
      <div className='project-statement'>
        { renderTextBlock(project?.desc || '') }
      </div>
    );
  }

  const renderGallery = (project: Project) => {
    const images = project?.mediaGallery ?? [];
    if (images.length === 0) {
      return null;
    }
    return (
      <div className='project-gallery'>
        { renderTextTitle('Gallery') }
        <div className='gallery-grid'>
          {
            images.map((src, index) => (
              <button
                type='button'
                className='gallery-tile'
                key={ index }
                onClick={ () => setLightbox({ images, index }) }
                aria-label={ `View image ${index + 1} of ${images.length}` }
              >
                <img
                  src={ '/' + src }
                  alt={ `${project.name} — image ${index + 1}` }
                  loading='lazy'
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER_IMAGE_LG; }}
                />
              </button>
            ))
          }
        </div>
      </div>
    );
  }

  const renderLightbox = () => {
    if (!lightbox) {
      return null;
    }
    const { images, index } = lightbox;
    const hasMany = images.length > 1;
    return (
      <div className='lightbox' role='dialog' aria-modal='true' onClick={ closeLightbox }>
        <button className='lightbox-close' type='button' aria-label='Close' onClick={ closeLightbox }>
          &times;
        </button>
        {
          hasMany &&
          <button
            className='lightbox-nav lightbox-prev'
            type='button'
            aria-label='Previous image'
            onClick={(e) => { e.stopPropagation(); stepLightbox(-1); }}
          >
            &#8249;
          </button>
        }
        <img
          className='lightbox-image'
          src={ '/' + images[index] }
          alt={ `Image ${index + 1} of ${images.length}` }
          onClick={(e) => e.stopPropagation()}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER_IMAGE_LG; }}
        />
        {
          hasMany &&
          <button
            className='lightbox-nav lightbox-next'
            type='button'
            aria-label='Next image'
            onClick={(e) => { e.stopPropagation(); stepLightbox(1); }}
          >
            &#8250;
          </button>
        }
        {
          hasMany &&
          <div className='lightbox-counter' onClick={(e) => e.stopPropagation()}>
            { index + 1 } / { images.length }
          </div>
        }
      </div>
    );
  }

  const renderExhibitions = (project: Project) => {
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
    if (!project) {
      return <div>Project not found</div>;
    }
    return (
      <div>
        { renderHeaderImage(project) }
        { renderHeaderTitle(project) }
        { renderStatement(project) }
        { renderGallery(project) }
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

  const renderProjectList = () => {
    return (
      <ProjectList projects={Data.allProjects()} />
    );
  }


  return (
    <div className='project-page-wrapper'>
      <div className='page-container'>
      {
        id ? renderProject() : renderProjectList()
      }
      </div>
      { renderLightbox() }
    </div>
  );

};

export default ProjectPage;
