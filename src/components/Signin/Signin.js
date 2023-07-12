import React from 'react';
import './Signin.css';
import Leftpane from './Leftpane';
import Rightpane from './Rightpane';

function Signin({ toggleComponent, handleLogin }) {
  return (
    <>
      <div className="main-container">
        <div className="pane-signin">
          <Leftpane toggleComponent={toggleComponent}></Leftpane>
          <Rightpane toggleComponent={toggleComponent} handleLogin={handleLogin} />
        </div>
      </div>
    </>
  );
}

export default Signin;
