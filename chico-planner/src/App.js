import React, { Component } from 'react';
import './App.css';
import Graph from './components/layout/Graph';
import { Checkbox, CheckboxGroup } from 'react-checkbox-group';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      degree: ['CSCI']
    };
  }

  render() {
    return (
      <div className="App">
        <div className="App-header"><h1>Chico Planner</h1></div>
        <div className="container">
          <Graph data={this.state.degree}/>
        </div>
      <CheckboxGroup
        checkboxDepth={2} // This is needed to optimize the checkbox group
        name="degree"
        value={this.state.degree}
        onChange={this.degreeChanged}>
        <label><Checkbox value="CSCI"/> CSCI </label>
        <label><Checkbox value="CINS"/> CINS</label>
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
