import React from 'react';
import './ProjectItem.scss';
import { PLACEHOLDER_IMAGE_LG, Project } from '../constants';
import { Link } from 'react-router-dom';

interface ProjectItemProps {
  isLink?: boolean;
  project: Project;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, isLink=false, }) => {

  const renderContents = () => {
    return (
      <div className='project-item-contents'>
        {/* <img src={ project.img } alt='Project' /> */}
        <img src={ '/' + project.img } onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER_IMAGE_LG; }} alt={project.name}></img>
        <div className='project-item-title'>
          { project.name }
        </div>
      </div>
    )
  }

  return (
    <div className='project-item-wrapper'>
      <div className='project-item'>
        { 
          isLink ? 
          <Link to={`/project/${project.id}`}>
            { renderContents() }
          </Link> 
          : renderContents() 
        }
      </div>
    </div>
  );
};

export default ProjectItem;