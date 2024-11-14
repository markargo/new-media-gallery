import React from 'react';
import './ProjectItem.scss';
import { Project } from '../constants';
import { Link } from 'react-router-dom';

interface ProjectItemProps {
  isLink?: boolean;
  project: Project;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, isLink=false, }) => {

  const renderContents = () => {
    return (
      <div className='project-item-contents'>
        <img src={ project.img } alt='Project' />
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