/*jshint esversion: 6 */
import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, AttributionControl } from 'react-leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer';
import cs from 'classnames';
import Theme from './../../utils/theme';
import Info from './../Info';
import get from 'lodash/get';

export default class WidgetHeatmap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      aggregator: '',
      coordinate_dimension: ''
    };
  }

  componentDidMount() {
    this.setCoordinateDimension();
    this.setAggregator();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.aggregators !== this.props.aggregators ||
      prevProps.dimensions !== this.props.dimensions ||
      prevProps.options.metrics !== this.props.options.metrics){
      this.setCoordinateDimension();
      this.setAggregator();
    }
  }

  transformData(data) {
    return (
      data.filter((d) => d[this.state.coordinate_dimension] !== null).map((d) => (
        {
          position: d[this.state.coordinate_dimension].split(',')
                    .map((e) => (parseFloat(e))),
          aggregator: d[this.state.aggregator]
        }
      ))
    );
  }

  setCoordinateDimension() {
    let coordinate_dimension =
      this.props.dimensions.find((e) => (
        /coordinate|latlong|latlng/.test(e.name)
      ));

    this.setState({
      coordinate_dimension: coordinate_dimension.name
    });
  }

  setAggregator() {
    this.setState({
      aggregator: this.props.options.metrics || this.props.aggregators[0].name
    });
  }

  getMax(data) {
    const value_type = get(this.props, 'options.max_value') || 'max';
    const data_length = data.length;

    if (data_length == 0)
      return 0;

    if (value_type === 'average') {
      return data.map(d => d.aggregator).reduce((a,b) => a + b, 0) / data_length;
    } else if (Number.parseFloat(value_type)) {
      return Number.parseFloat(value_type);
    } else {
      return Math.max(...data.map(d => d.aggregator));
    }
  }

  get maxZoom() {
    return get(this.props, 'options.max_zoom') || 1;
  }

  get blur() {
    return get(this.props, 'options.blur') || 10;
  }

  get radius() {
    return get(this.props, 'options.radius') || 20;
  }

  get gradient() {
    const gradient = {
      0.4: 'blue',
      0.6: 'cyan',
      0.7: 'lime',
      0.8: 'yellow',
      1.0: 'red'
    };

    return get(this.props, 'options.gradient') || gradient;
  }

  render () {
    const cssClass = cs({ 'widget-error': this.state.error });

    const data = this.transformData(this.props.data);

    return (
      <div className={ cssClass }>
        { this.props.error ? <Info error={this.props.error} /> : null }
        <Map
          center={[0,0]}
          zoom={13}
          scrollWheelZoom={false}
          attributionControl={false}
        >
          <HeatmapLayer
            fitBoundsOnLoad
            fitBoundsOnUpdate
            points={ data }
            longitudeExtractor={m => m.position[1]}
            latitudeExtractor={m => m.position[0]}
            intensityExtractor={m => m.aggregator}
            gradient={this.gradient}
            radius={parseFloat(this.radius)}
            blur={parseFloat(this.blur)}
            max={parseFloat(this.getMax(data))}
            maxZoom={parseFloat(this.maxZoom)} />
          <AttributionControl
            position="bottomleft"
          />
          <TileLayer
            url={Theme.map(this.props.theme).url}
            attribution={Theme.map(this.props.theme).attribution}
          />
        </Map>
      </div>
    );
  }
}
