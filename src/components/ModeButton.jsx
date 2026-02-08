import React from 'react';

const ModeButton = ({ mode, active, onClick, children }) => {
  return (
    <button 
      className={`mode-btn ${active ? 'active' : ''}`} 
      onClick={() => onClick(mode)}
    >
      {children}
    </button>
  );
};

export default ModeButton;
