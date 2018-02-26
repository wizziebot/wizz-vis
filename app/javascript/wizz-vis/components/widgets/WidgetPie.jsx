import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';
import Colors from './../../utils/colors';

export default class WidgetPie extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      $$data: [],
      dimension: null,
      aggregator: '',
      fetchDataError: null
    };
  }

  componentDidMount() {
    this.fetchData();
    this.setDimension();
    this.setAggregator();
  }

  fetchData() {
    return (
      fetch('/widgets/' + this.props.id + '/data.json')
        .then(response => response.json())
        .then(data => this.setState({ $$data: data }))
    );
  }

  setDimension() {
    this.setState({
      dimension: this.props.dimensions[0].name
    })
  }

  setAggregator() {
    this.setState({
      aggregator: this.props.aggregators[0].name
    })
  }

  render () {
    return (
      <ResponsiveContainer>
        <PieChart>
          <Pie data={this.state.$$data}
               dataKey={this.state.aggregator}
               nameKey={this.state.dimension}
               ill="#8884d8"
               innerRadius="50">
            {
              this.state.$$data.map((element, index) => (
                <Cell key={index} fill={Colors.get(index)}/>
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
