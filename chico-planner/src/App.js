import React, { Component } from 'react';
import './App.css';
import CourseMap from './components/CourseMaps';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: 2000,
      height: 1000,
      degree: ['CSCI']
    };
  }

  render() {
    return (
      <div className="App">
        <div className="App-header"><h1>Chico Planner</h1></div>
        <div className="container">
          <CourseMap
            width={this.state.width}
            height={this.state.height}
            data={this.state.degree}
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
