import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
         Tooltip, Legend } from 'recharts';
import Colors from './../../utils/colors';
import Theme from './../../utils/theme';
import Time from './../../utils/time';
import Format from './../../utils/format';

export default class WidgetBar extends React.Component {
  constructor(props) {
    super(props);
    this.formatXAxis = this.formatXAxis.bind(this);
    this.minTickGap = this.minTickGap.bind(this);

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
    let button = $('.preloader-wrapper[widget_id="' + this.props.id + '"]');
    button.addClass('active');
    return (
      fetch('/widgets/' + this.props.id + '/data.json')
        .then(response => response.json())
        .then(data => this.setState({ $$data: data }))
        .then(data => button.removeClass('active'))
    );
  }

  setAggregators() {
    this.setState({
      aggregators: this.props.aggregators.map((a) => (a.name))
    })
  }

  formatXAxis(time) {
    return Time.format(time, this.props.interval);
  }

  minTickGap() {
    if(this.state.$$data.length == 0) return 0;

    let time_1 = this.state.$$data[0].timestamp,
        time_2 = this.state.$$data[1].timestamp;

    return Time.gap(time_1, time_2, this.props.interval);
  }

  formatYAxis(value) {
    return Format.prefix(value);
  }

  render () {
    if(this.state.$$data.length == 0) {
      return(<h5>No data points.</h5>)
    } else {
      const gap = this.minTickGap();

      return (
        <ResponsiveContainer>
          <BarChart data={this.state.$$data}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
             <CartesianGrid stroke = { Theme.grid(this.props.theme) } />
             <XAxis
               dataKey = "timestamp"
               tickFormatter={this.formatXAxis}
               interval = 'preserveStartEnd'
               minTickGap = {gap}
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
               formatter = { Format.fixed }
               labelFormatter = { Time.simple_format }
               labelStyle = { { color: Theme.tooltip(this.props.theme).color } }
             />
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
}
