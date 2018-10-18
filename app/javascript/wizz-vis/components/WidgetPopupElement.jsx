/* jshint esversion: 6 */

import React from 'react';
import PropTypes from 'prop-types';

export default class WidgetPopupElement extends React.Component {
  render () {
    return (
      <li>
        <b>{this.props.name}:</b> {this.props.value}
      </li>
    )
  }
}

WidgetPopupElement.propTypes = {
  name: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ])
};
