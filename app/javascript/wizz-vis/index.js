import ReactOnRails from 'react-on-rails';

import HelloWorld from './components/HelloWorld';
import Dashboard from './components/Dashboard';
import WidgetBase from './components/WidgetBase';

// This is how react_on_rails can see the HelloWorld in the browser.
ReactOnRails.register({
  HelloWorld,
  Dashboard,
  WidgetBase
});
