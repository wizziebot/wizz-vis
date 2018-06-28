/* jshint esversion: 6 */

import React from 'react';
import { Chord } from '@nivo/chord';
import graph_utils from './../../utils/graph';
import Format from './../../utils/format';
import Colors from './../../utils/colors';
import Info from './../Info';

export default class WidgetChord extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      aggregator: ''
    };
  }

  componentDidMount() {
    this.setAggregator();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.aggregators !== this.props.aggregators ||
      prevProps.options.metrics !== this.props.options.metrics){
      this.setAggregator();
    }
  }

  setAggregator() {
    this.setState({
      aggregator: this.props.options.metrics || this.props.aggregators[0].name
    });
  }

  render () {
    const matrix = graph_utils.chord(
      this.props.data,
      this.props.options.origin,
      this.props.options.destination,
      this.state.aggregator
    );

    if(this.state.error || matrix.value.length == 0) {
      return(<Info error={this.state.error} />)
    } else {
      let legend_width = 0,
          legends = [],
          items_margin = 30;

      if(this.props.options.legend) {
        legends.push({
            "anchor": "right",
            "direction": "column",
            "translateY": 10,
            "translateX": items_margin,
            "itemWidth": 10,
            "itemHeight": 20,
            "symbolSize": 14,
            "symbolShape": "circle"
          })
        legend_width   = (this.props.width / 2) - items_margin;
      }

      return (
        <div className='widget-chord'>
          <Chord
            matrix={matrix.value}
            keys={matrix.keys}
            margin={{
                'top': 0,
                'right': legend_width,
                'bottom': 0,
                'left': 0
            }}
            width={this.props.width - items_margin}
            height={this.props.height - items_margin}
            padAngle={0.02}
            innerRadiusRatio={0.96}
            innerRadiusOffset={0.02}
            ribbonOpacity={0.5}
            enableLabel={false}
            colors={ Colors.all() }
            isInteractive={true}
            ribbonHoverOpacity={0.75}
            ribbonHoverOthersOpacity={0.25}
            tooltipFormat={value => Format.fixed(value)}
            legends={legends}
          />
        </div>
      )
    }
  }
}
