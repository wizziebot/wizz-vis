import React from 'react';
import { ResponsiveContainer } from 'recharts';

import WidgetSerie from './widgets/WidgetSerie';
import WidgetArea from './widgets/WidgetArea';
import WidgetBar from './widgets/WidgetBar';
import WidgetPie from './widgets/WidgetPie';
import WidgetValue from './widgets/WidgetValue';
import WidgetLocation from './widgets/WidgetLocation';
import WidgetHeatmap from './widgets/WidgetHeatmap';
import WidgetTable from './widgets/WidgetTable';


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
    WidgetLocation: WidgetLocation,
    WidgetHeatmap: WidgetHeatmap,
    WidgetTable: WidgetTable
  };

  render () {
    const Type = this.components[this.props.type || 'WidgetArea'];

    return (
      <div className='widget center-align'>
        <div className="widget-title">{ this.props.title }</div>
        <div className="widget-content">
          <Type {...this.props}/>
        </div>
      </div>
    )
  }
}
