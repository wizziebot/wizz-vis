/* jshint esversion: 6 */

// Imports for IE11
import 'es6-promise';
import 'isomorphic-fetch';
import '@babel/polyfill';

import ReactOnRails from 'react-on-rails';

import DashboardApp from './startup/DashboardApp';
import ControlsApp from './startup/ControlsApp';
import WidgetBase from './components/WidgetBase';
import Info from './components/Info';
import Clock from './components/Clock';

import ReduxStore from './store/index';

ReactOnRails.register({
  DashboardApp,
  WidgetBase,
  Clock,
  ControlsApp,
  Info
});

ReactOnRails.registerStore({
  ReduxStore,
});
