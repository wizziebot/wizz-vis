import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
         Tooltip, Legend } from 'recharts';
import Colors from './../../utils/colors';
import Theme from './../../utils/theme';
import Format from './../../utils/format';

export default class WidgetBar extends React.Component {
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.reloadTimestamp !== this.props.reloadTimestamp) {
      this.fetchData();
    }
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
        <BarChart data={this.state.$$data}
              margin={{top: 5, right: 30, left: 20, bottom: 5}}>
           <CartesianGrid stroke = { Theme.grid(this.props.theme) } />
           <XAxis dataKey="timestamp" stroke = { Theme.text(this.props.theme) } />
           <YAxis
             tickFormatter={this.formatYAxis}
             interval = 'preserveStartEnd'
             stroke = { Theme.text(this.props.theme) }
             tick = { { fontSize: 12 } }
           />
           <Tooltip/>
           <Legend />
           {
             this.state.aggregators.map((a, index) => (
               <Bar key={ index } dataKey={ a } fill={ Colors.get(index) }/>
             ))
           }
        </BarChart>
      </ResponsiveContainer>
    )
  }
}
