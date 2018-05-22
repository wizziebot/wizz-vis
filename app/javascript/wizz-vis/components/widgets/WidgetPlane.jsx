/*jshint esversion: 6 */
import React from 'react';
import ReactHeatmap from '../../vendor/ReactHeatmap';
import gps_utils from './../../utils/gps';
import WidgetImage from './WidgetImage';
import Info from './../Info';

export default class WidgetPlane extends React.Component {
  constructor(props) {
    super(props);
    this.getImgSize = this.getImgSize.bind(this);

    this.state = {
      $$data: this.props.data,
      error: this.props.error,
      gps_markers: []
    };

    this.aggregator = '';
    this.coordinate_dimension = '';
    this.img_width = 0;
    this.img_height = 0;
  }

  componentDidMount() {
    this.setDimensionAggregator();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data || prevProps.error !== this.props.error) {
      this.setDimensionAggregator();
      this.setData();
    }
  }

  // We have to wait until the image is loaded to retrieve the real width
  // and real height of the image.
  handleImageLoaded() {
    this.getImgSize();
    this.setData();
  }

  setDimensionAggregator() {
    let coordinate_dimension =
      this.props.dimensions.find((e) => (
        /coordinate|latlong|latlng/.test(e.name)
      ));

    this.coordinate_dimension = coordinate_dimension.name;
    this.aggregator = this.props.options.metric || this.props.aggregators[0].name;
  }

  setData() {
    let data = this.props.data.filter((d) => d[this.coordinate_dimension] !== null);
    this.setState({
      $$data: data.map(function(d) {
        let latitude = d[this.coordinate_dimension].split(',')[0];
        let longitude = d[this.coordinate_dimension].split(',')[1];

        let {x, y} = this.translatePoint(latitude, longitude);

        return {
          x,
          y,
          value: d[this.aggregator]
        };
      }, this),
      error: this.props.error
    });
  }

  translatePoint(latitude, longitude) {
    const width = this.img_width;
    const height = this.img_height;

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
    this.img_width = image.naturalWidth;
    this.img_height = image.naturalHeight;
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
