import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
         Tooltip, Legend } from 'recharts';

export default class WidgetSerie extends React.Component {
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
        <LineChart data={this.state.$$data}
              margin={{top: 5, right: 30, left: 20, bottom: 5}}>
           <XAxis
             dataKey = "timestamp"
             domain = {['auto', 'auto']}
           />
           <YAxis/>
           <CartesianGrid strokeDasharray="3 3"/>
           <Tooltip/>
           <Legend />
           <Line type="monotone" dataKey="events" stroke="#8884d8" dot={false}/>
        </LineChart>
      </ResponsiveContainer>
    )
  }
}
