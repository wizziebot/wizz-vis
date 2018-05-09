/*jshint esversion: 6 */
import React from 'react';
import ReactHeatmap from '../../vendor/ReactHeatmap';
import gps_utils from './../../utils/gps';
import Errors from './../../utils/errors';
import WidgetImage from './WidgetImage';
import Info from './../Info';

export default class WidgetPlane extends React.Component {
  constructor(props) {
    super(props);
    this.getImgSize = this.getImgSize.bind(this);

    this.state = {
      $$data: [],
      error: null,
      aggregator: '',
      coordinate_dimension: '',
      img_width: 0,
      img_height: 0,
      gps_markers: [],
      fetchDataError: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reloadTimestamp !== this.props.reloadTimestamp) {
      this.handleImageLoaded();
    }
  }

  // We have to wait until the image is loaded to retrieve the real width
  // and real height of the image.
  handleImageLoaded() {
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
        .then(response => Errors.handleErrors(response))
        .then(data => this.filterData(data))
        .then(data => this.setData(data))
        .then(data => button.removeClass('active'))
        .catch(error => {
          button.removeClass('active');
          this.setState({ error: error.error });
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
        $$data: data.map(function(d) {
          let latitude = d[this.state.coordinate_dimension].split(',')[0];
          let longitude = d[this.state.coordinate_dimension].split(',')[1];

          let {x, y} = this.translatePoint(latitude, longitude);

          return {
            x,
            y,
            value: d[this.state.aggregator]
          };
        }, this),
        error: null
      });
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
    const image = this.image;

    this.setState({
      img_width: image.naturalWidth,
      img_height: image.naturalHeight
    });
  }

  render () {
    if(this.state.error)
      return(<Info error={this.state.error} />)

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <WidgetImage
          keepRatio={this.props.options.keep_ratio}
          image={this.getImageURL()}
          onLoad={this.handleImageLoaded.bind(this)}
          ref={(node) => node ? this.image = node.image : null}
        />
      <ReactHeatmap
        data={this.state.$$data}
      />
      </div>
    )
  }
}
