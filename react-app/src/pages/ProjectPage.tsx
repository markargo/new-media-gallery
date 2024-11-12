import React from 'react';
import './ProjectPage.scss';
import { useParams } from 'react-router-dom';

interface ProjectPageProps {

}

const ProjectPage: React.FC<ProjectPageProps> = () => {
  const { id } = useParams();

  return (
    <div className='project-page-wrapper'>
      <h1>Project Page ({id})</h1>
    </div>
  );
};

export default ProjectPage;