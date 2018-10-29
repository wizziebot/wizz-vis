/*jshint esversion: 6 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer, AttributionControl } from 'react-leaflet';
import WidgetMarker from '../WidgetMarker';
import WidgetPopup from '../WidgetPopup';
import Theme from './../../utils/theme';
import Format from './../../utils/format';
import Locatable from './../../models/locatable';
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
import uniqWith from 'lodash/uniqWith';
import isEqual from 'lodash/isEqual';
import cs from 'classnames';
import Info from './../Info';
import * as common from './../../props';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default class WidgetLocation extends React.Component {
  constructor(props) {
    super(props);

    this.coordinate_field = '';
    this.aggregators = [];
    this.grouped_dimensions = [];
  }

  componentDidMount() {
    this.setDimensionsAggregators();
  }

  componentDidUpdate(prevProps) {
    if(this.refs.map !== undefined)
      this.refs.map.leafletElement.invalidateSize();

    if (prevProps.aggregators !== this.props.aggregators ||
      prevProps.dimensions !== this.props.dimensions ||
      prevProps.options.metrics !== this.props.options.metrics){
      this.setDimensionsAggregators();
    }
  }

  setDimensionsAggregators() {
    [this.coordinate_field, this.grouped_dimensions, this.aggregators] =
      Locatable.getDimensionsAggregators(this.props.dimensions,
                                         this.props.aggregators,
                                         this.props.options);
  }

  transformData(data) {
    return (
      data.filter((d) =>
        d[this.coordinate_field] !== null &&
        d[this.coordinate_field] !== "NaN,NaN"
      ).map((d) => {
        return {
          position: d[this.coordinate_field].split(',')
                    .map((e) => (parseFloat(e))),
          label: {
            dimensions: this.grouped_dimensions.map((dim) => {
              return {name: dim.name, value: d[dim.name]};
            }),
            aggregators: this.aggregators.map((agg) => {
              return {name: agg, real_value: d[agg], value: Format.prefix(d[agg], 2)};
            })
          }
        };
      }, this)
    );
  }

  getBounds(data) {
    const bounds = uniqWith(data.map((e) => (e.position)), isEqual);

    if(bounds.length == 1) {
      return { center: bounds[0], zoom: 18 };
    } else if(bounds.length > 1) {
      return { bounds: bounds };
    } else {
      return { center: [0, 0], zoom: 1 };
    }
  }

  render () {
    const cssClass = cs({ 'widget-error': this.props.error });
    const data = this.transformData(this.props.data);
    const bound_params = this.getBounds(data);

    return (
      <div className={ cssClass }>
        { this.props.error ? <Info error={this.props.error} /> : null }
        <Map
          {...bound_params}
          scrollWheelZoom={false}
          attributionControl={false}
          ref='map'
        >
          <AttributionControl
            position="bottomleft"
          />
          <TileLayer
            url={Theme.map(this.props.theme).url}
            attribution={Theme.map(this.props.theme).attribution}
          />
          {
            data.map((element, index) => (
              <WidgetMarker element={element} key={index}>
                <WidgetPopup
                  dimensions={element.label.dimensions}
                  aggregators={element.label.aggregators}
                />
              </WidgetMarker>
            ))
          }
        </Map>
      </div>
    );
  }
};

WidgetLocation.propTypes = {
  ...common.BASE,
  options: PropTypes.object,
  theme: PropTypes.oneOf(['dark', 'light']),
  aggregators: PropTypes.arrayOf(PropTypes.object).isRequired,
  dimensions: PropTypes.arrayOf(PropTypes.object).isRequired
};
