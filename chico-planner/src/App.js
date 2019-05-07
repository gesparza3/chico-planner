import React, { Component } from 'react';
import './App.css';
import CourseMap from './components/CourseMaps';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';

const firstGraph = require('./data/graph_1.json');
const secondGraph = require('./data/graph_2.json');


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: 2000,
      height: 1000,
    };
  }

  render() {
    return (
      <div className="App">
        <div className="App-header"><h2>Chico Planner</h2></div>
        <div className="container">
          <CourseMap
            width={this.state.width}
            height={this.state.height}
            data={firstGraph}
          />
          <CourseMap
            width={this.state.width}
            height={this.state.height}
            data={secondGraph}
          />
        </div>
        <CheckboxGroup
           checkboxDepth={2} // This is needed to optimize the checkbox group
           name="degree"
           value={this.state.degree}
           onChange={this.degreeChanged}>
           <label><Checkbox value="CSCI"/> CSCI </label>
           <label><Checkbox value="CINS"/> CINS</label>
           <label><Checkbox value="EECE"/> EECE</label>
        </CheckboxGroup>
      </div>
    );
  }

  degreeChanged = (newDegrees) => {
    this.setState({
      degree: newDegrees
    });
  }
}

export default App;
