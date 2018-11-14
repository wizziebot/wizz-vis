/* jshint esversion: 6 */

import {interpolateRgb, quantize} from "d3-interpolate";

const COLORS = ['#3DCC91', '#FFB366', '#FF7373', '#FFCC00', '#3B22FF',
                '#8884d8', '#791E94', '#FFD07B', '#296EB4', '#B1740F',
                '#2EC4B6', '#011627', '#BAD4AA', '#D4D4AA', '#84BCDA',
                '#D6E681', '#BABF95', '#C4AD83', '#C6B677', '#FD5200'];

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
