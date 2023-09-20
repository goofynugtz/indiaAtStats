import { geoIdentity, geoPath } from 'd3-geo';
import { useEffect, useRef } from 'react';
import { feature } from "topojson-client";
import { interpolateBlues, interpolateGreens, interpolateGreys, interpolatePurples, interpolateOranges } from 'd3-scale-chromatic';
import { select } from 'd3-selection';
import { scaleSequential } from 'd3-scale';
import { Record } from '../types';

const WIDTH = 500;
const HEIGHT = 500;

const MISSING_DATA_COLOR = 'transparent';

const CIRCLE_DECREASING_FACTOR = 0.0000019;

//separate function returning geoPath(geoIdentity());
const projection = geoIdentity();
const path = geoPath(projection);

const colorInterpolator: (statsType: string) => (t: number) => string = (statsType: string) => {
  console.log(statsType)
  switch (statsType) {
    case 'Rainfall':
      return (opacity) => `rgb(35, 134, 200, ${opacity})`;
    case 'Literacy':
      return (opacity) => `rgba(16, 122, 55, ${opacity})`;
    case 'Population':
      return (t) => interpolateGreys(t * 0.00002);
    case 'Sex Ratio':
      return (t) => {
        let red = 0;
        if (t < .5) red = 255*(1 - (1/(1+ Math.pow(Math.E, t))))
        else red = 255*(1/(1+ Math.pow(Math.E, t)))
        
        let green = 0;
        if (t < .5) green = 255*(1/(1+ Math.pow(Math.E, t)))
        else green = 255*(1 - (1/(1+ Math.pow(Math.E, t))))
        
        let blue = 0;
        let opacity = t;
        return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
      }
    default:
      return (t) => interpolateOranges(t * 1);
  }
};

/* const colorValue = (d, statsType) => {
  return d.data;
  switch (statsType) {
    case 'Rainfall':
      return d.Average;
    case 'Literacy':
      return d.Literacy;
    case 'Population':
      return d.Population;
    case 'SexRatio':
      return d.SexRatio;
    default:
      return d.Average;
  }
} */

const Map = ({ geoData, statistics, statsType }: { geoData: any, statistics: Record[], statsType: string }) => {
  // console.log(geoData)
  let minimumValue: number = 0;
  let maximumValue: number = 100;

  switch (statsType) {
    case 'Rainfall':
      maximumValue = 125; minimumValue = 0;
      break;
    case 'Literacy':
      maximumValue = 110; minimumValue = 35;
      break;
    case 'Sex Ratio':
      maximumValue = 1200; minimumValue = 650;
      break;
  }

  const colorScale = scaleSequential(colorInterpolator(statsType))
    .domain([minimumValue, maximumValue]);

  // @ts-ignore
  const geoDataD = feature(geoData, geoData.objects.districts).features;
  const svgRef = useRef(null);

  //Rendering districts
  useEffect(() => {
    const svg = select(svgRef.current);
    if (statsType === 'Population') return
    svg.selectAll('.circle').remove();
    svg
      .select('.choropleth')
      .selectAll('path')
      .data(geoDataD)
      .join('path')
      .attr('class', 'district')
      .attr('fill', feature => {
        let result = statistics.filter((obj) => {
          // @ts-ignore
          return obj.district === feature.properties.district
        });
        if (result[0]) {
          return colorScale(Number(result[0].data))
        }
        else {
          return colorScale((minimumValue+maximumValue)/2);
        }
      })
      // @ts-ignore
      .attr('d', feature => path(feature));
  })

  //Rendering Population
  useEffect(() => {
    // @ts-ignore
    if (statsType !== 'Population') return
    const svg = select(svgRef.current);
    let circlesData = [];
    // @ts-ignore
    circlesData = geoDataD.map((feature) => {
      let result = statistics.filter((obj) => {
        return obj.district === feature.properties.district
      });

      if (result[0]) {
        return {
          ...feature,
          value: Number(result[0].data) * CIRCLE_DECREASING_FACTOR
        };
      } else {
        return {
          ...feature,
          value: 0
        }
      }
    })

    svg.selectAll('.district').remove();
    svg
      .select('.circles')
      .selectAll('circle')
      .data(circlesData)
      // @ts-ignore
      .join((enter) => {
        enter
          .append('circle')
          // @ts-ignore
          .attr('transform', (feature) => `translate(${path.centroid(feature)})`)
          .attr('r', (feature) => {
            // @ts-ignore
            if (feature.value) return feature.value
            else return 1
          })
          .attr('class', 'circle')
          .attr('fill', 'rgba(0, 0, 0, .5)')
      })
  })

  return (
    <div className='svg-parent'>
      <svg
        width={WIDTH}
        height={HEIGHT}
        id='chart'
        ref={svgRef}
      >
        <g className='choropleth' />
        <g className='circles' />
      </svg>
    </div>
  )
}

export default Map;