/* jshint esversion: 6 */

import Time from './time';
import Array from './array';
import merge from 'lodash/merge';

export default {
  graph_types(aggregator, compare) {
    if (compare != undefined) {
      return ['actual', this.metric_name(aggregator, compare)];
    } else {
      return ['actual'];
    }
  },

  compare_difference(interval, compare) {
    if (compare.range == 'previous_period') {
      const difference = Time.difference(interval[0], interval[1]);
      return {amount: difference, range: 'milliseconds'};
    } else {
      return {amount: compare.amount, range: compare.range};
    }
  },

  compare_name(compare) {
    if (compare.range == 'previous_period') {
      return '(previous period)';
    } else {
      return '(' + compare.amount + ' ' + compare.range + ' ago)';
    }
  },

  metric_name(aggregator, compare) {
    if (compare != undefined) {
      return `${aggregator} ${this.compare_name(compare)}`;
    } else {
      return aggregator;
    }
  },

  unify_data(data, compare_data, metrics, interval, compare) {
    const difference = this.compare_difference(interval, compare);

    const compare_to_actual = compare_data.map(cd => {
      let compare_entry = {
        timestamp: Time.moment(cd.timestamp).utc()
          .add(difference.amount, difference.range).toISOString()
      };

      metrics.forEach((m) => {
        const aggregator_compare_key = this.metric_name(m, compare);
        compare_entry[aggregator_compare_key] = cd[m];
      });

      return compare_entry;
    });

    return merge([], data, compare_to_actual);
  }
};
