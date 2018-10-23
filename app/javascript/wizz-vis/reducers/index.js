/* jshint esversion: 6 */

import reloadReducer from './reload';
import rangesReducer from './range';
// This is how you do a directory of reducers.
// The `import * as reducers` does not work for a directory, but only with a single file
export default {
  reloadTimestamp: reloadReducer,
  setRanges: rangesReducer
};
