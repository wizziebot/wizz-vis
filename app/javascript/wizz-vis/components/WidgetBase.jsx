/* jshint esversion: 6 */

import React from 'react';
import { ResponsiveContainer } from 'recharts';

import WidgetTitle from './widgets/WidgetTitle';
import WidgetSerie from './widgets/WidgetSerie';
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
import WidgetRoute from './widgets/WidgetRoute';
import WidgetHistogram from './widgets/WidgetHistogram';

import Errors from './../utils/errors';

export default class WidgetBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      $$data: [],
      attributes: {},
      error: null,
      reloadTimestamp: null
    };

    this.components = {
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
      WidgetImage,
      WidgetRoute,
      WidgetHistogram
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

  render () {
    const Type = this.components[this.props.type || 'WidgetSerie'];

    return (
      <div className='widget center-align'>
        <WidgetTitle
          widget_id={this.props.id}
          title={this.props.title}
          links={this.props.options.links}
          locked={this.props.locked}
          remove={this.removeWidget.bind(this)}
        />
        <div className='widget-content' ref='content'>
          <Type {...this.props} {...this.state.attributes}
            data={this.state.$$data} error={this.state.error}
            height={this.contentHeight()}
            width={this.contentWidth()} />
        </div>
      </div>
    )
  }
}
