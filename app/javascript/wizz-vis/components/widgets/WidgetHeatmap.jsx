/*jshint esversion: 6 */
import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, AttributionControl } from 'react-leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer';
import cs from 'classnames';
import Theme from './../../utils/theme';
import Errors from './../../utils/errors';
import Info from './../Info';

export default class WidgetHeatmap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      $$data: [],
      error: null,
      aggregator: '',
      coordinate_dimension: ''
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
        .then(response => Errors.handleErrors(response))
        .then(data => this.filterData(data))
        .then(data => this.setData(data))
        .then(data => button.removeClass('active'))
        .catch(error => {
          button.removeClass('active');
          this.setState({ error: error.error, $$data: [] });
        })
    );
  }

  filterData(data) {
    if(data)
      return data.filter((d) => d[this.state.coordinate_dimension] !== null);
  }

  setData(data) {
    if(data)
      this.setState({
        $$data: data.map((d) => (
          {
            position: d[this.state.coordinate_dimension].split(',')
                      .map((e) => (parseFloat(e))),
            aggregator: d[this.state.aggregator]
          }
        )),
        error: null
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
