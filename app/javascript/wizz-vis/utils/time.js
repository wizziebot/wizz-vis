/* jshint esversion: 6 */

import * as moment from 'moment';

const ONE_DAY = 24 * 3600 * 1000;
const TWO_DAYS = 2 * 24 * 3600 * 1000;
const FORMAT_WITH_YEAR = "MMM D, YYYY";
const FORMAT_WITHOUT_YEAR = "MMM D";
const FORMAT_TIME_OF_DAY_WITH_MINUTES = "H:mm";

function formatTimeOfDay(d) {
  return d.format(FORMAT_TIME_OF_DAY_WITH_MINUTES);
}

function isCurrentYear(year) {
  const now = moment(new Date());
  return now.year() === year;
}

function hasTime(datetime) {
  return datetime.hour() || datetime.minute();
}

function diffDates(startDate, endDate, compare) {
  return startDate[compare]() !== endDate[compare]();
}

function dateFormat(start, end, showYear) {
  if (diffDates(start, end, 'year')) {
    return [start.format(FORMAT_WITH_YEAR), end.format(FORMAT_WITH_YEAR)].join(' - ');
  } else {
    const fmt = showYear ? FORMAT_WITH_YEAR : FORMAT_WITHOUT_YEAR;
    if (diffDates(start, end, 'month') || diffDates(start, end, 'date')) {
      return [start.format(FORMAT_WITHOUT_YEAR), end.format(fmt)].join(' - ');
    } else {
      return start.format(fmt);
    }
  }
}

function timeFormat(start, end, showYear) {
  let text = (showYear ? ' ' : ', ');

  let startTimeStr = formatTimeOfDay(start).toLowerCase();
  const endTimeStr = formatTimeOfDay(end).toLowerCase();

  if (startTimeStr === endTimeStr) {
    text += startTimeStr;
  } else {
    text += [startTimeStr, endTimeStr].join(' - ');
  }

  return text;
}

export default {
  moment(time) {
    return moment(time);
  },

  difference(time_1, time_2) {
    const difference = moment(time_1).diff(moment(time_2));
    return Math.abs(difference);
  },

  simple_format(time){
    return moment(time).format('YYYY-MM-DD HH:mm');
  },

  format(time, interval) {
    const range =
      moment(interval[1]).diff(moment(interval[0]));
    const past_year =
      moment().year() - moment(interval[1]).year() > 0;
    const past_day =
      moment().day() - moment(interval[1]).day() > 0;

    if (range > TWO_DAYS) {
      return moment(time).format(`${past_year ? 'YYYY/MM/DD' : 'MM/DD'}`);
    } else if (range > ONE_DAY) {
      return moment(time).format(`${past_year ? 'YYYY/MM/DD HH:mm' : 'MM/DD HH:mm'}`);
    } else {
      return moment(time).format(
        `${past_year ? 'YYYY/MM/DD HH:mm' : past_day ? 'MM/DD HH:mm' : 'HH:mm'}`
      );
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

  },

  step(time_1, time_2) {
    return moment(time_2).diff(moment(time_1));
  },

  /**
   * Return the difference in the format %d hr %d min between
   * two datetime passed as arguments.
   *
   * @param {string} time_1
   * @param {string} time_2
   * @returns {string}
   */
  duration(time_1, time_2) {
    return moment.utc(
      moment(time_2).diff(moment(time_1))
    ).format("H [hr] m [min]");
  },

  /**
   * Return the difference in string between
   * two datetimes passed as arguments.
   *
   * @param {string} startTime
   * @param {string} endTime
   * @returns {string}
   */
  formatTimeRange(start, end) {
    const startTime = moment(start);
    const endTime = moment(end);
    const endTimeInclusive = moment(new Date(end) - 1);
    const showYear = diffDates(startTime, endTimeInclusive, 'year') || !isCurrentYear(endTimeInclusive.year());

    let text = dateFormat(startTime, endTimeInclusive, showYear);
    if (hasTime(startTime) || hasTime(endTime))
      text += timeFormat(startTime, endTime, showYear);

    return text;
  }
};
