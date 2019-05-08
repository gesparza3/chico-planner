/**
 * Defines courses and their attributes
 */
export default class Course {
  /**
   * Set intial course values
   */
  constructor(id, description, units) {
    this.id = id;
    this.color = 'gray';
    this.units = parseInt(units, 10);
    this.description = description;
    this.parents = [];
    this.parent_options = [];
    this.children = [];
  }

  /**
   * Add a list of course names as course's children
   */
  addChildren(list) {
    for (let i = 0; i < list.length; i += 1) {
      this.children[i] = list[i];
    }
  }

  /**
   * Add a list of course names as course's parents
   */
  addParents(list) {
    for (let i = 0; i < list.length; i += 1) {
      this.parents[i] = list[i];
    }
  }

  /**
   * Add a list of course names as course's parents
   */
  addParentOptions(list) {
    for (let i = 0; i < list.length; i += 1) {
      this.parent_options[i] = list[i];
    }
  }

  /**
   * Return the name of the course
   */
  getId() {
    return this.id;
  }

  /**
   * Return the name of the course
   */
  getUnits() {
    return this.units;
  }

  /**
   * Return the list of children course names
   */
  getChildren() {
    return this.children;
  }

  /**
   * Return the list of children course names
   */
  getParents() {
    return this.parents;
  }

  /**
   * Return the name of the course
   */
  isRoot() {
    if (this.parents && this.parents.length) {
      return false;
    }
    return true;
  }

  /**
   * Toggle color as a parent node
   */
  toggleAsParent() {
    if (this.color === 'gray') {
      this.color = 'green';
    } else {
      this.color = 'gray';
    }
  }

  /**
   * Toggle color as a child node
   */
  toggleAsChild() {
    if (this.color === 'gray') {
      this.color = 'blue';
    } else {
      this.color = 'gray';
    }
  }
} // Course
