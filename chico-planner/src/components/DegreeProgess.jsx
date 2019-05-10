import React from 'react';
import PropTypes from 'prop-types';
import CourseList from './CourseList';
const node_selected = '#0B6623';

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
        if (this.props.courses.get(name).color === node_selected) {
          this.state.lower_div_all_required += 1;
        }
      });
    }
    if (this.props.courses.size > 0) {
      this.state.lower_div_pick1 = 0;
      lower1.map((name) => {
        if (this.props.courses.get(name).color === node_selected) {
          this.state.lower_div_pick1 += 1;
        }
      });
    }
    if (this.props.courses.size > 0) {
      this.state.lower_div_pick2 = 0;
      lower2.map((name) => {
        if (this.props.courses.get(name).color === node_selected) {
          this.state.lower_div_pick2 += 1;
        }
      });
    }
    if (this.props.courses.size > 0) {
      this.state.upper_div = 0;
      upper.map((name) => {
        if (this.props.courses.get(name).color === node_selected) {
          this.state.upper_div += 1;
        }
      });
    }
    let halfWayThough = Math.floor(upper.length / 2)

    let arrayFirstHalf = upper.slice(0, halfWayThough);
    let arraySecondHalf = upper.slice(halfWayThough, upper.length);
    return (
      <div className="division_container">
        <div className="division">
          <div className="degreeProgressHeader">
            <h1>Lower Division Requirements</h1>
          </div>
          <div className="degree-container">
            <div className="degreeProgress-left">
              <h3>
                {this.state.lower_div_all_required}
                /5
              </h3>
              <CourseList courses={this.props.courses} courseList={lowerAll} />
            </div>
            <div className="degreeProgress-middle">
              <h3>
                {this.state.lower_div_pick1}
                /1
              </h3>
              <CourseList courses={this.props.courses} courseList={lower1} />
            </div>
            <div className="degreeProgress-right">
              <h3>
                {this.state.lower_div_pick2}
                /2
              </h3>
              <CourseList courses={this.props.courses} courseList={lower2} />
            </div>
          </div>
        </div>
        <div className="division">
          <div className="degreeProgressHeader">
            <h1>Upper Division Requirements</h1>
          </div>
          <div className="degreeProgress">
            <h3>
              {this.state.upper_div}
              /15
            </h3>
            <div className="division_container">
              <div className="division">
                <CourseList courses={this.props.courses} courseList={arrayFirstHalf} />
              </div>
              <div className="division">
                <CourseList courses={this.props.courses} courseList={arraySecondHalf} />
              </div>
            </div>
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
