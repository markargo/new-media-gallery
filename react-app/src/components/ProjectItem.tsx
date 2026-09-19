import React from 'react';
import './ProjectItem.scss';
import { PLACEHOLDER_IMAGE_LG, Project } from '../common';
import { Link } from 'react-router-dom';

interface ProjectItemProps {
  isLink?: boolean;
  maxNameLength?: number;
  project: Project;
}

const DEFAULT_MAX_NAME_LENGTH = 32;

const truncateName = (name: string, maxLength: number) => {
  if (name.length <= maxLength) {
    return name;
  }

  if (maxLength <= 3) {
    return name.slice(0, maxLength);
  }

  return `${name.slice(0, maxLength - 3)}...`;
};

const ProjectItem: React.FC<ProjectItemProps> = ({
  project,
  isLink = false,
  maxNameLength = DEFAULT_MAX_NAME_LENGTH,
}) => {

  const renderContents = () => {
    return (
      <div className='project-item-contents'>
        {/* <img src={ project.img } alt='Project' /> */}
        <img src={ '/' + project.img } onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER_IMAGE_LG; }} alt={project.name}></img>
        <div className='project-item-title'>
          { truncateName(project.name, maxNameLength) }
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