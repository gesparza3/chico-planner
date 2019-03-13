import React, { Component } from 'react';
import { Graph } from 'react-d3-graph';
import PropTypes from 'prop-types';

export class DirGraph extends Component {

  getData = () => {
    var d = this.props.data;
    var node_list = []
    var link_list = []
    for(var i = 0; i < d.length; i++) {
      node_list = node_list.concat(require('../../data/' + d[i] + '.json'))
      link_list = link_list.concat(require('../../data/' + d[i] + '_pre.json'))
    }
    return {
      nodes: node_list,
      links: link_list
    }
  }

  render() {
    return (
      <div className="custom-container">
        <Graph
          id="graph-id"
          data={this.getData()}
          config={myConfig}
        />
      </div>
    );
  }
}

// PropTypes
DirGraph.propTypes = {
  data: PropTypes.array.isRequired
}

// function DirGraph() {
//   var node_list = require('../../data/CSCI.json')
//   var link_list = require('../../data/CSCI_pre.json')
//   const data = {
//     nodes: node_list,
//     links: link_list
//   };
//

const myConfig = {
  "automaticRearrangeAfterDropNode": false,
  "directed": true,
  "collapsible": true,
  "height": 700,
  "highlightDegree": 1,
  "highlightOpacity": 0.2,
  "linkHighlightBehavior": true,
  "maxZoom": 8,
  "minZoom": 0.1,
  "nodeHighlightBehavior": true,
  "panAndZoom": true,
  "staticGraph": false,
  "width": 1100,
  "d3": {
    "alphaTarget": 0.05,
    "gravity": -200,
    "linkLength": 80,
    "linkStrength": 3
  },
  "node": {
    "fontColor": "black",
    "fontSize": 12,
    "fontWeight": "bold",
    "highlightColor": "red",
    "highlightFontSize": 15,
    "highlightFontWeight": "bold",
    "highlightStrokeColor": "SAME",
    "highlightStrokeWidth": 1.5,
    "labelProperty": "name",
    "mouseCursor": "pointer",
    "opacity": 1,
    "renderLabel": true,
    "size": 450,
    "strokeColor": "none",
    "strokeWidth": 1.5,
    "svg": "",
    "symbolType": "square"
  },
  "link": {
    "color": "#d3d3d3",
    "opacity": 1,
    "semanticStrokeWidth": false,
    "strokeWidth": 4,
    "highlightColor": "blue"
  }
};

export default DirGraph;
