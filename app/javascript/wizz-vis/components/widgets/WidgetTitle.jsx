import React, { Component } from 'react';
import WidgetDrilldown from './WidgetDrilldown';
import WidgetRefresh from './WidgetRefresh';

export default class WidgetTitle extends React.Component {
  constructor(props) {
    super(props);
  }

  get haveLinks(){
    return this.props.links !== undefined;
  }

  render () {
    return (
      <div className="widget-title">
        {
          this.haveLinks ?
            <WidgetDrilldown widget_id={this.props.widget_id} links={this.props.links} /> :
            null
        }
        { this.props.title }
        <WidgetRefresh widget_id={this.props.widget_id} />
      </div>
    )
  }
}
