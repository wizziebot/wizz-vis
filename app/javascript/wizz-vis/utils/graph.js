/* jshint esversion: 6 */

import compact from 'lodash/compact';
import flattenDeep from 'lodash/flattenDeep';
import cloneDeep from 'lodash/cloneDeep';
import Format from './format';

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
  }
};
