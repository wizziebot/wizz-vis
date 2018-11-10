/* jshint esversion: 6 */

import { init } from './functions';
import * as actionTypes from '../constants';

const initialState = null;

// Name function the same as the reducer for debugging.
export default function rangesReducer(state = initialState, action) {
  return init(
    state, action, actionTypes.DASHBOARD_SET_RANGES
  );
};
