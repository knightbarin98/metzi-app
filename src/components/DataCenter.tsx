import React from 'react';
import './DataCenter.css';

interface ContainerProps { 
  data:string;
}

const ExploreContainer: React.FC<ContainerProps> = ({data}) => {
  return (
    <div className="container">
      <p>{data}</p>
    </div>
  );
};

export default ExploreContainer;
