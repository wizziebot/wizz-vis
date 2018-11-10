/* jshint esversion: 6 */

export function init(state, action, actionType) {
  const { type, value } = action;
  switch (type) {
    case actionType:
      return value;
      // You could also return an object with lastActionType
      // in case Dashboard.jsx/Controls.jsx needs it.
      // ==>  return { lastActionType: type, value };
      // const initialState = { lastActionType: null, value: null }
    default:
      return state;
  }
}
