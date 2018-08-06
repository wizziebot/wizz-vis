/* jshint esversion: 6 */

import React from 'react';
import { Stage, Layer, Line, Circle, Label, Tag, Text } from 'react-konva';
import flatten from 'lodash/flatten';
import Colors from './../utils/colors';
import Time from './../utils/time';

export default class PlaneRoute extends React.Component {
  constructor(props) {
    super(props);
  }

  startPoint() {
    return this.props.data[0] || {x: 0, y: 0};
  }

  endPoint() {
    const data_length = this.props.data.length;
    const end_point = this.props.data[data_length - 1] || {x: 0, y: 0};
    return end_point;
  }

  getLine(index) {
    if(this.props.data.length == 0)
      return null;

    const start_point = [this.props.data[index].x, this.props.data[index].y];
    const end_point = [this.props.data[index+1].x, this.props.data[index+1].y];
    const timestamp = this.props.data[index+1].timestamp;
    const color = this.getColor(index);

    return (
      <Line
        points={[...start_point, ...end_point]}
        timestamp={timestamp}
        stroke={color}
        fill={color}
        strokeWidth={5}
        opacity={0.7}
        lineCap='round'
        lineJoin='round'
        tension={1}
        key={"line-" + index}
        onMouseOver={(e) => this.showTooltip(e)}
        onMouseOut={(e) => this.hideTooltip(e)}
      />
    )
  }

  getLines() {
    let lines = [];
    for(let i = 0; i < this.props.data.length - 1; i++) {
      lines.push(this.getLine(i))
    }

    return lines;
  }

  getColor(index) {
    const data_length = this.props.data.length;
    return Colors.interpolate('#3bb2d0', '#8a8acb', data_length - 1)[index];
  }

  getTooltipPosition(node){
    if (node.attrs.x && node.attrs.y) {
      return {x: node.attrs.x, y: node.attrs.y};
    } else {
      return {x: node.attrs.points[2], y: node.attrs.points[3]};
    }
  }

  showTooltip(evt) {
    const node = evt.target;
    if (node) {
      const tooltipPos = this.getTooltipPosition(node);
      this.refs.tooltip.setPosition({x: tooltipPos.x, y: tooltipPos.y});
      this.refs.tooltip.getText().fill(node.attrs.fill);
      this.refs.tooltip.getText().setText(Time.simple_format(node.attrs.timestamp));
      this.refs.tooltip.show();
      this.refs.layer.batchDraw();
    }
  }

  hideTooltip(evt) {
    this.refs.tooltip.hide();
    this.refs.layer.batchDraw();
  }

  render() {
    const start_point = this.startPoint();
    const end_point = this.endPoint();

    return(
      <Stage width={this.props.width} height={this.props.height}>
        <Layer ref="layer">
          <Circle
            {...start_point}
            stroke="#3bb2d0"
            fill="#3bb2d0"
            radius={10}
            onMouseOver={(e) => this.showTooltip(e)}
            onMouseOut={(e) => this.hideTooltip(e)}
          />
          { this.getLines() }
          <Circle
            {...end_point}
            stroke="#8a8acb"
            fill="#8a8acb"
            radius={10}
            onMouseOver={(e) => this.showTooltip(e)}
            onMouseOut={(e) => this.hideTooltip(e)}
          />
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
          <Text
            x={start_point.x - 4}
            y={start_point.y - 5}
            text="A"
            fontSize={12}
            fill="white"
          />
          <Text
            x={end_point.x - 4}
            y={end_point.y - 5}
            text="B"
            fontSize={12}
            fill="white"
          />
        </Layer>
      </Stage>
    )
  }
}
