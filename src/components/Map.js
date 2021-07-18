import { geoIdentity, geoPath } from 'd3-geo';
import { useEffect, useRef } from 'react';
import { feature } from "topojson-client";
import { interpolateBlues, interpolateGreens, interpolateGreys, interpolatePurples, interpolateOranges } from 'd3-scale-chromatic';
import { select } from 'd3-selection';
import { scaleSequential } from 'd3-scale';

const WIDTH = 500;
const HEIGHT = 500;

const MISSING_DATA_COLOR = 'transparent';

const CIRCLE_DECREASING_FACTOR = 0.0000019;

//separate function returning geoPath(geoIdentity());
const projection = geoIdentity();
const path = geoPath(projection);

const colorInterpolator = (statsType) => {
  switch (statsType) {
    case 'Rainfall':
      return (t) => interpolateBlues(t * 0.85);
    case 'Literacy':
      return (t) => interpolateGreens(t * 1);
    case 'Population':
      return (t) => interpolateGreys(t * 0.00002);
    case 'sexRatio':
      return (t) => interpolatePurples(t * 0.85);
    default:
      return (t) => interpolateOranges(t * 0.85);
  }
};

const colorValue = (d, statsType) => {
  switch (statsType) {
    case 'Rainfall':
      // console.log("d", d);
      return d.Average;
    case 'Literacy':
      // console.log("d", d);
      return d.Literacy;
    case 'Population':
      // console.log("d", d);
      return d.Population;
  }
}

const Map = ({geoData, statistics, statsType}) => {

  // console.log(statistics);
  //DataStructure

  //mapScale
  const colorScale = scaleSequential(colorInterpolator(statsType))
    .domain([0, 100]);

  // console.log(colorValue());
  // console.log("colorScale: ", colorScale(colorValue()));
  const geoDataD = feature(geoData, geoData.objects.districts).features;
  // const geoDataS = feature(data, data.objects.states).features;
  console.log(geoDataD);
  // console.log(geoDataS);

  const svgRef = useRef();

  useEffect(() => {

    if (statsType === 'Population') return

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
        let result = statistics.filter((obj) => {
          // console.log("obj", obj);
          return obj.District === feature.properties.district
        });
        if (result[0]) {
          // console.log(result[0]);
          // console.log(colorValue(result[0]));
          // console.log(colorScale(colorValue(result[0])));
          return colorScale(colorValue(result[0], statsType))}
        else {
          // console.log("State: ", feature.properties.st_nm, "; District: ", feature.properties.district)
          return MISSING_DATA_COLOR;
        }
        })
      .attr('d', feature => path(feature));

  })


  //Rendering Population
  useEffect(() => {
    if (statsType !== 'Population') return

    const svg = select(svgRef.current);

    let circlesData = [];

    circlesData = geoDataD.map((feature) => {
      let result = statistics.filter((obj) => {
        // console.log("obj", obj);
        return obj.District === feature.properties.district
      });

      // console.log(result);

      if (result[0]) {
        return {
          ...feature,
          value: result[0].Population * CIRCLE_DECREASING_FACTOR
        };
      } else {
        return {
          ...feature,
          value: 0
        }
      }
    })

    console.log(circlesData)

    svg
      .select('.circles')
      .selectAll('circle')
      .data(circlesData)
      .join((enter) => {
        console.log(statistics);
        
        enter
          .append('circle')
          .attr('transform', (feature) => `translate(${path.centroid(feature)})`)
          .attr('r', (feature) => {
            console.log(feature.value);
            if (feature.value) return feature.value
            else return 1
            })
          .attr('class', 'bubble')
          .attr('fill', 'rgba(0, 0, 0, .5)')
      })

    
  }, [])

  return (
    <div className='svg-parent'>
      <svg
        width={WIDTH}
        height={HEIGHT}
        id='chart'
        ref={svgRef}>
        <g className='districts' />
        <g className='circles' />
      </svg>
    </div>
  )
}

export default Map;