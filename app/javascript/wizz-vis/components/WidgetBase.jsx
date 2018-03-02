import React from 'react';
import { ResponsiveContainer } from 'recharts';

import WidgetSerie from './widgets/WidgetSerie';
import WidgetArea from './widgets/WidgetArea';
import WidgetBar from './widgets/WidgetBar';
import WidgetPie from './widgets/WidgetPie';
import WidgetValue from './widgets/WidgetValue';
import WidgetLocation from './widgets/WidgetLocation';


export default class WidgetBase extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() { }

  components = {
    WidgetArea: WidgetArea,
    WidgetSerie: WidgetSerie,
    WidgetBar: WidgetBar,
    WidgetPie: WidgetPie,
    WidgetValue: WidgetValue,
    WidgetLocation: WidgetLocation
  };

  render () {
    const Type = this.components[this.props.type || 'WidgetArea'];

    return (
      <Type {...this.props}/>
    )
  }
}
