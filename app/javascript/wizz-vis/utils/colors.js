/* jshint esversion: 6 */

import {interpolateRgb, quantize} from "d3-interpolate";

const COLORS = ['#3DCC91', '#FFB366', '#FF7373', '#FFCC00', '#3B22FF', '#8884d8'];

export default {
  get(index) {
    return COLORS[index % COLORS.length];
  },

  all() {
    return COLORS;
  },

  interpolate(start_color, end_color, quantity){
    return quantize(interpolateRgb(start_color, end_color), quantity);
  }

};
