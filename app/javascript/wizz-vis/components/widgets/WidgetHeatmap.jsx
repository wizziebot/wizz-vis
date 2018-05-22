/*jshint esversion: 6 */
import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, AttributionControl } from 'react-leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer';
import cs from 'classnames';
import Theme from './../../utils/theme';
import Info from './../Info';

export default class WidgetHeatmap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      $$data: this.props.data,
      error: this.props.error,
      aggregator: '',
      coordinate_dimension: ''
    };
  }

  componentDidMount() {
    this.setCoordinateDimension();
    this.setAggregator();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data || prevProps.error !== this.props.error) {
      this.setData();
    }
  }

  setData() {
    let data = this.props.data.filter((d) => d[this.state.coordinate_dimension] !== null);
    this.setState({
      $$data: data.map((d) => (
        {
          position: d[this.state.coordinate_dimension].split(',')
                    .map((e) => (parseFloat(e))),
          aggregator: d[this.state.aggregator]
        }
      )),
      error: this.props.error
    });
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
      aggregator: this.props.options.metric || this.props.aggregators[0].name
    });
  }

  render () {
    const cssClass = cs({ 'widget-error': this.state.error });

    return (
      <div className={ cssClass }>
        { this.state.error ? <Info error={this.state.error} /> : null }
        <Map
          center={[0,0]}
          zoom={13}
          scrollWheelZoom={false}
          attributionControl={false}
        >
          <HeatmapLayer
            fitBoundsOnLoad
            fitBoundsOnUpdate
            points={ this.state.$$data }
            longitudeExtractor={m => m.position[1]}
            latitudeExtractor={m => m.position[0]}
            intensityExtractor={m => m.aggregator} />
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
