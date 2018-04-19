/* jshint esversion: 6 */

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
import WidgetChord from './widgets/WidgetChord';
import WidgetSankey from './widgets/WidgetSankey';

export default class WidgetBase extends React.Component {
  constructor(props) {
    super(props);
  }

  components = {
    WidgetArea,
    WidgetSerie,
    WidgetBar,
    WidgetPie,
    WidgetValue,
    WidgetLocation,
    WidgetHeatmap,
    WidgetTable,
    WidgetPlane,
    WidgetChord,
    WidgetSankey
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
