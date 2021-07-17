import './App.css';
import Map from './components/Map';
import geodata from './india.json';
import { useState } from 'react';
import rainfallStatisticsRAW from './data/rainfallStats.json';
import literacyStatistics from './data/literacy.json';
import populationStatistics from './data/population.json';
import sexRatioStatistics from './data/sexRatio.json';

const SELECTED_YEAR = '2002';

function App() {

  // console.log(rainfallStatisticsRAW);
  const filteredRainfallStats = rainfallStatisticsRAW.filter(row => row.Year === SELECTED_YEAR);

  const [statsToRender, setStatsToRender] = useState('Rainfall');
  const [stats, setStats] = useState(filteredRainfallStats);

  const statsChangeHandler = (changeTo) => {

  }

  // console.log(literacyStatistics);
  // console.log(populationStatistics);
  // console.log(sexRatioStatistics);

  return (
    <div className="App">
      <Map 
      className='map-visualizer'
      geoData={geodata}
      statistics={stats}
      statsType={statsToRender}/>
    </div>
  );
}

export default App;
