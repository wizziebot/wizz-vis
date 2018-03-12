import * as moment from 'moment';

const ONE_DAY = 24 * 3600 * 1000;
const TWO_DAYS = 2 * 24 * 3600 * 1000;

export default {
  format(time, interval) {
    const range =
      moment(interval[1]).diff(moment(interval[0]));

    if (range > TWO_DAYS) {
      return moment(time).format('MM/DD');
    } else if (range > ONE_DAY) {
      return moment(time).format('MM/DD HH:mm');
    } else {
      return moment(time).format('HH:mm');
    }
  },

  gap(time_1, time_2, interval) {
    const step = moment(time_2).diff(moment(time_1));
    const range =
      moment(interval[1]).diff(moment(interval[0]));

    if (range > TWO_DAYS) {
      return (ONE_DAY / step) - 1;
    } else {
      return (60 * 1000 / step) - 1;
    }

  }
}
