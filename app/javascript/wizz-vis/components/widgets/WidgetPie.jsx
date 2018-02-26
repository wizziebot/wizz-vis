import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';

const COLORS = ['#3DCC91', '#FFB366', '#FF7373', '#FFCC00', '#3B22FF'];

export default class WidgetPie extends React.Component {
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
        <PieChart>
          <Pie data={this.state.$$data}
               dataKey="events" fill="#8884d8"
               innerRadius="50">
            {
              this.state.$$data.map((element, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]}/>
              ))
            }
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    )
  }
}
