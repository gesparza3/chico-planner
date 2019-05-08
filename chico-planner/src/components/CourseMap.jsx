import React from 'react';
import ReactFauxDOM from 'react-faux-dom';
import PropTypes from 'prop-types';
import Course from '../helpers/course';

const D3 = require('d3');
const d3Dag = require('d3-dag');
const nodeInfo = require('../data/node_data.json');
// const adjList = require('../data/adj.json');

const d3 = Object.assign({}, D3, d3Dag);

// Set node colors
const node_undiscovered = '#2C2A29';
const node_discovered = '#006BA6';

/**
 * Visualize classes with a DAG
 */
class CourseMap extends React.Component {
  /**
   * Set state values
   */
  constructor(props) {
    super(props);

    this.courses = new Map();

    // Populate list of courses
    Object.keys(nodeInfo).forEach((n) => {
      const newCourse = new Course(n, nodeInfo[n].desc, nodeInfo[n].units);
      newCourse.addChildren(nodeInfo[n].children);
      newCourse.addParents(nodeInfo[n].parents);
      newCourse.addParentOptions(nodeInfo[n].parent_options);
      this.courses.set(newCourse.id, newCourse);
    });
  } // constructor

  getCourse(name) {
    return this.courses.get(name);
  }

  getAllCourses() {
    return this.courses;
  }

  isEligble(name) {
    const curCourse = this.courses.get(name);
    const parents = curCourse.getParents();
    if (parents.length === 0) return true;
    const parent_options = curCourse.parent_options;
    const diff = parents.filter(x => !parent_options.includes(x));
    for (let i = 0; i < diff.length; i += 1) {
      const parentCourse = this.courses.get(diff[i])
      if (parentCourse.color === node_undiscovered) {
        return false;
      }
    }

    if (parent_options.length === 0) return true;
      for (let i = 0; i < parent_options.length; i += 1) {
        const parentCourse = this.courses.get(parent_options[i]);
        if (parentCourse.color !== node_undiscovered) {
          return true;
        }
      }
    return false;
  }

  /**
   * Draws frequency chart
   * @return {graph} returns graph object
   */
  drawChart() {
    // eslint-disable-next-line
    const div = new ReactFauxDOM.createElement('div'); // Give d3 the DOM

    // Set edge data for d3
    const { dagData } = this.props;

    // Define margin
    const margin = {
      top: 80,
      right: 80,
      bottom: 50,
      left: 80,
    };

    // Set CourseMap size
    let { width } = this.props;
    let { height } = this.props;
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;


    // Format data for graph
    const dag = d3.dagConnect()(dagData);

    // Build graph data for courses
    // d3.sugiyama().decross(d3.decrossTwoLayer())(dag);
    d3.sugiyama().coord(d3.coordCenter())(dag);


    // Define SVG attributes
    const svgSelection = d3.select(div)
      .attr('class', 'container')
      .append('svg')
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
      .x(d => d.y * width)
      .y(d => d.x * height);

    // Plot edges
    svgSelection.append('g')
      .selectAll('path')
      .data(dag.links())
      .enter()
      .append('path')
      .attr('d', ({ data }) => line(data.points))
      .attr('id', ({ source, target }) => source.id.concat(target.id))
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke', node_undiscovered);

    // Select nodes
    const nodes = svgSelection.append('g')
      .selectAll('g')
      .data(dag.descendants())
      .enter()
      .append('g')
      .attr('transform', ({ x, y }) => `translate(${y * width}, ${x * height})`);

    // Plot node circles
    nodes.append('circle')
      .attr('r', 38)
      .attr('id', d => d.id)
      .attr('fill', node_undiscovered)
      .on('click', (d) => {
        // Get current node
        const curCourse = this.getCourse(d.id);

        // Get current node's children
        const mychilds = curCourse.getChildren();

        if (this.isEligble(curCourse.id)) {
          // Toggle parent color
          curCourse.toggleAsParent();

          // Update units
          const unitVal = curCourse.units;
          if (curCourse.color === node_undiscovered) {
            this.props.updateUnits(-unitVal);
          } else {
            this.props.updateUnits(unitVal);
          }

          this.props.addActiveCourses(this.getAllCourses());


          // Toggle stroke-width
          const strokeWidth = curCourse.color === node_undiscovered ? 2 : 8;
          // Turn clicked node green
          d3.select('#'.concat(d.id))
            .attr('fill', curCourse.color);

          // Activate child and path to child
          mychilds.forEach((course) => {
            const childColor = this.isEligble(course) ? node_discovered : node_undiscovered;

            d3.select('#'.concat(course)) // Child
              .attr('fill', childColor);

            d3.select('#'.concat(d.id).concat(course)) // Path to child
              .attr('stroke', curCourse.color)
              .attr('stroke-width', strokeWidth);
          });
        }
      })
      .on('mouseover', (d) => {
        const curCourse = this.getCourse(d.id);
        this.props.updateCourseDesc(
          d.id.concat(' (')
            .concat(curCourse.units)
            .concat(' units)').concat(': ')
            .concat(curCourse.description),
        );
      })
      .on('mouseout', (d) => {
        this.props.updateCourseDesc('Hover on a course to learn more');
      });

    // Add text to nodes
    nodes.append('text')
      .text(d => d.id)
      .attr('font-weight', 'bold')
      .attr('class', 'shadow')
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


CourseMap.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  dagData: PropTypes.instanceOf(Object).isRequired,
  updateCourseDesc: PropTypes.func.isRequired,
  updateUnits: PropTypes.func.isRequired,
  addActiveCourses: PropTypes.func.isRequired,
};


export default CourseMap;
