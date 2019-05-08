import React, { Component } from 'react';
import './App.css';
import CourseMap from './components/CourseMap';
import DegreeProgress from './components/DegreeProgess';

const firstGraph = require('./data/graph_1.json');
const secondGraph = require('./data/graph_2.json');


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 1500,
      height: 900,
      courseDesc: 'Hover on a course to learn more',
      units: 0,
      activeCourses: new Map(),
    };
    this.updateCourseDescription = this.updateCourseDescription.bind(this);
    this.updateUnits = this.updateUnits.bind(this);
    this.addActiveCourses = this.addActiveCourses.bind(this);
  }

  updateCourseDescription(desc) {
    this.setState({
      courseDesc: desc,
    });
  }

  updateUnits(num) {
    this.setState(prevState => ({
      units: prevState.units + num,
    }));
  }

  addActiveCourses(map) {
    this.setState({
      activeCourses: map,
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header"><h2>CSCI Course Explorer</h2></div>
        <div className="container-left">
          <CourseMap
            width={this.state.width}
            height={this.state.height}
            dagData={firstGraph}
            updateCourseDesc={this.updateCourseDescription}
            updateUnits={this.updateUnits}
            addActiveCourses={this.addActiveCourses}
          />
          <CourseMap
            width={800}
            height={250}
            dagData={secondGraph}
            updateCourseDesc={this.updateCourseDescription}
            updateUnits={this.updateUnits}
            addActiveCourses={this.addActiveCourses}
          />
        </div>
        <div className="container-right">
          <div className="description"><h3>{this.state.courseDesc}</h3></div>
          <h1>Total Units: {this.state.units}/87</h1>
          <DegreeProgress courses={this.state.activeCourses} />
        </div>
      </div>
    );
  }
}

export default App;
