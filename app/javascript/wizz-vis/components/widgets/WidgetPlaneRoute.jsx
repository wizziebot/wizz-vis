/*jshint esversion: 6 */
import React from 'react';
import PropTypes from 'prop-types';
import ArrayUtil from './../../utils/array';
import gps_utils from './../../utils/gps';
import WidgetImage from './WidgetImage';
import PlaneRoute from './../PlaneRoute';
import Info from './../Info';
import * as common from './../../props';

export default class WidgetPlaneRoute extends React.Component {
  constructor(props) {
    super(props);

    this.image = {
      clientWidth: 0,
      clientHeight: 0,
      naturalWidth: 0,
      naturalHeight: 0
    };
  }

  // We have to wait until the image is loaded to retrieve the real width
  // and real height of the image.
  // The forceUpdate is needed because sometimes the data is caculated before
  // the image is loaded.
  handleImageLoaded() {
    this.forceUpdate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.height !== this.props.height ||
        prevProps.width !== this.props.width) {
      this.forceUpdate();
    }
  }

  transformData(data) {
    const data_unique = ArrayUtil.uniqueInOrder(data, 'coordinate');

    return (
      data_unique.map(function(d) {
        const {x, y} = gps_utils.translatePoint(...d.coordinate,
                                                this.image,
                                                this.props.options.gps_markers);
        return {
          x,
          y,
          timestamp: d.timestamp
        };
      }, this)
    );
  }

  get imageURL() {
    return this.props.options.image;
  }

  get keepRatio() {
    return this.props.options.keep_ratio;
  }

  render () {
    if(this.props.error)
      return(<Info error={this.props.error} />)

    const data = this.transformData(this.props.data);

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <WidgetImage
          width={this.image.clientWidth}
          height={this.image.clientHeight}
          keepRatio={this.keepRatio}
          image={this.imageURL}
          onLoad={this.handleImageLoaded.bind(this)}
          ref={(node) => node ? this.image = node.image : null}>
          {
            data.length > 0 &&
              <PlaneRoute
                width={this.image.clientWidth}
                height={this.image.clientHeight}
                data={data}
              />
          }
        </WidgetImage>
      </div>
    )
  }
};

WidgetPlaneRoute.propTypes = {
  ...common.BASE,
  ...common.SIZE,
  options: PropTypes.shape({
    ...common.PLANE
  })
};
