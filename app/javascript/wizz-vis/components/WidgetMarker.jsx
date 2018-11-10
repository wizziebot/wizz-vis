/* jshint esversion: 6 */

import React from 'react';
import {Marker} from 'react-leaflet';
import PropTypes from 'prop-types';

export default class WidgetMarker extends React.Component {
  render () {
    return (
      <Marker position={ this.props.element.position }>
        {this.props.children}
      </Marker>
    )
  }
}

WidgetMarker.propTypes = {
  element: PropTypes.shape({
    position: PropTypes.arrayOf(PropTypes.number),
    label: PropTypes.shape({
      dimensions: PropTypes.arrayOf(PropTypes.object),
      aggregators: PropTypes.arrayOf(PropTypes.object)
    })
  })
};
