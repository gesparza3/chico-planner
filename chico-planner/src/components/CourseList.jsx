import React from 'react';
import PropTypes from 'prop-types';
import Course from '../helpers/course';

class CourseList extends React.Component {
  render() {
    let courseInfo = []
    if (this.props.courses.size > 0) {
      this.props.courseList.map((name, index) => {
        courseInfo[index] = this.props.courses.get(name).color;
      });
    }
    return (
      <ul>
        {this.props.courseList.map((name, index) => {
          return <li style={{color: courseInfo[index]}} key={ index }>{name}</li>
        })}
      </ul>
    );
  }
}

CourseList.propTypes = {
  courses: PropTypes.instanceOf(Map).isRequired,
  courseList: PropTypes.array.isRequired,
}

export default CourseList;
