import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
         CartesianGrid, Tooltip, Legend } from 'recharts';
import Colors from './../../utils/colors';
import Theme from './../../utils/theme';
import Format from './../../utils/format';

export default class WidgetArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      $$data: [],
      aggregators: [],
      fetchDataError: null
    };
  }

  componentDidMount() {
    this.fetchData();
    this.setAggregators();
  }

  fetchData() {
    return (
      fetch('/widgets/' + this.props.id + '/data.json')
        .then(response => response.json())
        .then(data => this.setState({ $$data: data }))
    );
  }

  setAggregators() {
    this.setState({
      aggregators: this.props.aggregators.map((a) => (a.name))
    })
  }

  formatYAxis(value) {
    return Format.prefix(value);
  }

  render () {
    return (
      <ResponsiveContainer>
        <AreaChart data={this.state.$$data}
                   margin={{top: 5, right: 30, left: 20, bottom: 5}}>
          <XAxis
            dataKey = "timestamp"
            domain = {['auto', 'auto']}
            stroke = { Theme.text(this.props.theme) }
          />
          <YAxis
            tickFormatter={this.formatYAxis}
            interval = 'preserveStartEnd'
            stroke = { Theme.text(this.props.theme) }
            tick = { { fontSize: 12 } }
          />
          <CartesianGrid stroke = { Theme.grid(this.props.theme) } />
          <Tooltip/>
          <Legend/>
          {
            this.state.aggregators.map((a, index) => (
              <Area
                key={ index } type="monotone" dataKey={ a }
                stroke={ Colors.get(index) } fill={ Colors.get(index) }
              />
            ))
          }
        </AreaChart>
      </ResponsiveContainer>
    )
  }
}
