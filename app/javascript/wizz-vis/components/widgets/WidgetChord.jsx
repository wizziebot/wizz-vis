/* jshint esversion: 6 */
import React from 'react';
import { Chord } from '@nivo/chord'
import graph_utils from './../../utils/graph';
import Format from './../../utils/format';
import Colors from './../../utils/colors';

export default class WidgetChord extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      aggregator: '',
      dimensions: [],
      matrix: {
        value: [],
        keys: []
      }
    };
  }

  componentDidMount() {
    this.fetchData();
    this.setAggregator();
    this.setDimensions();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reloadTimestamp !== this.props.reloadTimestamp) {
      this.fetchData();
    }
  }

  fetchData() {
    let button = $('.preloader-wrapper[widget_id="' + this.props.id + '"]');
    let component = this;
    button.addClass('active');
    return (
      fetch('/widgets/' + this.props.id + '/data.json')
        .then(response => response.json())
        .then(data => this.setState({
          matrix: graph_utils.chord(
            data,
            component.props.options.origin,
            component.props.options.destination,
            component.props.aggregators[0]
          )
        }))
        .then(data => button.removeClass('active'))
    );
  }

  setAggregator() {
    this.setState({
      aggregator: this.props.aggregators[0].name
    });
  }

  setDimensions() {
    this.setState({
      dimensions: this.props.dimensions
    });
  }

  render () {
    if(this.state.matrix.value.length == 0) {
      return(<h5>No data points.</h5>)
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
            matrix={this.state.matrix.value}
            keys={this.state.matrix.keys}
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
