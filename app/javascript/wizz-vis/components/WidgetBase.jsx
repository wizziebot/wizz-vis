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
import WidgetMultiserie from './widgets/WidgetMultiserie';
import WidgetImage from './widgets/WidgetImage';

export default class WidgetBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      removeError: null
    }
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
    WidgetSankey,
    WidgetMultiserie,
    WidgetImage
  };

  /*
   * Remove a widget (by id).
   */
  removeWidget () {
    if (!window.confirm('Are you sure you wish to delete this widget?'))
      return false;

    fetch(
      '/widgets/' + this.props.id + '.json',
      {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': ReactOnRails.authenticityToken()
        },
        credentials: 'same-origin'
      }
    )
    .then(response => this.props.remove())
    .catch(error => this.setState({ removeError: error }));
  }

  render () {
    const Type = this.components[this.props.type || 'WidgetArea'];

    return (
      <div className='widget center-align'>
        <WidgetTitle
          widget_id={this.props.id}
          title={this.props.title}
          links={this.props.options.links}
          locked={this.props.locked}
          remove={this.removeWidget.bind(this)}
        />
        <div className="widget-content">
          <Type {...this.props}/>
        </div>
      </div>
    )
  }
}
