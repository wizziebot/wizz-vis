/* jshint esversion: 6 */

import DashboardContainer from '../containers/DashboardContainer';
import { init } from './loader';

/*
*  Initialize the Dashboard component, depending on a common store.
*/
export default (props, railsContext, domNodeId) => {
  init(DashboardContainer, props, domNodeId);
};
