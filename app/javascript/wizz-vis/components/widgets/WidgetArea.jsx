import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
         CartesianGrid, Tooltip, Legend } from 'recharts';
import Colors from './../../utils/colors';

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

  render () {
    return (
      <ResponsiveContainer>
        <AreaChart data={this.state.$$data}
                   margin={{top: 5, right: 30, left: 20, bottom: 5}}>
          <XAxis
            dataKey = "timestamp"
            domain = {['auto', 'auto']}
          />
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
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
