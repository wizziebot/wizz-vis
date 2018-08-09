/*jshint esversion: 6 */
import React from 'react';
import { Stage, Layer, Circle, Label, Tag, Text } from 'react-konva';
import WidgetImage from './WidgetImage';
import Info from './../Info';
import gps_utils from './../../utils/gps';
import Time from './../../utils/time';
import Format from './../../utils/format';
import castArray from 'lodash/castArray';
import sortBy from 'lodash/sortBy';

const DEFAULT_MARKER_COLOR = "#8a8acb";

export default class WidgetPlane extends React.Component {
  constructor(props) {
    super(props);
    this.getImgSize = this.getImgSize.bind(this);

    this.coordinate_dimension = '';
    this.aggregators = [];
    this.grouped_dimensions = [];

    this.natural_width = 0;
    this.natural_height = 0;
    this.client_width = 0;
    this.client_height = 0;
  }

  componentDidMount() {
    this.setDimensionsAggregator();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.height !== this.props.height ||
        prevProps.width !== this.props.width) {
      this.getImgSize();
      this.forceUpdate();
    } else if (prevProps.aggregators !== this.props.aggregators ||
               prevProps.dimensions !== this.props.dimensions ||
               prevProps.options.metrics !== this.props.options.metrics) {
      this.setDimensionsAggregator();
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

  setDimensionsAggregator() {
    const coordinate_dimension =
      this.props.dimensions.find((e) => (
        /coordinate|latlong|latlng/.test(e.name)
      ));

    this.coordinate_dimension = coordinate_dimension.name;

    this.grouped_dimensions = this.props.dimensions.filter((e) => (
      e.name !== coordinate_dimension.name
    ));

    this.aggregators = (this.props.options.metrics && castArray(this.props.options.metrics)) ||
                       this.props.aggregators.map((a) => (a.name));
  }

  getMainAggregator() {
    return this.props.options.threshold_metric || this.aggregators[0];
  }

  transformData(data) {
    return (
      data.filter((d) =>
        d[this.coordinate_dimension] !== null &&
        d[this.coordinate_dimension] !== "NaN,NaN"
      ).map((d) => {
        let latitude = d[this.coordinate_dimension].split(',')[0];
        let longitude = d[this.coordinate_dimension].split(',')[1];

        let {x, y} = this.translatePoint(latitude, longitude);

        return {
          x,
          y,
          dimensions: this.grouped_dimensions.map((dim) => {
            return {name: dim.name, value: d[dim.name]};
          }),
          aggregators: this.aggregators.map((agg) => {
            return {name: agg, value: Format.prefix(d[agg], 2)};
          }),
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

  get keepRatio() {
    return this.props.options.keep_ratio;
  }

  get imageURL() {
    return this.props.options.image;
  }

  getImgSize() {
    const image = this.image;
    this.client_width = image.clientWidth;
    this.client_height = image.clientHeight;
    this.natural_width = image.naturalWidth;
    this.natural_height = image.naturalHeight;
  }

  tooltipPosition(node, width, height) {
    const node_x = node.attrs.x;
    const node_y = node.attrs.y;

    if (node_x < 100){
      return {x: node_x, y: node_y, pointerDirection: "left"};
    } else if(node_x > width - 100) {
      return {x: node_x, y: node_y, pointerDirection: "right"};
    } else if(node_y < 100){
      return {x: node_x, y: node_y, pointerDirection: "up"};
    } else {
      return {x: node_x, y: node_y, pointerDirection: "down"};
    }
  }

  tooltipText(node) {
    const dimensions = node.attrs.dimensions;
    const aggregators = node.attrs.aggregators;

    let text = [];

    dimensions.forEach((dimension) => {
      text.push(`${dimension.name}:\t${dimension.value}`);
    });

    aggregators.forEach((aggregator) => {
      text.push(`${aggregator.name}:\t${aggregator.value}`);
    });

    return text.join("\n");
  }

  showTooltip(evt) {
    const node = evt.target;
    if (node) {
      const tooltipPosition = this.tooltipPosition(node, this.props.width, this.props.height);
      this.refs.tooltip.setPosition({x: node.attrs.x, y: node.attrs.y});
      this.refs.tooltip.getTag().setPointerDirection(tooltipPosition.pointerDirection);
      this.refs.tooltip.getText().setText(this.tooltipText(node));
      this.refs.tooltip.show();
      this.refs.layer.batchDraw();
    }
  }

  hideTooltip(evt) {
    this.refs.tooltip.hide();
    this.refs.layer.batchDraw();
  }

  getColorFromThresholds(value) {
    const threshold = sortBy(this.props.options.thresholds, (t) => t[0])
                      .reverse()
                      .find((e) => value >= e[0]);
    if (threshold) return threshold[1];
    return DEFAULT_MARKER_COLOR;
  }

  getMarkerColor(marker) {
    if (this.props.options.thresholds == undefined)
      return DEFAULT_MARKER_COLOR;

    const main_aggregator = marker.aggregators.find((a) => (a.name == this.getMainAggregator()));
    if (main_aggregator) {
      return this.getColorFromThresholds(main_aggregator.value);
    } else {
      return DEFAULT_MARKER_COLOR;
    }
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
          <Stage width={this.client_width} height={this.client_height}>
            <Layer ref="layer">
              {
                data.map((element, index) => (
                  <Circle
                    key={index}
                    {...element}
                    stroke="black"
                    fill={ this.getMarkerColor(element) }
                    strokeWidth={1}
                    radius={10}
                    onMouseOver={(e) => this.showTooltip(e)}
                    onMouseOut={(e) => this.hideTooltip(e)}
                  />
                ))
              }
              <Label visible={false} ref="tooltip">
                <Tag
                  fill="white"
                  pointerDirection="down"
                  pointerWidth={10}
                  pointerHeight={10}
                  cornerRadius={5}
                  shadowColor="black"
                  shadowBlur={10}
                  shadowOffset={10}
                  shadowOpacity={0.5}
                />
                <Text
                  text=""
                  padding={5}
                  fill="black"
                />
              </Label>
            </Layer>
          </Stage>
        </WidgetImage>
      </div>
    )
  }
}
