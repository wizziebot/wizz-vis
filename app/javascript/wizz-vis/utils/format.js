export default {
  prefix(value) {
    if (value > 1e12) {
      return (value / 1e12) + "T";
    } else if (value > 1e9) {
      return (value / 1e9) + "G";
    } else if (value > 1e6) {
      return (value / 1e6) + "M";
    } else if (value > 1e3) {
      return (value / 1e3) + "K";
    } else {
      return value;
    }
  },

  fixed(value) {
    if (value > 1e12) {
      return (value / 1e12).toFixed(2) + "T";
    } else if (value > 1e9) {
      return (value / 1e9).toFixed(2) + "G";
    } else if (value > 1e6) {
      return (value / 1e6).toFixed(2) + "M";
    } else if (value > 1e3) {
      return (value / 1e3).toFixed(2) + "K";
    } else {
      return value;
    }
  }
}
