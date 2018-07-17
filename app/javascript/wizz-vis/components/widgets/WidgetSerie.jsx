/* jshint esversion: 6 */

import React from 'react';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
         LineChart, Line, AreaChart, Area, BarChart, Bar,
         ReferenceLine, Label } from 'recharts';
import Colors from './../../utils/colors';
import Theme from './../../utils/theme';
import Time from './../../utils/time';
import Format from './../../utils/format';
import Compare from './../../utils/compare';
import Info from './../Info';
import castArray from 'lodash/castArray';
import WidgetResume from './WidgetResume';

export default class WidgetSerie extends React.Component {
  constructor(props) {
    super(props);
    this.formatXAxis = this.formatXAxis.bind(this);
    this.minTickGap = this.minTickGap.bind(this);

    this.state = {
      aggregators: []
    };

    this.components = {
      line: { type: LineChart, shape: Line },
      area: { type: AreaChart, shape: Area },
      bar:  { type: BarChart,  shape: Bar }
    };
  }

  componentDidMount() {
    this.setAggregators();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.aggregators !== this.props.aggregators ||
      prevProps.options.metrics !== this.props.options.metrics)
      this.setAggregators();
  }

  transformData(data) {
    if (this.props.compare_interval) {
      return this.transformCompareData(data);
    } else {
      return data.map((d) => {
        return {...d, unixTime: Time.moment(d.timestamp).unix() * 1000};
      });
    }
  }

  transformCompareData(data) {
    let compare_end_index = -1;

    // search the index of the last elemet from the compare interval
    for (let index = data.length - 1; index >= 0; index--) {
        const d = data[index];
        if (d.timestamp <= this.props.compare_interval[1]) {
          compare_end_index = index;
          break;
        }
    }

    // there are no data from compare interval
    if(compare_end_index == -1){
      return data.map((d) => {
        return {...d, unixTime: Time.moment(d.timestamp).unix() * 1000};
      });
    }

    const start_index = data.findIndex((d) => {
      return d.timestamp >= this.props.interval[0];
    });

    const compare_data = data.slice(0, compare_end_index);
    const actual_data = data.slice(start_index);

    const unified_data = Compare.unify_data(actual_data, compare_data, this.state.aggregators, this.props.options.compare);

    return unified_data.map((d) => {
      return {...d, unixTime: Time.moment(d.timestamp).unix() * 1000};
    });
  }

  setAggregators() {
    if (this.props.options.metrics) {
      this.setState({
        aggregators: castArray(this.props.options.metrics)
      });
    } else {
      this.setState({
        aggregators: this.props.aggregators.map((a) => (a.name))
      });
    }
  }

  formatXAxis(unixTime) {
    return Time.format(Time.moment(unixTime), this.props.interval);
  }

  minTickGap() {
    if(this.props.data.length < 2) return 0;

    let time_1 = this.props.data[0].timestamp,
        time_2 = this.props.data[1].timestamp;

    return Time.gap(time_1, time_2, this.props.interval);
  }

  formatYAxis(value) {
    return Format.prefix(value, 2);
  }

  step() {
    if(this.props.data.length < 2 || this.props.options.type !== 'bar') return 0;

    return Time.step(
      this.props.data[1].timestamp,
      this.props.data[0].timestamp
    );
  }

  getHeight() {
    if (this.props.options.compare) {
      return 100 - this.state.aggregators.length * 8 + '%';
    } else {
      return '100%';
    }
  }

  render () {
    if(this.props.error || this.props.data.length == 0) {
      return(<Info error={this.props.error} />)
    } else {
      const data = this.transformData(this.props.data);
      const gap = this.minTickGap();
      const start_time = Time.moment(this.props.interval[0]).add(this.step()).unix() * 1000;
      const end_time = Time.moment(this.props.interval[1]).subtract(this.step()).unix() * 1000;

      const Chart = this.components[this.props.options.type || 'line'];

      return (
        <div style = {{ position: 'relative', width: '100%', height: '100%' }} >
          <WidgetResume
            compare={this.props.options.compare}
            aggregators={this.state.aggregators}
            data={data} />

          <ResponsiveContainer height={this.getHeight()}>
            <Chart.type data={data}
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
               <Legend iconType='plainline' />
               {
                 this.state.aggregators.map((agg, color) => {
                   return(
                     Compare.graph_types(agg, this.props.options.compare).map((cg, index) => {
                       return (
                         <Chart.shape
                           key={ 'shape-' + agg + index } type="monotone"
                           dataKey={ cg != 'actual' ? cg : agg }
                           stroke={ Colors.get(color) } dot={false}
                           fill={ Colors.get(color) }
                           strokeDasharray={ cg != 'actual' ? '8 3' : null} />
                       )
                     })
                   )
                 })
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
        </div>
      )
    }
  }
}
