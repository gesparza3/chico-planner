import React from 'react';
import PropTypes from 'prop-types';
import CourseList from './CourseList';


const degreeReqs = require('../data/degree_requirements.json');

class DegreeProgress extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lower_div_all_required: 0,
      lower_div_pick1: 0,
      lower_div_pick2: 0,
      upper_div: 0,
    };
  }

  render() {
    const lowerAll = degreeReqs.lower_division_required.courses;
    const lower1 = degreeReqs.lower_division_pick1.courses;
    const lower2 = degreeReqs.lower_division_pick2.courses;
    const upper = degreeReqs.upper_division.courses;

    if (this.props.courses.size > 0) {
      this.state.lower_div_all_required = 0;
      lowerAll.map((name) => {
        if (this.props.courses.get(name).color === 'green') {
          this.state.lower_div_all_required += 1;
        }
      });
    }
    if (this.props.courses.size > 0) {
      this.state.lower_div_pick1 = 0;
      lower1.map((name) => {
        if (this.props.courses.get(name).color === 'green') {
          this.state.lower_div_pick1 += 1;
        }
      });
    }
    if (this.props.courses.size > 0) {
      this.state.lower_div_pick2 = 0;
      lower2.map((name) => {
        if (this.props.courses.get(name).color === 'green') {
          this.state.lower_div_pick2 += 1;
        }
      });
    }
    if (this.props.courses.size > 0) {
      this.state.upper_div = 0;
      upper.map((name) => {
        if (this.props.courses.get(name).color === 'green') {
          this.state.upper_div += 1;
        }
      });
    }
    return (
      <div className="division_container">
        <div className="division">
          <div className="degreeProgressHeader">
            <h1>Lower Division</h1>
          </div>
          <div className="degreeProgress">
            <h3>
              {this.state.lower_div_all_required}
            /5 requirements met
            </h3>
            <CourseList courses={this.props.courses} courseList={lowerAll} />
          </div>
          <div className="degreeProgress">
            <h3>
              {this.state.lower_div_pick1}
/1
            </h3>
            <CourseList courses={this.props.courses} courseList={lower1} />
          </div>
          <div className="degreeProgress">
            <h3>
              {this.state.lower_div_pick2}
/2
            </h3>
            <CourseList courses={this.props.courses} courseList={lower2} />
          </div>
        </div>
        <div className="division">
          <div className="degreeProgressHeader">
            <h1>Upper Division</h1>
          </div>
          <div className="degreeProgress">
            <h3>
              {this.state.upper_div}
/15
            </h3>
            <CourseList courses={this.props.courses} courseList={upper} />
          </div>
        </div>
      </div>
    );
  }
}

DegreeProgress.propTypes = {
  courses: PropTypes.instanceOf(Map).isRequired,
};

export default DegreeProgress;
