/*jshint esversion: 6 */
import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, AttributionControl } from 'react-leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer';
import Theme from './../../utils/theme';

export default class WidgetHeatmap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      $$data: [],
      aggregator: '',
      coordinate_dimension: '',
      fetchDataError: null
    };
  }

  componentDidMount() {
    this.setCoordinateDimension();
    this.setAggregator();
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reloadTimestamp !== this.props.reloadTimestamp) {
      this.fetchData();
    }
  }

  fetchData() {
    let button = $('.preloader-wrapper[widget_id="' + this.props.id + '"]');
    button.addClass('active');
    return (
      fetch('/widgets/' + this.props.id + '/data.json')
        .then(response => response.json())
        .then(data => data.filter((d) => d[this.state.coordinate_dimension] !== null))
        .then(data => data.map((d) => (
          {
            position: d[this.state.coordinate_dimension].split(',')
                      .map((e) => (parseFloat(e))),
            aggregator: d[this.state.aggregator]
          }
        )))
        .then(data => this.setState({ $$data: data }))
        .then(data => button.removeClass('active'))
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
      aggregator: this.props.aggregators[0].name
    });
  }

  render () {
    if(this.state.$$data.length == 0) {
      return(<h5>No data points.</h5>)
    } else {
      return (
        <div>
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
}
