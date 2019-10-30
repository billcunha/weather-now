import React from 'react';

import logo from './logo.svg';
import './index.scss';

function Topbar() {
  return (
    <div className="base">
      <img src={logo} className="app-logo" alt="logo" />
    </div>
  );
}

export default Topbar;