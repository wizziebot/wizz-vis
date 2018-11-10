/* jshint esversion: 6 */

import * as actionTypes from '../constants';
import { init } from './functions';

const initialState = null;

// Why name function the same as the reducer?
// https://github.com/gaearon/redux/issues/428#issuecomment-129223274
export default function reloadReducer(state = initialState, action) {
  return init(
    state, action, actionTypes.DASHBOARD_RELOAD_UPDATE
  );
}
