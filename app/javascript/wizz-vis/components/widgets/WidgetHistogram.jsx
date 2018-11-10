/* jshint esversion: 6 */

import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
         Tooltip, Legend, ReferenceLine, Label } from 'recharts';
import Colors from './../../utils/colors';
import Theme from './../../utils/theme';
import Format from './../../utils/format';
import graph_utils from './../../utils/graph';
import Info from './../Info';
import * as common from './../../props';
import castArray from 'lodash/castArray';

export default class WidgetHistogram extends React.Component {
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
      prevProps.options.metrics !== this.props.options.metrics)
      this.setAggregator();
  }

  formatYAxis(value) {
    return Format.prefix(value, 2);
  }

  setAggregator() {
    this.setState({
      aggregator: castArray(this.props.options.metrics)[0] || this.props.aggregators[0].name
    });
  }

  render () {
    if(this.props.error || this.props.data.length == 0) {
      return(<Info error={this.props.error} />)
    } else {
      const data = graph_utils.histogram(
        this.props.data,
        this.state.aggregator,
        this.props.options.discard_values
      );

      return (
        <ResponsiveContainer>
          <BarChart data={data}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
             <CartesianGrid stroke = { Theme.grid(this.props.theme) } />
             <XAxis
               dataKey = { 'range' }
               interval = 'preserveStartEnd'
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
             <Tooltip
               formatter = { Format.fixed.bind(Format) }
               labelStyle = { { color: Theme.tooltip(this.props.theme).color } }
             />
             <Legend />
             <Bar key={ 0 } dataKey={ this.state.aggregator } fill={ Colors.get(0) }/>
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
          </BarChart>
        </ResponsiveContainer>
      )
    }
  }
};

WidgetHistogram.propTypes = {
  ...common.BASE,
  theme: PropTypes.oneOf(['dark', 'light']),
  aggregators: PropTypes.arrayOf(PropTypes.object).isRequired,
  interval: PropTypes.arrayOf(PropTypes.string),
  options: PropTypes.shape({
    ...common.THRESHOLDS,
    discard_values: PropTypes.oneOf(['previous', 'next']),
    histogram: PropTypes.shape({
      type: PropTypes.string,
      breaks: PropTypes.arrayOf(PropTypes.number)
    })
  })
};
