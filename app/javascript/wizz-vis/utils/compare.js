/* jshint esversion: 6 */

import Time from './time';
import Array from './array';

export default {
  graph_types(aggregator, compare) {
    if (compare != undefined) {
      return ['actual', this.compared_name(aggregator, compare)];
    } else {
      return ['actual'];
    }
  },

  compared_name(aggregator, compare) {
    if (compare != undefined) {
      return aggregator + ' (' + compare.amount + ' ' + compare.range + ' ago)';
    } else {
      return aggregator;
    }
  },

  unify_data(data, compare_data, metrics, compare) {
    // convert compare data array to object, in which the keys are time in
    // unix timestamp.
    const compare_data_object = compare_data.reduce((obj, item) => {
      obj[Time.moment(item.timestamp).unix()] = item;
      return obj;
    }, {});

    return data.map((d) => {
      const compare_timestamp = Time.moment(d.timestamp).subtract(compare.amount, compare.range).unix();
      if (compare_data_object[compare_timestamp]){
        let d_with_compare = {};

        metrics.forEach((m) => {
          const aggregator_compare_key = this.compared_name(m, compare);
          d_with_compare[aggregator_compare_key] = compare_data_object[compare_timestamp][m];
        });

        return {...d, ...d_with_compare};
      } else {
        return d;
      }
    });
  }
};
