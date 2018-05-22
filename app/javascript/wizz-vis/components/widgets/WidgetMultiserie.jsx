/* jshint esversion: 6 */

import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
         Tooltip, Legend } from 'recharts';
import Colors from './../../utils/colors';
import Theme from './../../utils/theme';
import Time from './../../utils/time';
import Format from './../../utils/format';
import Info from './../Info';

export default class WidgetMultiserie extends React.Component {
  constructor(props) {
    super(props);
    this.formatXAxis = this.formatXAxis.bind(this);
    this.minTickGap = this.minTickGap.bind(this);

    this.state = {
      $$data: this.props.data,
      error: this.props.error,
      aggregator: '',
      dimension: ''
    };
  }

  componentDidMount() {
    this.setAggregator();
    this.setDimension();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.$$data || nextProps.error !== prevState.error) {
      return {
        $$data: nextProps.data,
        error: nextProps.error
      };
    }

    // No state update necessary
    return null;
  }

  setAggregator() {
    this.setState({
      aggregator: this.props.options.metric || this.props.aggregators[0].name
    });
  }

  setDimension() {
    this.setState({
      dimension: this.props.dimensions[0].name
    });
  }

  minTickGap() {
    if(this.state.$$data.values.length < 2) return 0;

    let time_1 = this.props.interval[0],
        time_2 = this.props.interval[1];

    return Time.gap(time_1, time_2, this.props.interval);
  }

  formatXAxis(time) {
    return Time.format(time, this.props.interval);
  }

  formatYAxis(value) {
    return Format.prefix(value);
  }

  render () {
    if(this.state.error ||
       this.state.$$data.values == undefined ||
       this.state.$$data.values.length == 0) {
      return(<Info error={this.state.error} />)
    } else {
      const gap = this.minTickGap();

      return (
        <ResponsiveContainer>
          <LineChart data={this.state.$$data.values}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
             <XAxis
               dataKey = "timestamp"
               tickFormatter={this.formatXAxis}
               interval = 'preserveStartEnd'
               minTickGap = {gap}
               domain = {['auto', 'auto']}
               stroke = { Theme.text(this.props.theme) }
               tick = { { fontSize: 12 } }
             />
             <YAxis
               tickFormatter={this.formatYAxis}
               interval = 'preserveStartEnd'
               stroke = { Theme.text(this.props.theme) }
               tick = { { fontSize: 12 } }
             />
             <CartesianGrid stroke = { Theme.grid(this.props.theme) } />
             <Tooltip
               formatter = { Format.fixed.bind(Format) }
               labelFormatter = { Time.simple_format }
               labelStyle = { { color: Theme.tooltip(this.props.theme).color } }
             />
             <Legend />
             {
               this.state.$$data.dimensions.map((a, index) => (
                 <Line key={ index } type="monotone" dataKey={ a } stroke={ Colors.get(index) } dot={false}/>
               ))
             }
          </LineChart>
        </ResponsiveContainer>
      )
    }
  }
}
