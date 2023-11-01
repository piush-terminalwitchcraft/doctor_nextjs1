import React, { ReactNode } from 'react';
import './style.css';

interface ButtonProps{
    onClick?: () => void;
    children: ReactNode;
    className?: string;
    style?: {}
}


const Button = (props: ButtonProps) => {
    const {onClick, children, className, style} = props; 
  return (
    <div
      onClick={onClick}
      className={`button ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Button;

