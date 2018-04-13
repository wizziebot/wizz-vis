/* jshint esversion: 6 */

import React from 'react';
import ReactEcharts from 'echarts-for-react';
import Colors from './../../utils/colors';
import Format from './../../utils/format';
import Theme from './../../utils/theme';

export default class WidgetSankey extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      $$data: {nodes: [], links: []},
      dimensions: [],
      aggregator: '',
      fetchDataError: null
    };
  }

  componentDidMount() {
    this.setDimensions();
    this.setAggregator();
    this.fetchData();
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
        .then(data => this.formatData(data))
        .then(data => this.setState({ $$data: data }))
        .then(data => button.removeClass('active'))
    );
  }

  setDimensions() {
    const dimensions = this.props.dimensions.map((d) => d.name);
    const ordered_dimensions = this.props.options.ordered_dimensions || dimensions;

    this.setState({
      dimensions: ordered_dimensions
    });
  }

  setAggregator() {
    this.setState({
      aggregator: this.props.aggregators[0].name
    });
  }

  formatData(data) {
    const aggregator = this.state.aggregator;
    const dimensions = this.state.dimensions;
    let nodes = new Set();
    let links = [];

    for(let row of data) {
      var value = row[aggregator];

      dimensions.forEach(function(d) {
        nodes.add(row[d]);
      });

      for(let i = 0; i < dimensions.length - 1; i++) {
        let linkIndex = -1;

        links.forEach(function (d, index) {
          if (d.source === row[dimensions[i]] && d.target === row[dimensions[i + 1]]) {
            linkIndex = index;
          }
        });

        if (linkIndex === -1) {
          links.push({
            source: row[dimensions[i]],
            target: row[dimensions[i + 1]],
            value
          });
        } else {
          links[linkIndex].value += value;
        }
      }
    }

    return {
      nodes: [...nodes].map((n) => ({name: n})),
      links
    };
  }

  getNodes(){
    return this.state.$$data.nodes;
  }

  getLinks(){
    return this.state.$$data.links;
  }

  sankeyOptions() {
    return {
      color: Colors.all(),
      tooltip: {
        formatter: function(params) {
          if (params.dataType == 'edge') {
            return `${params.data.source} -- ${params.data.target} : ${Format.prefix(params.data.value, 2)}`;
          } else {
            return params.marker + " " + params.name;
          }
        }
      },
      series: [
        {
          type: 'sankey',
          layout: 'none',
          nodes: this.getNodes(),
          links: this.getLinks(),
          label: {
            color: Theme.text(this.props.theme),
            fontSize: 14
          },
          itemStyle: {
            normal: {
              borderWidth: 1,
              borderColor: Theme.grid(this.props.theme)
            }
          },
          lineStyle: {
            normal: {
              color: '#bbb',
              opacity: 0.5
            },
            emphasis: {
              color: '#a6a6a6'
            }
          }
        }
      ]
    };
  }

  render () {
    if(this.getNodes().length == 0)
      return(<h5>No data points.</h5>)

    return (
      <ReactEcharts
        option={ this.sankeyOptions() }
        style={
          { position: 'absolute',
            width: '100%', height: '100%',
            top: 10, left: 0 }
        }
        className='sankey'
      />
    )
  }
}
