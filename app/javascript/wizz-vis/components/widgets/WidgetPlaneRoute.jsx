/*jshint esversion: 6 */
import React from 'react';
import ArrayUtil from './../../utils/array';
import gps_utils from './../../utils/gps';
import WidgetImage from './WidgetImage';
import PlaneRoute from './../PlaneRoute';
import Info from './../Info';

export default class WidgetPlaneRoute extends React.Component {
  constructor(props) {
    super(props);
    this.getImgSize = this.getImgSize.bind(this);

    this.natural_width = 0;
    this.natural_height = 0;
    this.client_width = 0;
    this.client_height = 0;
  }

  // We have to wait until the image is loaded to retrieve the real width
  // and real height of the image.
  // The forceUpdate is needed because sometimes the data is caculated before
  // the image is loaded.
  handleImageLoaded() {
    this.getImgSize();
    this.forceUpdate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.height !== this.props.height ||
        prevProps.width !== this.props.width) {
      this.getImgSize();
      this.forceUpdate();
    }
  }

  transformData(data) {
    const data_unique = ArrayUtil.uniqueInOrder(data, 'coordinate');

    return (
      data_unique.map(function(d) {
        const {x, y} = this.translatePoint(...d.coordinate);
        return {
          x,
          y,
          timestamp: d.timestamp
        };
      }, this)
    );
  }

  translatePoint(latitude, longitude) {
    const natural_width = this.natural_width;
    const natural_height = this.natural_height;

    const client_width = this.client_width;
    const client_height = this.client_height;

    const {m_trans, m_offset} =
      gps_utils.latlngToPointMatrices(this.props.options.gps_markers,
                                      natural_width, natural_height);

    var {x, y} = gps_utils.latlngToPoint(latitude, longitude, natural_width,
                                         natural_height, m_trans, m_offset);

    // Transform the points to real image's width and height
    x = (x * client_width) / natural_width;
    y = (y * client_height) / natural_height;

    return {x, y};
  }

  get imageURL() {
    return this.props.options.image;
  }

  get keepRatio() {
    return this.props.options.keep_ratio;
  }

  getImgSize() {
    const image = this.image;
    this.client_width = image.clientWidth;
    this.client_height = image.clientHeight;
    this.natural_width = image.naturalWidth;
    this.natural_height = image.naturalHeight;
  }

  render () {
    if(this.props.error)
      return(<Info error={this.props.error} />)

    const data = this.transformData(this.props.data);

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <WidgetImage
          keepRatio={this.keepRatio}
          image={this.imageURL}
          onLoad={this.handleImageLoaded.bind(this)}
          ref={(node) => node ? this.image = node.image : null}>
          {
            data.length > 0 &&
              <PlaneRoute
                width={this.client_width}
                height={this.client_height}
                data={data}
              />
          }
        </WidgetImage>
      </div>
    )
  }
}
