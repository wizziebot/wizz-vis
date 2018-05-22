/* jshint esversion: 6 */
import React, { Component } from 'react';
import { Map, TileLayer, AttributionControl } from 'react-leaflet';
import L from 'leaflet';
import cs from 'classnames';
import Theme from './../../utils/theme';
import Info from './../Info';
import Routing from '../Routing';

export default class WidgetRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      $$data: this.props.data,
      error: this.props.error
    };
  }

  componentDidUpdate(){
    if(this.map !== undefined && this.map !== null)
      this.map.leafletElement.invalidateSize();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.$$data || nextProps.error !== prevState.error) {
      return {
        $$data: nextProps.data,
        error: nextProps.error
      };
    }

    // No state update necessary
    return null;
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
