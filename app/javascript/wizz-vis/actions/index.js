/* jshint esversion: 6 */

import * as actionTypes from '../constants';

export function updateReload(value) {
  return {
    type: actionTypes.DASHBOARD_RELOAD_UPDATE,
    value
  };
}

export function updateRanges(value) {
  return {
    type: actionTypes.DASHBOARD_SET_RANGES,
    value
  };
}
