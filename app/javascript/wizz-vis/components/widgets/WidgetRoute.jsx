/* jshint esversion: 6 */
import React, { Component } from 'react';
import { Map, TileLayer, AttributionControl } from 'react-leaflet';
import Theme from './../../utils/theme';
import L from 'leaflet';
import Routing from '../Routing';

export default class WidgetRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      $$data: [],
      grouped_dimension: '',
      coordinate_dimension: '',
      fetchDataError: null
    };
  }

  componentDidUpdate(){
    if(this.map !== undefined)
      this.map.leafletElement.invalidateSize();
  }

  componentDidMount() {
    //this.setDimensions();
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reloadTimestamp !== this.props.reloadTimestamp)
      this.fetchData();
  }

  fetchData() {
    let button = $('.preloader-wrapper[widget_id="' + this.props.id + '"]');
    button.addClass('active');
    return (
      fetch('/widgets/' + this.props.id + '/data.json')
        .then(response => response.json())
        .then(data => this.setState({ $$data: data }))
        .then(data => button.removeClass('active'))
    );
  }

  setDimensions() {
    let coordinate_dimension =
      this.props.dimensions.find((e) => (
        /coordinate|latlong|latlng/.test(e.name)
      ));
    this.setState({ coordinate_dimension: coordinate_dimension.name });

    let grouped_dimension =
      this.props.dimensions.find((e) => (
        e.name !== coordinate_dimension.name
      ));
    this.setState({ grouped_dimension: grouped_dimension.name });
  }

  render () {
    return (
      <Map
        center={[0, 0]}
        zoom={1}
        scrollWheelZoom={false}
        attributionControl={false}
        ref={map => this.map = map}>
        <AttributionControl
          position="bottomleft"
        />
        <TileLayer
          url={Theme.route_map(this.props.theme).url}
          attribution={Theme.route_map(this.props.theme).attribution}
        />
        <Routing
          route_profile={this.props.options.route_profile || 'driving'}
          waypoints={this.state.$$data}
          map={this.map} />
      </Map>
    );
  }
}
