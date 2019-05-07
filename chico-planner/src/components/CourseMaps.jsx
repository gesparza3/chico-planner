import React from 'react';
import ReactFauxDOM from 'react-faux-dom';

const D3 = require('d3');
const d3Dag = require('d3-dag');
const d3 = Object.assign({}, D3, d3Dag);


let node_list = []

/**
 * FrequencyChart test
 */
class CourseMap extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        mouseOver: false
      };
    }

  Course(id, description) {
    this.id = id;
    this.description = description;
    this.children = [];

    this.addChildren = function (list) {
      for(var i = 0; i < list.length; i++) {
        this.children[i] = list[i];
      }
    }

    this.getId = function () {
      return this.id;
    }
  }

  intializeCourses = function (data) {
    for(var n in data) {
      var newCourse = new this.Course(n, data[n]['desc'])
      newCourse.addChildren(data[n]['children'])
      node_list.push(newCourse);
    }
  }

  /**
   * Draws frequency chart
   * @return {graph} returns graph object
   */
  drawChart() {
    // eslint-disable-next-line
    const div = new ReactFauxDOM.createElement('div');

    const node_info = require('../data/node_data.json');
    this.intializeCourses(node_info);
    console.log(node_list[0])

    // const dagData = require(('../data/' + this.props.data + '_pre.json'))
    const dagData = this.props.data
    const adjList = require('../data/adj.json')

    // Define margin
    const margin = {top: 80, right: 80, bottom: 50, left: 80};
    const width = this.props.width - margin.left - margin.right;
    const height = this.props.height - margin.top - margin.bottom;

    const dag = d3.dagConnect()(dagData);

    d3.sugiyama().decross(d3.decrossTwoLayer())(dag);

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
        .attr('id', (d) => d.id)
        .attr('fill', this.state.mouseOver ? 'red' : 'blue')
        .on('click', function() {
          var n;
          var cur_node = d3.select(this).attr('id')
          for (n in adjList[cur_node]) {
            d3.selectAll("#" + adjList[cur_node][n])
              .attr('fill', 'red')
          }
          // this.setState({
            // mouseOver: !this.state.mouseOver
          // })
        })

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
