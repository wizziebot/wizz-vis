/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import { MapControl } from 'react-leaflet';
import L from 'leaflet';
import Graph from './../utils/graph';

export default class LegendControl extends MapControl {

  componentWillMount() {
    const legend = L.control({position: 'bottomright'});
    var div = L.DomUtil.create('div', 'legend');

    legend.onAdd = function (map) {
      div.innerHTML = '';
      return div;
    };

    legend.update = function (props) {
      div.innerHTML = '';
      div.id = 'legend_' + props.id;
      var legend = Graph.legend(props, '.legend#legend_' + props.id);
    };

    this.leafletElement = legend;
  }

  componentDidUpdate() {
    this.leafletElement.update(this.props);
  }
};

LegendControl.propTypes = {
  max: PropTypes.number,
  gradient: PropTypes.object
};
