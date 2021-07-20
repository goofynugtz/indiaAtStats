import './App.css';
import Map from './components/Map';
import Table from './components/ObservationTable';
import geodata from './india.json';
import { useState } from 'react';
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

  const [statisticsData, setStatisticsData] = useState(statistics.literacy);


  return (
    <div className="App">
      <div className='switches'>
        <button onClick={() => {setStatisticsData(statistics.rainfall)}}>Rainfall</button>
        <button onClick={() => {setStatisticsData(statistics.literacy)}}>Literacy</button>
        <button onClick={() => {setStatisticsData(statistics.population)}}>Population</button>
        <button onClick={() => {setStatisticsData(statistics.sexRatio)}}>Sex Ratio</button>
      </div>
      <Map 
      className='map-visualizer'
      geoData={geodata}
      statistics={statisticsData.data}
      statsType={statisticsData.heading}/>
      <Table statistics={statisticsData.data}/>
    </div>
  );
}

export default App;
