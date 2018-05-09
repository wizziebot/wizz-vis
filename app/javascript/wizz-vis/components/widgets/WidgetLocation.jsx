/*jshint esversion: 6 */
import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, AttributionControl } from 'react-leaflet';
import Theme from './../../utils/theme';
import Errors from './../../utils/errors';
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
import uniqWith from 'lodash/uniqWith';
import isEqual from 'lodash/isEqual';
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
      $$data: [],
      error: null,
      aggregator: '',
      grouped_dimension: '',
      coordinate_dimension: '',
      fetchDataError: null
    };
  }

  componentDidUpdate(){
    if(this.refs.map !== undefined)
      this.refs.map.leafletElement.invalidateSize();
  }

  componentDidMount() {
    this.setAggregator();
    this.setDimensions();
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
        .then(data => this.setData(data))
        .then(data => button.removeClass('active'))
        .catch(error => {
          button.removeClass('active');
          this.setState({ error: error.error });
        })
    );
  }

  setData(data) {
    if(data)
      this.setState({
        $$data: data.map((d) => (
          {
            position: d[this.state.coordinate_dimension].split(',')
                      .map((e) => (parseFloat(e))),
            label: d[this.state.grouped_dimension]
          }
        )),
        error: null
      });
  }

  setAggregator() {
    this.setState({
      aggregator: this.props.aggregators[0].name
    });
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

  getBounds() {
    const bounds = uniqWith(this.state.$$data.map((e) => (e.position)), isEqual);

    if(bounds.length == 1) {
      return { center: bounds[0], zoom: 18 };
    } else if(bounds.length > 1) {
      return { bounds: bounds };
    } else {
      return { center: [0, 0], zoom: 1 };
    }
  }

  render () {
    if(this.state.error || this.state.$$data.length == 0) {
      return(<Info error={this.state.error} />)
    } else {
      const bound_params = this.getBounds();

      return (
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
            this.state.$$data.map((element, index) => (
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
      );
    }
  }
}
