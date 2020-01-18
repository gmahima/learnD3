import React, { Component } from "react";
import * as d3 from "d3";

const width = 650;
const height = 650;

class RadialChart extends Component {
  state = {
    slices: [], // array of svg path commands, each representing a day
    tempAnnotations: []
  };

  arcGenerator = d3.arc();

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.data) return null; // data hasn't been loaded yet so do nothing
    const { data } = nextProps;
    const radiusScale = d3.scaleLinear().range([0, width / 2]);
    const colorScale = d3.scaleSequential(d3.interpolateRdYlBu);

    // data has changed, so recalculate scale domains
    const tempMax = d3.max(data, d => d.high);
    const colorDomain = d3.extent(data, d => d.avg).reverse();
    radiusScale.domain([0, tempMax]);
    colorScale.domain(colorDomain);

    // one arc per day, innerRadius is low temp, outerRadius is high temp
    const perSliceAngle = (2 * Math.PI) / data.length;
    const slices = data.map((d, i) => {
      const arcData = {
        startAngle: i * perSliceAngle,
        endAngle: (i + 1) * perSliceAngle,
        innerRadius: radiusScale(d.low),
        outerRadius: radiusScale(d.high)
      };

      return { arcData, fill: colorScale(d.avg) };
    });

    return { slices };
  }
  componentDidMount(){
    this.ctx = this.refs.canvas.getContext("2d");
    this.ctx.translate(width/2, height/2)
    this.arcGenerator.context(this.ctx);
    this.drawSlices()


  }
  componentDidUpdate(){
    this.drawSlices()
  }
  drawSlices() {
    this.state.slices.forEach(d=>{
      this.ctx.fillStyle =d.fill,
      this.ctx.beginPath();
      this.arcGenerator(d.arcData)
      this.ctx.fill()
    })
  }

  render() {
    return <canvas ref="canvas" width={width} height={height} />;
  }
}

export default RadialChart
