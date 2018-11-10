/* jshint esversion: 6 */

import React from 'react';
import {Popup} from 'react-leaflet';
import WidgetPopupElement from './WidgetPopupElement';
import PropTypes from 'prop-types';

export default class WidgetPopup extends React.Component {
  render () {
    return (
      <Popup>
        <ul>
          {
            this.props.dimensions.map((dim, index) =>
              <WidgetPopupElement key={index} name={dim.name} value={dim.value} />
            )
          }
          {
            this.props.aggregators.map((agg, index) =>
              <WidgetPopupElement key={index} name={agg.name} value={agg.value} />
            )
          }
        </ul>
      </Popup>
    )
  }
}

WidgetPopup.propTypes = {
  dimensions: PropTypes.arrayOf(PropTypes.object),
  aggregators: PropTypes.arrayOf(PropTypes.object)
};
