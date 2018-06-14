/* jshint esversion: 6 */

import React from 'react';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
         LineChart, Line, AreaChart, Area, BarChart, Bar,
         ReferenceLine, Label } from 'recharts';
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
      aggregator: '',
      dimension: ''
    };

    this.components = {
      line: { type: LineChart, shape: Line },
      area: { type: AreaChart, shape: Area },
      bar:  { type: BarChart,  shape: Bar }
    };
  }

  componentDidMount() {
    this.setAggregator();
    this.setDimension();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.aggregators !== this.props.aggregators ||
      prevProps.dimensions !== this.props.dimensions ||
      prevProps.options.metric !== this.props.options.metric
    ) {
      this.setAggregator();
      this.setDimension();
    }
  }

  transformData(data) {
    const values = data.values.map((d) => {
      return {...d, unixTime: Time.moment(d.timestamp).unix() * 1000};
    });

    return { values, dimensions: data.dimensions };
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

  formatXAxis(unixTime) {
    return Time.format(Time.moment(unixTime), this.props.interval);
  }

  minTickGap() {
    if(this.props.data.length < 2) return 0;

    let time_1 = this.props.data.values[0].timestamp,
        time_2 = this.props.data.values[1].timestamp;

    return Time.gap(time_1, time_2, this.props.interval);
  }

  formatYAxis(value) {
    return Format.prefix(value);
  }

  render () {
    if(this.props.error ||
       this.props.data.values == undefined ||
       this.props.data.values.length == 0) {
      return(<Info error={this.props.error} />)
    } else {
      const data = this.transformData(this.props.data);
      const gap = this.minTickGap();
      const start_time = Time.moment(this.props.interval[0]).unix() * 1000;
      const end_time = Time.moment(this.props.interval[1]).unix() * 1000;

      const Chart = this.components[this.props.options.type || 'line'];

      return (
        <ResponsiveContainer>
          <Chart.type data={data.values}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
              <XAxis
                dataKey = "unixTime"
                tickFormatter = {(unixTime) => this.formatXAxis(unixTime)}
                minTickGap = {gap}
                domain = {[start_time, end_time]}
                stroke = { Theme.text(this.props.theme) }
                tick = { { fontSize: 12 } }
                type = 'number'
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
               data.dimensions.map((a, index) => (
                 <Chart.shape key = { 'shape-' + index } type="monotone" dataKey = { a }
                   stroke = { Colors.get(index) } dot = { false }
                   fill = { Colors.get(index) }
                   stackId = { this.props.options.stacked ? 'stacked' : null } />
               ))
             }
             {
               (this.props.options.thresholds || []).map((threshold, index) => (
                 <ReferenceLine
                   key = { 'reference-' + index }
                   y = { threshold.value }
                   stroke = { threshold.color }
                   strokeDasharray='3 3' >
                   <Label
                     value = { threshold.label }
                     offset = { 3 }
                     position = 'insideBottomRight'
                     stroke = { Theme.text(this.props.theme) } />
                 </ReferenceLine>
               ))
             }
          </Chart.type>
        </ResponsiveContainer>
      )
    }
  }
}
