import React, { Component } from "react";
import * as d3 from "d3";

const width = 650;
const height = 450;
const margin = { top: 20, right: 5, bottom: 20, left: 35 };

class Chart extends Component {
  state = {
    bars: [],
    radial: [],
    xScale: undefined,
    yScale: undefined
  };
 xAxis = d3.axisBottom();
 yAxis = d3.axisLeft();

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps;
    if (!data) return {};
    const extent = d3.extent(data, d=> d.date)
    const xScale = d3.scaleTime()
      .domain(extent)
      .range([margin.left, width-margin.right])
    // console.log('===', xScale(new Date('12/31/2017')  ))
    
    const [min, max] = d3.extent(data, d=> d.high)
    const yScale = d3.scaleLinear()
      .domain([Math.min(min, 0), max])
      .range([height-margin.bottom, margin.top])
    
    // const highEx = d3.extent(data, d=>d.high)
    // const lowEx = d3.extent(data, d=>d.low)
    // console.log('high range', highEx, 'low range', lowEx)
    
    const colorExtent = d3.extent(data, d=>d.avg).reverse()
    //const colorExtent = d3.extent(data.map(d=>d.avg)).reverse()
    const colorScale = d3.scaleSequential()
  .domain(colorExtent).interpolator(d3.interpolateRdYlBu)
    console.log(d3.extent(data.map(d=>d.avg)).reverse())
    console.log(colorExtent)
    
   const bars= data.map(d=> {
    return {
      x: xScale(d.date),
      y: yScale(d.high),
      height: yScale(d.low) - yScale(d.high),
      fill: colorScale(d.avg),
    }
   })
    return {bars, xScale, yScale};
  }
  componentDidUpdate(){
    this.xAxis.scale(this.state.xScale)
    d3.select(this.refs.xAxis).call(this.xAxis)
    this.yAxis.scale(this.state.yScale)
    d3.select(this.refs.yAxis).call(this.yAxis)

  }
  render() {

    return (
    <svg width={width} height={height} >

        {
          this.state.bars.map(d=>{
            return <rect x={d.x} y={d.y} width={2} height={d.height}fill={d.fill}  />
          })
        }
        <g ref="xAxis" transform={`translate(0, ${height-margin.bottom})`}/>
        <g ref="yAxis" transform={`translate(${margin.left}, 0)`}/>


   </svg>)
  }
}
export default Chart;
