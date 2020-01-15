import React, { Component } from "react";
import * as d3 from "d3";

const width = 650;
const height = 450;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

class Chart extends Component {
  state = {
    bars: [],
    radial: []
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps;
    if (!data) return {};
    const perSliceAngle = (2*Math.PI)/data.length;
  const radiusScale= d3.scaleLinear()
  .domain([d3.min(data, d=>d.low), d3.max(data, d=>d.high)])
  .range([0, width/3]);
  const colorExtent = d3.extent(data, d=>d.avg).reverse();
  const colorScale = d3.scaleSequential().domain(colorExtent).interpolator(d3.interpolateRdYlBu);
 console.log(colorScale(43));
  const arcGen = d3.arc(); 
  const radial =  data.map((d,i) => ({
    
    path: arcGen({
    innerRadius: radiusScale(d.low),
    outerRadius: radiusScale(d.high),
    startAngle:  i*perSliceAngle,
    endAngle:     (i+1)*perSliceAngle
  }),
    fill: colorScale(d.avg)
  
  }));
    return {radial};
  }

  render() {

    return (
    <svg width={width} height={height} >
      <g transform={`translate(${width/2},${height/2})`}>
        {
          this.state.radial.map(d=>{
 //           console.log("path: " + d.path + "  fill: " + d.fill);
            return <path d={d.path} fill={d.fill}  />
          })
        }
      </g>

   </svg>)
  }
}

export default Chart;
