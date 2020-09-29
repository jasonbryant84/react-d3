import React, { useEffect, useState } from 'react';
// import logo from './logo.svg';
import Chart from './components/chart'
import './App.css';

function App() {
  const [city, setCity] = useState('am'),
    [temps, setTemps] = useState(null)

  const updateCity = (e) => {
    setCity(e.target.value)
  }

  useEffect(() => {
    Promise.all([
      fetch(`../data/sf.json`),
      fetch(`../data/ny.json`),
      fetch(`../data/am.json`)
    ])
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(([sf, ny, am]) => {
      sf.forEach(day => day.date = new Date(day.date))
      ny.forEach(day => day.date = new Date(day.date))
      am.forEach(day => day.date = new Date(day.date))

      const tempTemps = {sf, ny, am}
      setTemps(tempTemps)
    })
    .catch(err => {
      console.error(err)
    })
  }, [])


  return (
    <div className="App">
      <h1>Temperatures with D3</h1>
      <select name='city' onChange={e => updateCity(e)}>
        {
          [
            {label: 'Amsterdam', value: 'am'},
            {label: 'San Francisco', value: 'sf'},
            {label: 'New York', value: 'ny'}
          ].map((option) => {
            return <option key={option.value} value={option.value}>{option.label}</option>
          })
        }
      </select>

      {temps != null && <Chart city={city} temps={temps[city]} />}



      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
