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

    this.aggregator = '';
    this.coordinate_dimension = '';
    this.img_width = 0;
    this.img_height = 0;
  }

  componentDidMount() {
    this.setDimensionAggregator();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.aggregators !== this.props.aggregators ||
      prevProps.dimensions !== this.props.dimensions ||
      prevProps.options.metric !== this.props.options.metric){
      this.setDimensionAggregator();
    }
  }

  // We have to wait until the image is loaded to retrieve the real width
  // and real height of the image.
  // The forceUpdate is needed because sometimes the data is caculated before
  // the image is loaded.
  handleImageLoaded() {
    this.getImgSize();
    this.forceUpdate();
  }

  setDimensionAggregator() {
    let coordinate_dimension =
      this.props.dimensions.find((e) => (
        /coordinate|latlong|latlng/.test(e.name)
      ));

    this.coordinate_dimension = coordinate_dimension.name;
    this.aggregator = this.props.options.metric || this.props.aggregators[0].name;
  }

  transformData(data) {
    return (
      data.filter((d) => d[this.coordinate_dimension] !== null).map(function(d) {
        let latitude = d[this.coordinate_dimension].split(',')[0];
        let longitude = d[this.coordinate_dimension].split(',')[1];

        let {x, y} = this.translatePoint(latitude, longitude);

        return {
          x,
          y,
          value: d[this.aggregator]
        };
      }, this)
    );
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
    if(this.props.error)
      return(<Info error={this.props.error} />)

    const data = this.transformData(this.props.data);

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <WidgetImage
          keepRatio={this.props.options.keep_ratio}
          image={this.getImageURL()}
          onLoad={this.handleImageLoaded.bind(this)}
          ref={(node) => node ? this.image = node.image : null}
        />
      <ReactHeatmap
        data={data}
      />
      </div>
    )
  }
}
