/* jshint esversion: 6 */

import Time from './time';
import Array from './array';
import merge from 'lodash/merge';

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
    const compare_to_actual = compare_data.map(cd => {
      let compare_entry = {
        timestamp: Time.moment(cd.timestamp).utc()
          .add(compare.amount, compare.range).toISOString()
      };

      metrics.forEach((m) => {
        const aggregator_compare_key = this.compared_name(m, compare);
        compare_entry[aggregator_compare_key] = cd[m];
      });

      return compare_entry;
    });

    return merge([], data, compare_to_actual);
  }
};
