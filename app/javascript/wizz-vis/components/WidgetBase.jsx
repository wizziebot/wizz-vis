/* jshint esversion: 6 */

import React from 'react';
import { ResponsiveContainer } from 'recharts';
import get from 'lodash/get';
import cs from 'classnames';

import WidgetTitle from './widgets/WidgetTitle';
import WidgetSerie from './widgets/WidgetSerie';
import WidgetBar from './widgets/WidgetBar';
import WidgetPie from './widgets/WidgetPie';
import WidgetValue from './widgets/WidgetValue';
import WidgetLocation from './widgets/WidgetLocation';
import WidgetHeatmap from './widgets/WidgetHeatmap';
import WidgetTable from './widgets/WidgetTable';
import WidgetPlane from './widgets/WidgetPlane';
import WidgetPlaneLocation from './widgets/WidgetPlaneLocation';
import WidgetPlaneRoute from './widgets/WidgetPlaneRoute';
import WidgetChord from './widgets/WidgetChord';
import WidgetSankey from './widgets/WidgetSankey';
import WidgetMultiserie from './widgets/WidgetMultiserie';
import WidgetImage from './widgets/WidgetImage';
import WidgetRoute from './widgets/WidgetRoute';
import WidgetHistogram from './widgets/WidgetHistogram';
import WidgetText from './widgets/WidgetText';

import Errors from './../utils/errors';

import PropTypes from 'prop-types';

const components = {
  WidgetSerie,
  WidgetBar,
  WidgetPie,
  WidgetValue,
  WidgetLocation,
  WidgetHeatmap,
  WidgetTable,
  WidgetPlane,
  WidgetPlaneLocation,
  WidgetPlaneRoute,
  WidgetChord,
  WidgetSankey,
  WidgetMultiserie,
  WidgetImage,
  WidgetRoute,
  WidgetHistogram,
  WidgetText
};

export default class WidgetBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      $$data: [],
      attributes: {},
      error: null,
      reloadTimestamp: null
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.reloadTimestamp !== prevState.reloadTimestamp) {
      return {
        reloadTimestamp: nextProps.reloadTimestamp
      };
    }

    // No state update necessary
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.reloadTimestamp !== prevProps.reloadTimestamp) {
      this.fetchData();
    }
  }

  fetchData() {
    let button = $('.preloader-wrapper[widget_id="' + this.props.id + '"]');
    button.addClass('active');
    return (
      fetch('/widgets/' + this.props.id + '/data.json')
        .then(response => Errors.handleErrors(response))
        .then(widget => {
          if(widget.data && JSON.stringify(widget.data) !== JSON.stringify(this.state.$$data) ||
            JSON.stringify(widget.attributes) !== JSON.stringify(this.state.attributes)) {
            this.setState({
              $$data: widget.data,
              attributes: widget.attributes,
              error: null
            });
          }
        })
        .then(data => button.removeClass('active'))
        .catch(error => {
          button.removeClass('active');
          if(JSON.stringify(error.error) !== JSON.stringify(this.state.error)) {
            this.setState({ $$data: [], error: error.error });
          }
        })
    );
  }

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
    .catch(error => this.setState({ error: error }));
  }

  contentHeight () {
    if (this.refs.content !== undefined)
      return this.refs.content.clientHeight
  }

  contentWidth () {
    if (this.refs.content !== undefined)
      return this.refs.content.clientWidth
  }

  background (property) {
    return get(this.props.options.background, property);
  }

  render () {
    const Type = components[this.props.type || 'WidgetSerie'];
    const color = this.background('color');

    const style = {
      backgroundColor: color == 'transparent' ? null : color
    };

    const cssClass = cs(
      'widget center-align',
      {
        'transparent-bg': color == 'transparent'
      }
    );

    return (
      <div className = { cssClass } style = { style }>
        <WidgetTitle
          widget_id={this.props.id}
          title={this.props.title}
          links={this.props.options.links}
          locked={this.props.locked}
          remove={this.removeWidget.bind(this)}
        />
        <div className='widget-content' ref='content'>
          { this.background('image') ?
              <WidgetImage
                image = { this.background('image') }
                opacity = { this.background('opacity') }
              /> : null
          }
          <Type {...this.props} {...this.state.attributes}
            data={this.state.$$data} error={this.state.error}
            height={this.contentHeight()}
            width={this.contentWidth()} />
        </div>
      </div>
    )
  }
};

WidgetBase.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string,
  options: PropTypes.object,
  locked: PropTypes.bool.isRequired,
  reloadTimestamp: PropTypes.number,
  remove: PropTypes.func,
  type: PropTypes.oneOf(Object.keys(components))
};
