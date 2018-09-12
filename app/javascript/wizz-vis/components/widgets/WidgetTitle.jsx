/* jshint esversion: 6 */

import React, { Component } from 'react';
import WidgetDrilldown from './WidgetDrilldown';
import WidgetRefresh from './WidgetRefresh';
import WidgetTrash from './WidgetTrash';
import cs from 'classnames';
import PropTypes from 'prop-types';

export default class WidgetTitle extends React.Component {
  constructor(props) {
    super(props);
  }

  get haveLinks(){
    return this.props.links !== undefined;
  }

  get isLocked() {
    return this.props.locked;
  }

  render () {
    let cssClass = cs(
      'widget-title',
      {
        'locked': this.isLocked
      }
    );

    return (
      <div className={ cssClass }>
        {
          this.haveLinks ?
            <WidgetDrilldown widget_id={this.props.widget_id} links={this.props.links} /> :
            null
        }
        { this.props.title }
        <div className='options right'>
          <WidgetRefresh widget_id={this.props.widget_id} />
          <WidgetTrash remove={this.props.remove} isLocked={this.props.locked} />
        </div>
      </div>
    )
  }
};

WidgetTitle.propTypes = {
  title: PropTypes.string,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.string
    })
  ),
  locked: PropTypes.bool,
  remove: PropTypes.func
};
