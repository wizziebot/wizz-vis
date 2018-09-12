/* jshint esversion: 6 */

import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';
import Colors from './../../utils/colors';
import Theme from './../../utils/theme';
import Format from './../../utils/format';
import Info from './../Info';
import * as common from './../../props';

export default class WidgetPie extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dimension: null,
      aggregator: ''
    };
  }

  componentDidMount() {
    this.setDimension();
    this.setAggregator();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.aggregators !== this.props.aggregators ||
      prevProps.dimensions !== this.props.dimensions ||
      prevProps.options.metrics !== this.props.options.metrics
    ) {
      this.setDimension();
      this.setAggregator();
    }
  }

  setDimension() {
    this.setState({
      dimension: this.props.dimensions[0].name
    });
  }

  setAggregator() {
    this.setState({
      aggregator: this.props.options.metrics || this.props.aggregators[0].name
    });
  }

  customTooltip(value, total) {
    let payload = value.payload[0];
    if(payload != undefined) {
      let percentage = payload.value / total;
      return (
        <span style={{ color: payload.payload.fill }}>
          {`${payload.name || 'N/A'}: ${Format.fixed(payload.value)} (${(percentage * 100).toFixed(0)}%)`}
        </span>
      )
    }
  }

  render () {
    const aggregator = this.state.aggregator;
    const dimension = this.state.dimension;
    const total = this.props.data.reduce(function add(sum, item) {
      return sum + item[aggregator];
    }, 0);

    if(this.props.error || this.props.data.length == 0) {
      return(<Info error={this.props.error} />)
    } else {
      return (
        <ResponsiveContainer>
          <PieChart>
            <Pie data={this.props.data}
                 dataKey={aggregator}
                 nameKey={dimension}
                 fill="#8884d8"
                 innerRadius="50">
              {
                this.props.data.map((element, index) => (
                  <Cell
                    key={index}
                    fill={Colors.get(index)}
                    stroke={Theme.grid(this.props.theme)}
                    name={element[dimension] || 'N/A'}
                  />
                ))
              }
            </Pie>
            <Legend />
            <Tooltip content={ (value) => this.customTooltip(value, total) }
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
};

WidgetPie.propTypes = {
  ...common.BASE,
  options: PropTypes.object,
  theme: PropTypes.oneOf(['dark', 'light']),
  aggregators: PropTypes.arrayOf(PropTypes.object).isRequired,
  dimensions: PropTypes.arrayOf(PropTypes.object).isRequired
};
