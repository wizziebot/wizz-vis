/* jshint esversion: 6 */

import compact from 'lodash/compact';
import flattenDeep from 'lodash/flattenDeep';
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
    const graph = data[0][aggregator];
    let histogram = [];

    for (let [i, count] of graph.counts.entries()) {
      if(i > 0 && discard_values === true) {
        count -= graph.counts[i - 1];
        if(count < 0)
          count = 0;
      }

      histogram.push(
        {
          range: (Format.fixed(graph.breaks[i]) + ' - ' + Format.fixed(graph.breaks[i + 1])),
          [aggregator]: count
        }
      );
    }

    return histogram;
  }
};
