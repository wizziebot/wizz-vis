/* jshint esversion: 6 */

import React from 'react';

export default class WidgetTrash extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    if(this.props.isLocked) {
      return(null);
    } else {
      return(
        <span
          className='delete'
          onClick={this.props.remove}>
          <i className='material-icons'>delete</i>
        </span>
      )
    }
  }
}
