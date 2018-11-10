/* jshint esversion: 6 */

import React, { Component } from 'react';
import WidgetDrilldown from './WidgetDrilldown';
import WidgetRefresh from './WidgetRefresh';
import WidgetTrash from './WidgetTrash';
import IntervalInfo from '../IntervalInfo';
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
        <div className='title_text'>{ this.props.title }</div>
        <div className='options right'>
          <WidgetRefresh widget_id={this.props.widget_id} />
          {
            this.props.overrideInterval ?
              <IntervalInfo intervalAttributes={this.props.intervalAttributes} /> :
              null
          }
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
  remove: PropTypes.func,
  overrideInterval: PropTypes.bool,
  intervalAttributes: PropTypes.shape({
    range: PropTypes.string,
    start_time: PropTypes.string,
    end_time: PropTypes.string
  })
};
