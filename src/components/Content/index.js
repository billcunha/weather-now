import React from 'react';

import City from '../City';

import './index.scss';

function Content() {
  const cities = [
    {
      id: 3421319,
    },
    {
      id: 3445709,
      clicked: true,
    },
    {
      id: 184745,
    },
  ];

  return (
    <div className="container">
      {
        cities.map((item) =>
          <City key={item.id} item={item} />
        )
      }
    </div>
  );
}

export default Content;