/* jshint esversion: 6 */

export default {
  prefix(value, decimals = 0) {
    if (!isFinite(value)){
      return value;
    } else if (Math.abs(value) > 1e12) {
      return (value / 1e12).toFixed(decimals) + " T";
    } else if (Math.abs(value) > 1e9) {
      return (value / 1e9).toFixed(decimals) + " G";
    } else if (Math.abs(value) > 1e6) {
      return (value / 1e6).toFixed(decimals) + " M";
    } else if (Math.abs(value) > 1e3) {
      return (value / 1e3).toFixed(decimals) + " K";
    } else if (Number.isInteger(value)) {
      return value;
    } else {
      return value.toFixed(decimals);
    }
  },

  fixed(value) {
    return this.prefix(value, 2);
  },

  formatColumns(columns) {
    let new_columns = {};

    for (const key of Object.keys(columns)) {
      const value = columns[key];
      new_columns[key] = this.formatColumnValue(key, value);
    }

    return new_columns;
  },

  formatColumnValue(column, value) {
    if (value == null || value == undefined) {
      return 'N/A';
    } else if (typeof value === 'number' && isFinite(value)) {
      return this.fixed(value);
    } else {
      return value;
    }
  },

  estimateFontSize(width = 100, height = 100) {
    return (width < height) ? width / 12 : height / 12;
  },

  buildUrl(url, parameters, model) {
    let new_url = url + '?';

    for (const key in parameters) {
      new_url += model + '[' + encodeURIComponent(key) + ']=' + encodeURIComponent(parameters[key]) + '&';
    }
    //chop off last '&' or '?'
    return new_url.substring(0, new_url.length - 1);
  }
};
