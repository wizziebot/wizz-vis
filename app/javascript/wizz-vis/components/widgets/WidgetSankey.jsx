/* jshint esversion: 6 */

import React from 'react';
import ReactEcharts from 'echarts-for-react';
import Colors from './../../utils/colors';
import Format from './../../utils/format';
import Theme from './../../utils/theme';

import uniqBy from 'lodash/uniqBy';

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
    let nodes = [];
    let links = [];

    for(let row of data) {
      var value = row[aggregator];

      // Objects from nodes array contains a name attribute to distinguish
      // values from different dimensions.
      // Node name has to be created concatenating dimension and value.
      // Sankey from eacharts library can't contains nodes with same name.
      // For that reason, we must create nodes with unique name attribute
      // but with the possibility of same value attribute,
      // used for labels and tooltips representation.
      dimensions.forEach(function(d) {
        nodes.push({
          dimension: d,
          value: row[d],
          name: `${d}-${row[d]}`
        });
      });

      for(let i = 0; i < dimensions.length - 1; i++) {
        let linkIndex = -1;

        const source = {
          dimension: dimensions[i],
          value: row[dimensions[i]],
          name: `${dimensions[i]}-${row[dimensions[i]]}`
        };

        const target = {
          dimension: dimensions[i + 1],
          value: row[dimensions[i + 1]],
          name: `${dimensions[i + 1]}-${row[dimensions[i + 1]]}`
        };

        // objects
        links.forEach(function (d, index) {
          if (d.source == source.name && d.target == target.name) {
            linkIndex = index;
          }
        });

        if (linkIndex === -1) {
          links.push({
            //source,
            //target,
            source_label: source.value,
            target_label: target.value,
            source: source.name,
            target: target.name,
            value
          });
        } else {
          links[linkIndex].value += value;
        }
      }
    }

    const unique_nodes = uniqBy(nodes, 'name');

    return {
      nodes: unique_nodes,
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
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        textStyle: {
          color: Theme.tooltip(this.props.theme).color,
          fontWeight: 'normal',
          fontSize: 15,
          fontFamily: 'Roboto'
        },
        formatter: function(params) {
          if (params.dataType == 'edge') {
            const source = params.data.source_label || 'N/A';
            const target = params.data.target_label || 'N/A';
            return `${source} -- ${target} : ${Format.prefix(params.data.value, 2)}`;
          } else {
            const node = params.value || 'N/A';
            return `${params.marker} ${params.data.dimension}: ${node}`;
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
            fontSize: 14,
            fontFamily: 'Roboto',
            formatter: function(params){
              return params.data.value || 'N/A';
            }
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
