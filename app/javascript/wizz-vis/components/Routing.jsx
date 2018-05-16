/* jshint esversion: 6 */

import React, { Component } from 'react';
import ArrayUtil from './../utils/array';
import Time from './../utils/time';
import L from 'leaflet';
import { Popup } from 'react-leaflet';
import 'leaflet-routing-machine';
import '../vendor/leaflet.textpath.js';

function number_to_letter(number) {
  return (number + 10).toString(36).toUpperCase();
}

function StartMarker (routing_index) {
  return L.divIcon({
    className: 'route-marker start-marker',
    iconSize: [40, 40],
    html: number_to_letter(routing_index)
  });
}

function EndMarker (routing_index) {
  return L.divIcon({
    className: 'route-marker end-marker',
    iconSize: [40, 40],
    html: number_to_letter(routing_index + 1)
  });
}

function humanize_distance (meters, unit) {
  if(unit == 'mi'){
    return `${(meters/1609.34).toFixed(2)} mi`;
  } else {
    return `${(meters/1000).toFixed(2)} km`;
  }
}

export default class Routing extends React.Component {
  constructor(props) {
    super(props);
    this.createRouting = this.createRouting.bind(this);
    this.refreshRouting = this.refreshRouting.bind(this);
    this.destroyRouting = this.destroyRouting.bind(this);
  }

  componentDidMount() {
    this.refreshRouting();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextProps.waypoints) !== JSON.stringify(this.props.waypoints);
  }

  componentDidUpdate() {
    this.refreshRouting();
  }

  componentWillUnmount() {
    this.destroyRouting();
  }

  /**
   * Create a route from the passed waypoints.
   *
   * @param {Object[]} points
   * @param {number[]} points[].coordinate
   * @param {String} points[].timestamp
   * @param {number} routing_index
   * @returns {L.Routing.control}
   */
  createRouting(points, routing_index) {
    const waypoints = points.map((waypoint) => {
      return new L.Routing.Waypoint(
        waypoint.coordinate,
        Time.simple_format(waypoint.timestamp)
      );
    });

    const start_time = points[0].timestamp;
    const end_time = points.slice(-1)[0].timestamp;
    const duration = Time.duration(start_time, end_time);
    let distance;

    const routeControl = L.Routing.control({
      addWaypoints: false,
      fitSelectedRoutes: true,
      plan: L.Routing.plan(
        waypoints,
        {
          // create only first and last marker
          createMarker: function(i, wp, n) {
            if (i == 0) {
              const marker =  L.marker(wp.latLng, {
                draggable: false,
                icon: StartMarker(routing_index)
              })
              .bindPopup(
                Time.simple_format(start_time),
                {
                  closeButton: false,
                  className: 'marker-popup'
                }
              );

              marker.on('mouseover', function (e) {
                this.openPopup();
              });
              marker.on('mouseout', function (e) {
                this.closePopup();
              });

              return marker;
            } else if (i == n - 1) {
              return L.marker(wp.latLng, {
                draggable: false,
                icon: EndMarker(routing_index)
              });
            } else {
              return  false;
            }
          }
        }
      ),
      router: L.Routing.mapbox(
        window.mapbox_token,
        {
          profile: `mapbox/${this.props.routeProfile}`
        }
      ),
      // change the color and show the direction of the route when hovering on it.
      // Also, show a popup for route's duration.
      routeLine: function(route) {
        let polyline = L.polyline(route.coordinates, {
          color: '#3bb2d0', opacity: 1, weight: 3
        })
        .bindPopup(
          `<div>${number_to_letter(routing_index)} -> ${number_to_letter(routing_index + 1)}</div>
        <div>${duration}</div>
        <div>${distance}</div>`,
          {
            closeButton: false,
            className: 'route-popup'
          }
        );

        polyline.on('mouseover', function(e) {
          this.openPopup(e.latlng);

          const layer = e.target;
          layer.setText('      ►      ', {
            repeat: true,
            center: true,
            attributes: {fill: '#33334B'}
          });

          layer.setStyle({
              color: '#8a8acb',
              weight: 4
          });
        });

        polyline.on('mouseout', function(e) {
          this.closePopup();
          const layer = e.target;

          layer.setText(null);

          layer.setStyle({
              color: '#3bb2d0',
              weight: 3
          });
        });

        return polyline;
      }
    });

    routeControl.on('routesfound', function (e) {
      const meters = e.routes[0].summary.totalDistance;
      distance = humanize_distance(meters, this.props.distanceUnit);
    }, this);

    return routeControl;
  }

  // create a new route, deleting the old one.
  refreshRouting() {
    this.destroyRouting();

    if (this.props.map) {
      // remove adjacent waypoints with same coordinate
      const waypoints = ArrayUtil.uniqueInOrder(this.props.waypoints, 'coordinate');
      const waypoints_length = waypoints.length;

      this.routing = [];
      this.distance = 0;
      let routing_index = 0;
      let index = 0;

      // create a new route every 25 waypoints.
      // this is a Mapbox limitation.
      // routing.hide() is called to disable the resume of the route in the GUI.
      while(index < waypoints_length) {
        let sub_waypoints = waypoints.slice(index, index + 25);
        let routing = this.createRouting(sub_waypoints, routing_index);
        routing.on('routesfound', function(e){
          this.distance += e.routes[0].summary.totalDistance;
          this.refs.distance.textContent = humanize_distance(this.distance, this.props.distanceUnit);
        }, this);
        this.routing.push(routing);
        this.props.map.leafletElement.addControl(routing);
        routing.hide();
        index = index + 24;
        routing_index++;
      }

      if(waypoints.length > 0){
        const start_time = waypoints[0].timestamp;
        const end_time = waypoints.slice(-1)[0].timestamp;
        const duration = Time.duration(start_time, end_time);

        this.refs.duration.textContent = duration;
      }
    }
  }

  destroyRouting() {
    if (this.props.map && this.routing) {
      this.routing.forEach(function(routing){
        this.props.map.leafletElement.removeControl(routing);
      }, this);

      this.routing = undefined;
    }
  }

  render() {
    return (
      <div className='route_resume'>
        <div className='route_duration'>
          <div>Duration</div>
          <div className='resume_value' ref="duration">0</div>
        </div>
        <div className='route_distance'>
          <div>Distance</div>
          <div className='resume_value' ref="distance">0</div>
        </div>
      </div>
    )
  }
}
