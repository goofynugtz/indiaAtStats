import { geoIdentity, geoPath } from 'd3-geo';
import { useEffect, useRef } from 'react';
import { feature } from "topojson-client";
import { interpolateBlues, interpolateGreens, interpolateGreys, interpolatePurples, interpolateOranges } from 'd3-scale-chromatic';
import { select } from 'd3-selection';
import { scaleSequential } from 'd3-scale';

const WIDTH = 500;
const HEIGHT = 500;

const MISSING_DATA_COLOR = 'transparent';

//separate function returning geoPath(geoIdentity());
const projection = geoIdentity();
const path = geoPath(projection);

const colorInterpolator = (statsType) => {
  switch (statsType) {
    case 'Rainfall':
      return (t) => interpolateBlues(t * 0.85);
    case 'Literacy':
      return (t) => interpolateGreens(t * 0.85);
    case 'Population':
      return (t) => interpolateGreys(t * 0.85);
    case 'sexRatio':
      return (t) => interpolatePurples(t * 0.85);
    default:
      return (t) => interpolateOranges(t * 0.85);
  }
};

const colorValue = (d) => {
  // console.log("d", d);
  return d.Average;
}

const Map = ({geoData, statistics, statsType}) => {

  // console.log(statsType);
  //DataStructure

  //mapScale
  const colorScale = scaleSequential(colorInterpolator(statsType))
    .domain([0, 150]);

  // console.log(colorValue());
  // console.log("colorScale: ", colorScale(colorValue()));
  const geoDataD = feature(geoData, geoData.objects.districts).features;
  // const geoDataS = feature(data, data.objects.states).features;
  // console.log(geoDataD);
  // console.log(geoDataS);

  const svgRef = useRef();

  useEffect(() => {
    const svg = select(svgRef.current);

    
    //Rendering districts
    svg
      .select('.districts')
      .selectAll('path')
      .data(geoDataD)
      .join('path')
      .attr('class', 'district')
      .attr('fill', feature => {
        // console.log("feature", feature);
        var result = statistics.filter((obj) => {
          // console.log("obj", obj);
          return obj.District === feature.properties.district
        });
        if (result[0]) {
          // console.log(result[0]);
          // console.log(colorValue(result[0]));
          // console.log(colorScale(colorValue(result[0])));
          return colorScale(colorValue(result[0]))}
        else {
          // console.log("State: ", feature.properties.st_nm, "; District: ", feature.properties.district)
          return MISSING_DATA_COLOR;
        }
        })
      .attr('d', feature => path(feature));

  })

  return (
    <div className='svg-parent'>
      <svg
        width={WIDTH}
        height={HEIGHT}
        id='chart'
        ref={svgRef}>
        <g className='districts' />
        <g className='states' />
      </svg>
    </div>
  )
}

export default Map;