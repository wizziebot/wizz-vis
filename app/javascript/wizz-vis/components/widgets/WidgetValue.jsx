/* jshint esversion: 6 */

import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from 'recharts';
import Colors from './../../utils/colors';
import Theme from './../../utils/theme';
import Time from './../../utils/time';
import Format from './../../utils/format';
import Info from './../Info';

export default class WidgetValue extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      $$data: [],
      error: this.props.error,
      aggregator: ''
    };
  }

  componentDidMount() {
    this.setAggregator();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.$$data || nextProps.error !== prevState.error) {
      return {
        $$data: nextProps.data,
        error: nextProps.error
      };
    }

    // No state update necessary
    return null;
  }

  setAggregator() {
    this.setState({
      aggregator: this.props.options.metric || this.props.aggregators[0].name
    });
  }

  getValue() {
    const value_type = this.props.options.value || 'current';
    const data_length = this.state.$$data.length;

    if (data_length == 0) {
      return 0;
    } else if (value_type == 'max') {
      return Math.max(...this.state.$$data.map(d => d[this.state.aggregator]));
    } else if (value_type == 'min') {
      return Math.min(...this.state.$$data.map(d => d[this.state.aggregator]));
    } else if (value_type == 'average') {
      return this.state.$$data.map(d => d[this.state.aggregator]).reduce((a,b) => a + b, 0) / data_length;
    } else {
      return this.state.$$data[data_length - 1][this.state.aggregator];
    }
  }

  showGauge(){
    return (this.props.options.gauge && this.props.options.gauge.show);
  }

  showSerie(){
    return (this.props.options.serie && this.props.options.serie.show);
  }

  gaugeOptions() {
    let thresholds = this.props.options.gauge.thresholds;
    let min = this.props.options.gauge.min;
    let max = this.props.options.gauge.max;

    if(thresholds === undefined){
      thresholds = [[1/3, "#3DCC91"], [2/3, "#FFB366"], [1, "#FF7373"]];
    }

    if(min === undefined){
      min = 0;
    }

    if (max === undefined){
      max = 100;
    }

    return {
      series : [
        {
          type:'gauge',
          startAngle: 180,
          endAngle: 0,
          min,
          max,
          splitNumber: 11,
          radius: '100%',
          axisLine: {
            lineStyle: {
              color: thresholds,
              width: 25
            }
          },
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          detail: {
            fontWeight: 700,
            fontFamily: "Roboto",
            formatter: function (value) {
                return Format.prefix(value, 2);
            }
          },
          data:[
            {value: this.getValue()}
          ]
        }
      ]
    };
  }

  render () {
    if(this.state.error || this.state.$$data.length == 0) {
      return(<Info error={this.state.error} />)
    } else {
      let element = null,
          serie = null;

      if(this.showGauge()) {
        element = <ReactEcharts
          option={ this.gaugeOptions() }
          style={
            { position: 'absolute',
              width: '100%',
              height: this.showSerie() ? '60%' : '100%',
              top: 10,
              left: 0 }
          }
          className='gauge' />;
      } else {
        element = <div className='value'>
          { Format.prefix(this.getValue(), 2) }
        </div>;
      }

      if(this.showSerie()) {
        serie = <ResponsiveContainer>
          <LineChart data={this.state.$$data}
                margin={{top: 0, right: 5, left: 5, bottom: 0}}>
             <XAxis
               dataKey = "timestamp"
               hide = { true }
             />
             <Tooltip
               formatter = { Format.fixed.bind(Format) }
               labelFormatter = { Time.simple_format }
               labelStyle = { { color: Theme.tooltip(this.props.theme).color } }
             />
           <Line key={ 0 } type="monotone" dataKey={ this.state.aggregator } stroke={ Colors.get(0) } dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      }

      return (
        <div className='widget-value'>
          <div className='card horizontal'>
            <div className='card-stacked'>
              <div className='card-content center-align valign-wrapper'>
                {element}
              </div>
              <div className='card-serie'>
                {serie}
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}
