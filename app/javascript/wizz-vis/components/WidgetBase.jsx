import React from 'react';
import { ResponsiveContainer } from 'recharts';

import WidgetTitle from './widgets/WidgetTitle';
import WidgetSerie from './widgets/WidgetSerie';
import WidgetArea from './widgets/WidgetArea';
import WidgetBar from './widgets/WidgetBar';
import WidgetPie from './widgets/WidgetPie';
import WidgetValue from './widgets/WidgetValue';
import WidgetLocation from './widgets/WidgetLocation';
import WidgetHeatmap from './widgets/WidgetHeatmap';
import WidgetTable from './widgets/WidgetTable';
import WidgetPlane from './widgets/WidgetPlane';


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
    WidgetTable: WidgetTable,
    WidgetPlane
  };

  render () {
    const Type = this.components[this.props.type || 'WidgetArea'];

    return (
      <div className='widget center-align'>
        <WidgetTitle
          widget_id={this.props.id}
          title={this.props.title}
          links={this.props.options.links}
          locked={this.props.locked}
        />
        <div className="widget-content">
          <Type {...this.props}/>
        </div>
      </div>
    )
  }
}
