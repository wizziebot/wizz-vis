import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
         CartesianGrid, Tooltip, Legend } from 'recharts';

export default class WidgetArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      $$data: [],
      fetchDataError: null
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    return (
      fetch('/widgets/' + this.props.widget_id + '/data.json')
        .then(response => response.json())
        .then(data => this.setState({ $$data: data }))
    );
  }

  render () {
    return (
      <ResponsiveContainer>
        <AreaChart data={this.state.$$data}
                   margin={{top: 10, right: 30, left: 0, bottom: 0}}>
          <XAxis
            dataKey = "timestamp"
            domain = {['auto', 'auto']}
          />
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Legend/>
          <Area type='monotone' dataKey='events' stroke='#8884d8' fill='#8884d8' />
        </AreaChart>
      </ResponsiveContainer>
    )
  }
}
