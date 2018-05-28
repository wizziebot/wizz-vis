/*jshint esversion: 6 */
import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, AttributionControl } from 'react-leaflet';
import Theme from './../../utils/theme';
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
import uniqWith from 'lodash/uniqWith';
import isEqual from 'lodash/isEqual';
import cs from 'classnames';
import Info from './../Info';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default class WidgetLocation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      aggregator: '',
      grouped_dimension: '',
      coordinate_dimension: ''
    };
  }

  componentDidMount() {
    this.setAggregator();
    this.setDimensions();
  }

  componentDidUpdate(prevProps) {
    if(this.refs.map !== undefined)
      this.refs.map.leafletElement.invalidateSize();

    if (prevProps.aggregators !== this.props.aggregators ||
      prevProps.dimensions !== this.props.dimensions ||
      prevProps.options.metric !== this.props.options.metric){
      this.setAggregator();
      this.setDimensions();
    }
  }

  transformData(data) {
    return (
      data.map((d) => (
        {
          position: d[this.state.coordinate_dimension].split(',')
                    .map((e) => (parseFloat(e))),
          label: d[this.state.grouped_dimension]
        }
      ))
    );
  }

  setAggregator() {
    this.setState({
      aggregator: this.props.options.metric || this.props.aggregators[0].name
    });
  }

  setDimensions() {
    const coordinate_dimension =
      this.props.dimensions.find((e) => (
        /coordinate|latlong|latlng/.test(e.name)
      ));
    this.setState({ coordinate_dimension: coordinate_dimension.name });

    const grouped_dimension =
      this.props.dimensions.find((e) => (
        e.name !== coordinate_dimension.name
      ));
    this.setState({ grouped_dimension: grouped_dimension.name });
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
              <Marker
                position={ element.position }
                key={ index }>
                <Popup>
                  <span>{ element.label }</span>
                </Popup>
              </Marker>
            ))
          }
        </Map>
      </div>
    );
  }
}
