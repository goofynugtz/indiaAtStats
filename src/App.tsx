import './App.css';
import Map from './components/Map';
// import Table from './components/ObservationTable';
import geodata from './data/india.json';
import { useState } from 'react';
import rainfallStatistics from './data/rainfallStats.json';
import literacyStatistics from './data/literacy.json';
import populationStatistics from './data/population.json';
import sexRatioStatistics from './data/sexRatio.json';
import { Record } from './types';
import Navbar from './components/Navbar';
import Table from './components/Table';
import { cn } from './lib/utils';

/* const statistics = {
  rainfall: {
    heading: 'Rainfall',
    data: (rainfallStatistics as Array<any>).filter((row:any) => row.Year === SELECTED_YEAR)
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
} */

function App() {
  const [year, setYear] = useState<string>("2002");
  const [statisticsData, setStatisticsData] = useState<Record[]>(literacyStatistics);
  const [activeStat, setActiveStat] = useState<string>("Literacy")

  const switchToRainfallHandler = () => {
    setStatisticsData((rainfallStatistics as Array<any>).filter(row => row.year === year))
    setActiveStat("Rainfall")
  }

  const switchToLiteracyHandler = () => {
    setStatisticsData(literacyStatistics)
    setActiveStat("Literacy")
  }

  const switchToPopulationHandler = () => {
    setStatisticsData(populationStatistics)
    setActiveStat("Population")
  }

  const switchToSexRatioHandler = () => {
    setStatisticsData(sexRatioStatistics)
    setActiveStat("Sex Ratio")
  }

  return (
    <div className="App">
      <Navbar />
      <div className='switches'>
        <button className={cn(activeStat=="Rainfall" && "active","switch","rainfall")} onClick={switchToRainfallHandler}>Rainfall</button>
        <button className={cn(activeStat=="Literacy" && "active","switch","literacy")} onClick={switchToLiteracyHandler}>Literacy</button>
        <button className={cn(activeStat=="Population" && "active","switch","population")} onClick={switchToPopulationHandler}>Population</button>
        <button className={cn(activeStat=="Sex Ratio" && "active","switch","sex-ratio")} onClick={switchToSexRatioHandler}>Sex Ratio</button>
      </div>
      <Map geoData={geodata} statistics={statisticsData} statsType={activeStat}/>
      <Table statistics={statisticsData}/>
    </div>
  );
}

export default App;
