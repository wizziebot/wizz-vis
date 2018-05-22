/* jshint esversion: 6 */

import React from 'react';
import ReactEcharts from 'echarts-for-react';
import Format from './../../utils/format';
import Info from './../Info';

export default class WidgetValue extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      $$data: this.props.data,
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
    const data_length = this.state.$$data.length;
    return data_length == 0 ? 0 : Math.round(this.state.$$data[data_length - 1][this.state.aggregator]);
  }

  showGauge(){
    return (this.props.options.gauge && this.props.options.gauge.show);
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
      let element = null;

      if(this.showGauge()) {
        element = <ReactEcharts
          option={ this.gaugeOptions() }
          style={
            { position: 'absolute',
              width: '100%', height: '100%',
              top: 10, left: 0 }
          }
          className='gauge' />;
      } else {
        element = <div className='value'>
          { Format.prefix(this.getValue(), 2) }
        </div>;
      }

      return (
        <div className='widget-value'>
          <div className='card horizontal'>
            <div className='card-stacked'>
              <div className='card-content center-align valign-wrapper'>
                {element}
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}
