/* jshint esversion: 6 */

import { init } from './loader';
import ControlsContainer from '../containers/ControlsContainer';

/*
*  Initialize the Controls component, depending on a common store.
*/
export default (props, railsContext, domNodeId) => {
  init(ControlsContainer, props, domNodeId);
};
