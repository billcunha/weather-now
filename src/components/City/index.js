import React, { useEffect, useState, useCallback, useRef } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';

import './index.scss';

const useStyles = makeStyles({
  root: {
    color: '#737C84',
  },
});

function City(props) {
  const { item } = props;

  const [city, setCity] = useState(item);

  const classes = useStyles();

  const timeout = useRef();
  
  const loadCity = useCallback((id) => {
    function updateCity(value){
      let newCity = value;
      if(value.status === 200){
        localStorage.setItem('@weather/' + newCity.id, JSON.stringify(newCity));
        timeout.current = setTimeout(() => loadCity(newCity.id), moment(newCity.updated_at).add(10, 'm').diff(moment(), 'seconds') * 1000);
      }
      setCity(newCity);
    }

    if(!id){
      return;
    }
    
    const cached = localStorage.getItem('@weather/' + id);
    if(cached !== null){
      const cache = JSON.parse(cached);
      if(moment(cache.updated_at).add(10, 'm').isAfter()){
        updateCity(cache);
        return;
      }
    }

    fetch('https://api.openweathermap.org/data/2.5/weather?id=' + id + '&appid=20681152977e6175ca764e6bb6caf561&units=metric')
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res
      })
      .then(res => updateCity({
        updated_at: moment(),
        id: res.id,
        name: res.name + ', ' + res.sys.country,
        pressure: res.main.pressure,
        temperature: res.main.temp,
        humidity: res.main.humidity,
        status: res.cod,
      }))
      .catch(() => 
        updateCity({
          errorMsg: "Something went wrong",
          name: "",
          status: 404,
        }));
  }, []);

  useEffect(() => {
    loadCity(item.id);
  }, [item, loadCity]);

  useEffect(() => {
    return () => clearTimeout(timeout);
  }, [timeout]);
  
  return (
    <div className={"box " + (item.clicked ? "box-clicked": "")}>
    {
    city.status === undefined ?
      <div className="loading">
        <CircularProgress className={classes.root} thickness={6}/>
      </div>
    :
    (city.status !== 200 && city.status !== undefined)  &&
      <div className="error">
        <div className="error-msg">
          {city.errorMsg}
        </div>
        <div className="btn-try">
          Try again
        </div>
      </div>
    }
    {
    city.status === 200 &&
      <>
        <div className="header">
          {city && city.name}
        </div>
        <div className="temperature">
          <Temperature value={city && city.temperature} />
        </div>
        {
        item.clicked === true &&
          <div className="aditional">
            <div className="humidity">
              <div>HUMIDITY</div>
              <div>
                <span>{city && city.humidity}</span>%
              </div>
            </div>
            <div className="pressure">
              <div>PRESSURE</div>
              <div>
                <span>{city && city.pressure}</span>hPa
              </div>
            </div>
          </div>
        }
        <div className="footer">
            {city && 'Updated at ' + moment(city.updated_at).format("HH:mm:ss A")}
        </div>
      </>
    }
    </div>
  );
}

function Temperature({value = 0}) {
  const temperature = Math.round(value);

  if(temperature <= 5){
      return <span className="low">{temperature}°</span>
  }

  if (temperature > 25){
      return <span className="high">{temperature}°</span>
  }

  return <span className="med">{temperature}°</span>
}

export default City;