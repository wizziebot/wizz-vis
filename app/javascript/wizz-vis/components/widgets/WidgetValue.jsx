/* jshint esversion: 6 */

import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import Colors from './../../utils/colors';
import Theme from './../../utils/theme';
import Format from './../../utils/format';
import Info from './../Info';
import ResumeValue from './../ResumeValue';
import Time from './../../utils/time';

class CompareValue extends React.Component {
  getStyle() {
    if (this.props.bottomAbsolute) {
      return {
        position: 'absolute',
        bottom: 0,
        fontSize: this.props.fontSize
      };
    } else {
      return {
        fontSize: this.props.fontSize
      };
    }
  }

  render () {
    return (
      <div className="value-compare" style={this.getStyle()}>
        <ResumeValue showTotal={false} actualData={this.props.total}
          compareData={this.props.totalCompared} />
      </div>
    );
  }
}

export default class WidgetValue extends React.Component {
  constructor(props) {
    super(props);
    this.aggregator = null;
  }

  getAggregator() {
    return this.props.options.metrics || this.props.aggregators[0].name;
  }

  getValues() {
    const start_time = Time.moment(this.props.interval[0]);

    return this.props.data.filter((d) => {
      return Time.moment(d.timestamp) >= start_time;
    });
  }

  getCompareValues() {
    if (this.props.compare_interval == undefined)
      return [];

    const end_time = Time.moment(this.props.compare_interval[1]);

    return this.props.data.filter((d) => {
      return Time.moment(d.timestamp) <= end_time;
    });
  }

  getValue(data) {
    const value_type = this.props.options.value || 'current';
    const data_length = data.length;

    if (data_length == 0) {
      return 0;
    } else if (value_type == 'max') {
      return Math.max(...data.map(d => d[this.aggregator]));
    } else if (value_type == 'min') {
      return Math.min(...data.map(d => d[this.aggregator]));
    } else if (value_type == 'average') {
      return data.map(d => d[this.aggregator]).reduce((a,b) => a + b, 0) / data_length;
    } else if (value_type == 'total') {
      return data.map(d => d[this.aggregator]).reduce((a,b) => a + b, 0);
    } else {
      return data[data_length - 1][this.aggregator];
    }
  }

  getFontSize() {
    return (this.props.width < this.props.height) ?
      this.props.width / 12 : this.props.height / 12;
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
            {value: this.getValue(this.getValues())}
          ]
        }
      ]
    };
  }

  render () {
    this.aggregator = this.getAggregator();

    if(this.props.error || this.props.data.length == 0) {
      return(<Info error={this.props.error} />)
    } else {
      const data = this.getValues();
      let element = null,
          serie = null;

      if(this.showGauge()) {
        element = <ReactEcharts
          option={ this.gaugeOptions() }
          style={
            { position: 'absolute',
              width: '100%',
              height: '100%',
              top: 10,
              left: 0 }
          }
          className='gauge' />;
      } else {
        element = <div className='value'>
          { Format.prefix(this.getValue(data), 2) }
        </div>;
      }

      if(this.showSerie()) {
        const color = this.props.options.serie.color || Colors.get(0);
        serie = <ResponsiveContainer>
          <AreaChart data={data}
                margin={{top: 0, right: 0, left: 5, bottom: 0}}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={ color } stopOpacity={0.7}/>
                <stop offset="95%" stopColor={ color } stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area key={ 0 } type="monotone" dataKey={ this.aggregator }
              stroke={ color } dot={false}
              fillOpacity={1} fill="url(#colorUv)" />
          </AreaChart>
        </ResponsiveContainer>
      }

      const total = this.getValue(data);
      const total_compared = this.getValue(this.getCompareValues());

      return (
        <div className='widget-value'>
          <div className='card horizontal'>
            <div className='card-stacked' style={{ fontSize: this.getFontSize() }}>
              <div className='card-content center-align valign-wrapper'>
                {element}
                {
                  this.props.compare_interval ?
                    <CompareValue bottomAbsolute={this.showGauge()}
                      fontSize={this.getFontSize()} total={total}
                      totalCompared={total_compared} />
                    : null
                }
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
