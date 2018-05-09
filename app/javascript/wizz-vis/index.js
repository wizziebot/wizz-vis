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
