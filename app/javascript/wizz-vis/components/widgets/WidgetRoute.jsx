/* jshint esversion: 6 */
import React, { Component } from 'react';
import { Map, TileLayer, AttributionControl } from 'react-leaflet';
import L from 'leaflet';
import cs from 'classnames';
import Theme from './../../utils/theme';
import Errors from './../../utils/errors';
import Info from './../Info';
import Routing from '../Routing';

export default class WidgetRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      $$data: [],
      error: null,
      grouped_dimension: '',
      coordinate_dimension: '',
      fetchDataError: null
    };
  }

  componentDidUpdate(){
    if(this.map !== undefined && this.map !== null)
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
        .then(response => Errors.handleErrors(response))
        .then(data => this.setData(data))
        .then(data => button.removeClass('active'))
        .catch(error => {
          button.removeClass('active');
          this.setState({ error: error.error, $$data: [] });
        })
    );
  }

  setData(data) {
    if(data)
      this.setState({ $$data: data, error: null });
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
    const cssClass = cs({ 'widget-error': this.state.error });
    return (
      <div className={ cssClass }>
        { this.state.error ? <Info error={this.state.error} /> : null }
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
            routeProfile={this.props.options.route_profile || 'driving'}
            distanceUnit={this.props.options.distance_unit || 'km'}
            waypoints={this.state.$$data}
            map={this.map} />
        </Map>
      </div>
    );
  }
}
