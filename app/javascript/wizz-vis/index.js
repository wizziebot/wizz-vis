// Imports for IE11
import 'es6-promise';
import 'isomorphic-fetch';
import '@babel/polyfill';

import ReactOnRails from 'react-on-rails';

import Dashboard from './components/Dashboard';
import WidgetBase from './components/WidgetBase';
import Info from './components/Info';
import Clock from './components/Clock';

ReactOnRails.register({
  Dashboard,
  WidgetBase,
  Clock,
  Info
});
