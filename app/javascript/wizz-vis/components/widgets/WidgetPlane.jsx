/*jshint esversion: 6 */
import React from 'react';
import ReactHeatmap from '../../vendor/ReactHeatmap';
import gps_utils from './../../utils/gps';

export default class WidgetPlane extends React.Component {
  constructor(props) {
    super(props);
    this.getImgSize = this.getImgSize.bind(this);

    this.state = {
      $$data: [],
      aggregator: '',
      coordinate_dimension: '',
      img_width: 0,
      img_height: 0,
      gps_markers: [],
      fetchDataError: null
    };
  }

  componentDidMount() {
    this.getImgSize();
    this.setDimensionAggregator();
    this.fetchData();
  }

  setDimensionAggregator() {
    let coordinate_dimension =
      this.props.dimensions.find((e) => (
        /coordinate|latlong|latlng/.test(e.name)
      ));

    this.setState({
      coordinate_dimension: coordinate_dimension.name,
      aggregator: this.props.aggregators[0].name
    });
  }

  fetchData() {
    let button = $('.preloader-wrapper[widget_id="' + this.props.id + '"]');
    button.addClass('active');
    return (
      fetch('/widgets/' + this.props.id + '/data.json')
        .then(response => response.json())
        .then(data => data.filter((d) => d[this.state.coordinate_dimension] !== null))
        .then(
          data => data.map(function(d) {
            let latitude = d[this.state.coordinate_dimension].split(',')[0];
            let longitude = d[this.state.coordinate_dimension].split(',')[1];

            let {x, y} = this.translatePoint(latitude, longitude);

            return {
              x,
              y,
              value: d[this.state.aggregator]
            };
          }, this)
        )
        .then(data => this.setState({ $$data: data }))
        .then(data => button.removeClass('active'))
    );
  }

  translatePoint(latitude, longitude) {
    const width = this.state.img_width;
    const height = this.state.img_height;

    const {m_trans, m_offset} =
      gps_utils.latlngToPointMatrices(this.props.options.gps_markers,
                                      width,
                                      height);

    var {x, y} = gps_utils.latlngToPercent(latitude, longitude, width, height,
                                          m_trans, m_offset);

    return {x, y};
  }

  getImageURL() {
    return this.props.options.image;
  }

  getImgSize() {
    var newImg = new Image();
    var self = this;

    newImg.onload = function() {
      self.setState({
        img_width: newImg.width,
        img_height: newImg.height
      });
    };

    newImg.src = this.props.options.image;
  }

  render () {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <img style={{ position: 'absolute', top: 0, left: 0,
                      width: '100%', height: '100%' }}
          src = { this.getImageURL() }
        />
      <ReactHeatmap
        data={this.state.$$data}
      />
      </div>
    )
  }
}
