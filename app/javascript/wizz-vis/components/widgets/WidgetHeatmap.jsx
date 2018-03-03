import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer';

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

  fetchData() {
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
    )
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
    })
  }

  render () {
    return (
      <div>
        <Map
          center={[0,0]}
          zoom={13}
          scrollWheelZoom={false}>
          <HeatmapLayer
            fitBoundsOnLoad
            fitBoundsOnUpdate
            points={ this.state.$$data }
            longitudeExtractor={m => m.position[1]}
            latitudeExtractor={m => m.position[0]}
            intensityExtractor={m => m.aggregator} />
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          />
        </Map>
      </div>
    );
  }
}
