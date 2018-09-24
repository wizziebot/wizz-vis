/* jshint esversion: 6 */

import compact from 'lodash/compact';
import flattenDeep from 'lodash/flattenDeep';
import cloneDeep from 'lodash/cloneDeep';
import Format from './format';
import * as d3 from "d3";

export default {
  chord(data, dim_origin, dim_destination, aggregator) {
    let groups = Object.create(null),
        to = [], from = [],
        matrix = [], full_list;

    data.forEach(item => {
      let dim0 = item[dim_origin];
      let dim1 = item[dim_destination];

      if (!groups[dim0]) groups[dim0] = {};
      groups[dim0][dim1] = item[aggregator];

      if(!from.includes(dim0)) from.push(dim0);
      if(!to.includes(dim1)) to.push(dim1);
    });

    full_list = from.concat(to.filter(d => !from.includes(d)));

    full_list.forEach(key => {
      let row = groups[key];
      let matrix_row = [];
      full_list.forEach(col => {
        matrix_row.push(
          Object.is(row, undefined) || Object.is(row[col], undefined) ? 0 : row[col]
        );
      });
      matrix.push(matrix_row);
    });

    return {
      value: compact(flattenDeep(matrix)).length == 0 ? [] : matrix,
      keys: full_list.map((key) => {
        return Object.is(key, null) ? 'N/A' : key;
      })
    };
  },

  histogram(data, aggregator, discard_values) {
    let graph = cloneDeep(data[0][aggregator]);
    let histogram = [];
    if (discard_values === 'next') {
      graph.counts = graph.counts.reverse();
      graph.breaks = graph.breaks.reverse();
    }

    for (let [i, count] of graph.counts.entries()) {
      if(i > 0 && discard_values !== undefined) {
        count -= graph.counts[i - 1];
        if(count < 0)
          count = 0;
      }

      histogram.push(
        {
          range: (
            discard_values === 'next' ?
              Format.fixed(graph.breaks[i + 1]) + ' - ' + Format.fixed(graph.breaks[i]) :
              Format.fixed(graph.breaks[i]) + ' - ' + Format.fixed(graph.breaks[i + 1])
          ),
          [aggregator]: count
        }
      );
    }

    return discard_values === 'next' ? histogram.reverse() : histogram;
  },

  legend(props, name) {
    const grades = Object.keys(props.gradient).sort(function(a, b){return a - b});
    var w = 250, h = 50;
    if (d3.select(name) != undefined)
      d3.select(name).select('svg').remove();

    var key = d3.select(name)
      .append('svg')
      .attr('width', w)
      .attr('height', h);

    var legend = key.append('defs')
      .append('svg:linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '100%')
      .attr('y2', '100%')
      .attr('spreadMethod', 'pad');

    grades.forEach(function(key, i) {
      legend.append('stop')
        .attr('offset', (key * 100) + '%')
        .attr('stop-color', props.gradient[key])
        .attr('stop-opacity', 1);
    });

    key.append('rect')
      .attr('width', w - 30)
      .attr('height', h - 40)
      .style('fill', 'url(#gradient)')
      .attr('transform', 'translate(0,20)');

    var y = d3.scaleLinear()
      .range([220, 0])
      .domain([props.max, 0]);

    var yAxis = d3.axisBottom()
      .scale(y)
      .ticks(3)
      .tickValues([0.0, props.max * 0.33, props.max * 0.66, props.max])
      .tickFormat(function(d) {
        return (d == props.max) ?
          `${Format.prefix(d, 2)} +` :
          Format.prefix(d, 2);
      });

    key.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(0,30)')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('axis title');

    return legend;
  }
};
