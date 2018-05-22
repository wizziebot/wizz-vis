/* jshint esversion: 6 */

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';
import Colors from './../../utils/colors';
import Theme from './../../utils/theme';
import Format from './../../utils/format';
import Info from './../Info';

export default class WidgetPie extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      $$data: this.props.data,
      error: this.props.error,
      sum_total: 0,
      dimension: null,
      aggregator: ''
    };
  }

  componentDidMount() {
    this.setDimension();
    this.setAggregator();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.$$data || nextProps.error !== prevState.error) {
      const aggregator = nextProps.options.metric || nextProps.aggregators[0].name;
      return {
        $$data: nextProps.data,
        sum_total: nextProps.data.reduce(function add(sum, item) {
                     return sum + item[aggregator];
                   }, 0),
        error: nextProps.error
      };
    }

    // No state update necessary
    return null;
  }

  setDimension() {
    this.setState({
      dimension: this.props.dimensions[0].name
    });
  }

  setAggregator() {
    this.setState({
      aggregator: this.props.options.metric || this.props.aggregators[0].name
    });
  }

  customTooltip(value) {
    let payload = value.payload[0];
    if(payload != undefined) {
      let percentage = payload.value / this.state.sum_total;
      return (
        <span>
          {`${payload.name || 'N/A'}: ${Format.fixed(payload.value)} (${(percentage * 100).toFixed(0)}%)`}
        </span>
      )
    }
  }

  render () {
    if(this.state.error || this.state.$$data.length == 0) {
      return(<Info error={this.state.error} />)
    } else {
      return (
        <ResponsiveContainer>
          <PieChart>
            <Pie data={this.state.$$data}
                 dataKey={this.state.aggregator}
                 nameKey={this.state.dimension}
                 fill="#8884d8"
                 innerRadius="50">
              {
                this.state.$$data.map((element, index) => (
                  <Cell
                    key={index}
                    fill={Colors.get(index)}
                    stroke={Theme.grid(this.props.theme)}
                    name={element[this.state.dimension] || 'N/A'}
                  />
                ))
              }
            </Pie>
            <Legend />
            <Tooltip content={ this.customTooltip.bind(this) }
              wrapperStyle={{
                margin: '0px',
                padding: '10px',
                background: '#fff',
                border: '1px solid #ccc' }} />
          </PieChart>
        </ResponsiveContainer>
      )
    }
  }
}
