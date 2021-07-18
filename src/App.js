import './App.css';
import Map from './components/Map';
import geodata from './india.json';
import { useState, useEffect } from 'react';
import rainfallStatisticsRAW from './data/rainfallStats.json';
import literacyStatistics from './data/literacy.json';
import populationStatistics from './data/population.json';
import sexRatioStatistics from './data/sexRatio.json';

const SELECTED_YEAR = '2002';

function App() {

  const statistics = {
    rainfall: {
      heading: 'Rainfall',
      data: rainfallStatisticsRAW.filter(row => row.Year === SELECTED_YEAR)
    },
    literacy: {
      heading: 'Literacy',
      data: literacyStatistics
    },
    population: {
      heading: 'Population',
      data: populationStatistics
    },
    sexRatio: {
      heading: 'SexRatio',
      data: sexRatioStatistics
    }
  }

  // console.log(rainfallStatisticsRAW);
  // const filteredRainfallStats = rainfallStatisticsRAW.filter(row => row.Year === SELECTED_YEAR);

  // const [statsToRender, setStatsToRender] = useState('Rainfall');
  const [statisticsData, setStatisticsData] = useState(statistics.population);
  console.log(statisticsData);
  // const [stats, setStats] = useState(filteredRainfallStats);

  // switchToLiteracyHandler();


  // statsChangeHandler('literacy');
  // console.log(literacyStatistics);
  // console.log(populationStatistics);
  // console.log(sexRatioStatistics);

  return (
    <div className="App">
      <Map 
      className='map-visualizer'
      geoData={geodata}
      statistics={statisticsData.data}
      statsType={statisticsData.heading}/>
    </div>
  );
}

export default App;
