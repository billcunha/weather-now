import React from 'react';

import logo from './logo.svg';
import './index.scss';

function Topbar() {
  return (
    <div className="root">
      <img src={logo} className="App-logo" alt="logo" />
    </div>
  );
}

export default Topbar;