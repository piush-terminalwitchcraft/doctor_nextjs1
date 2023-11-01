import React from 'react';
import './../../globals.css'
interface SpacerProps {
  width: string;
}

const Spacer: React.FC<SpacerProps> = ({ width }) => {
  return <div className={width + ' background-highlight'} />;
};

export default Spacer;

