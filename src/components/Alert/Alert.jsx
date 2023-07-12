import React, { useState, useEffect } from 'react';
import './Alert.css';

const Alert = ({ message }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 2000); 

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`popup ${visible ? 'visible' : ''}`}>
      <div className="popup-content">{message}</div>
    </div>
  );
};

export default Alert;
