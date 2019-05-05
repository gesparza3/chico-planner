import React from 'react';
import ReactFauxDOM from 'react-faux-dom';

const D3 = require('d3');
const d3Dag = require('d3-dag');
const d3 = Object.assign({}, D3, d3Dag);

/**
 * FrequencyChart test
 */
class CourseMap extends React.Component {
  /**
   * Draws frequency chart
   * @return {graph} returns graph object
   */
  drawChart() {
    // eslint-disable-next-line
    const div = new ReactFauxDOM.createElement('div');

    // const dagData = [
    //     ['ECON 103', 'FINA 307'],
    //     ['CSCI 111', 'CSCI 217'],
    //     ['CSCI 111', 'CSCI 211'],
    //     ['CSCI 111', 'MATH 217'],
    //     ['CSCI 111', 'CINS 242'],
    //     ['ACCT 201', 'ACCT 202'],
    //     ['ACCT 201', 'FINA 307'],
    //     ['CSCI 211', 'CSCI 446'],
    //     ['CSCI 211', 'CSCI 344'],
    //     ['CSCI 211', 'CSCI 311'],
    //     ['CSCI 211', 'CSCI 444'],
    //     ['CSCI 211', 'CINS 370'],
    //     ['CSCI 217', 'CSCI 311'],
    //     ['MATH 217', 'CSCI 311'],
    //     ['CINS 220', 'CSCI 446'],
    //     ['CSCI 311', 'CINS 490'],
    //     ['CSCI 311', 'CSCI 515'],
    //     ['CSCI 311', 'CSCI 340'],
    //     ['CINS 370', 'CINS 570'],
    //     ['CINS 370', 'CINS 574'],
    //     ['CINS 370', 'CINS 465'],
    //     ['CSCI 446', 'CSCI 546'],
    //     ['CSCI 446', 'EECE 555'],
    //     ['CSCI 446', 'CINS 448'],
    //     ['CINS 448', 'CINS 548'],
    //   ];

    // const dagData = require(('../data/' + this.props.data + '_pre.json'))
    const dagData = require('../data/CSCI_pre.json')

    // Define margin
    const margin = {top: 80, right: 80, bottom: 50, left: 80};
    const width = this.props.width - margin.left - margin.right;
    const height = this.props.height - margin.top - margin.bottom;

    const dag = d3.dagConnect()(dagData);

    d3.sugiyama()(dag);

    // This code only handles rendering
    const nodeRadius = 20;

    // Define svg
    const svgSelection = d3.select(div).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set color steps
    const steps = dag.size();
    const interp = d3.interpolateRainbow;
    const colorMap = {};
    dag.each((node, i) => {
      colorMap[node.id] = interp(i / steps);
    });


    // Draw edges
    const line = d3.line()
        .curve(d3.curveMonotoneX)
        .x((d) => d.y*width)
        .y((d) => d.x*height);

    // Plot edges
    svgSelection.append('g')
        .selectAll('path')
        .data(dag.links())
        .enter()
        .append('path')
        .attr('d', ({data}) => line(data.points))
        .attr('fill', 'none')
        .attr('stroke-width', 3)
        .attr('stroke', 'black');

    // Select nodes
    const nodes = svgSelection.append('g')
        .selectAll('g')
        .data(dag.descendants())
        .enter()
        .append('g')
        .attr('transform', ({x, y}) => `translate(${y*width}, ${x*height})`);

    // Plot node circles
    nodes.append('circle')
        .attr('r', 40)
        .attr('fill', (n) => colorMap[n.id]);

    // Add text to nodes
    nodes.append('text')
        .text((d) => d.id)
        .attr('font-weight', 'bold')
        .attr('font-family', 'sans-serif')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('fill', 'white');

    // DOM manipulations done, convert to React
    return div.toReact();
  }

  /**
   * Render the coursemap graph
   * @return {chart} Course map graph
   */
  render() {
    return this.drawChart();
  }
}

export default CourseMap;
