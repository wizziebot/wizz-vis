import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';
import Colors from './../../utils/colors';
import Theme from './../../utils/theme';
import Format from './../../utils/format';

export default class WidgetPie extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      $$data: [],
      sum_total: 0,
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.reloadTimestamp !== this.props.reloadTimestamp) {
      this.fetchData();
    }
  }

  fetchData() {
    let button = $('.preloader-wrapper[widget_id="' + this.props.id + '"]');
    let aggregator = this.props.aggregators[0].name;
    button.addClass('active');
    return (
      fetch('/widgets/' + this.props.id + '/data.json')
        .then(response => response.json())
        .then(data => this.setState(
          { $$data: data,
            sum_total: data.reduce(function add(sum, item) {
                         return sum + item[aggregator]
                       }, 0)
          }))
        .then(data => button.removeClass('active'))
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

  customTooltip(value) {
    let payload = value.payload[0]
    if(payload != undefined) {
      let percentage = payload.value / this.state.sum_total;
      return (<span>{`${payload.name || 'N/A'}: ${Format.fixed(payload.value)} (${(percentage * 100).toFixed(0)}%)`}</span>)
    }
  }

  render () {
    if(this.state.$$data.length == 0) {
      return(<h5>No data points.</h5>)
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
