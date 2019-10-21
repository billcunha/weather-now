import React from 'react';

import Content from './Content';
import Topbar from './Topbar';

import './App.scss';

function App() {
  return (
    <>
      <Topbar />
      
      <div className="content">
        <Content />
      </div>
    </>
  );
}

export default App;
