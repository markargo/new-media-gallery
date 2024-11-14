import React from 'react';
import './ExhibitionList.scss';
import { Project } from '../constants';
import ProjectItem from './ProjectItem';

interface ProjectListProps {
  // Define your component's props here
  projects: Project[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {

  return (
    <div className='project-list-wrapper'>
      {
        projects.map((project, index) => {
          return (
            <ProjectItem 
              key={ index } 
              project={ project } 
              isLink={ true }
            />
          );
        })
      }
    </div>
  );
};

export default ProjectList;