import React from 'react';
import PropTypes from 'prop-types';

class CourseList extends React.Component {
  render() {
    let courseInfo = []
    if (this.props.courses.size > 0) {
      this.props.courseList.map((name, index) => {
        let nodeColor = this.props.courses.get(name).color;
        courseInfo[index] = nodeColor;
		});
    }
    return (
      <ul>
        {this.props.courseList.map((name, index) => {
          return <h3 style={{backgroundColor: courseInfo[index]}} key={ index }>{name}</h3>
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
