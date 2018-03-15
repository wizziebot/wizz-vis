import React from 'react';
import ReactEcharts from 'echarts-for-react';

export default class WidgetValue extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      $$data: [],
      aggregator: '',
      fetchDataError: null
    };
  }

  componentDidMount() {
    this.fetchData();
    this.setAggregator();
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
    )
  }

  setAggregator() {
    this.setState({
      aggregator: this.props.aggregators[0].name
    })
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
      thresholds = [[0.33, "#3DCC91"], [0.66, "#FFB366"], [1, "#FF7373"]];
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
            fontFamily: "Roboto"
          },
          data:[
            {value: this.getValue()}
          ]
        }
      ]
    }
  }

  render () {
    if(this.state.$$data.length == 0) {
      return(<h5>No data points.</h5>)
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
          { this.getValue() }
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
