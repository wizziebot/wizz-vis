/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';
import startCase from 'lodash/startCase';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/index';

const MENU = {
  latest: {
    last_1_hour: '1H',
    last_6_hours: '6H',
    last_1_day: '1D',
    last_7_days: '7D',
    last_30_days: '30D'
  },
  current: {
    current_day: 'D',
    current_week: 'W',
    current_month: 'M'
  },
  previous: {
    previous_day: 'D',
    previous_week: 'W',
    previous_month: 'M'
  }
};

class RelativeRange extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      range: this.props.range,
      startTime: this.props.startTime || '',
      endTime: this.props.endTime || ''
    };

    this.setRange = this.setRange.bind(this);
    this.acceptRange = this.acceptRange.bind(this);
    this.menuOptions = MENU;
  }

  setRange(value) {
    this.setState({ range: value, startTime: null, endTime: null });
  }

  acceptRange() {
    this.props.updateDashboard(this.state);
    this.props.actions.updateRanges(this.state);
  }

  render() {
    return(
      <div>
        {
          Object.entries(this.menuOptions).map(([section, content]) => (
            <div className="button-group" key={section}>
              <div className="button-group-title">{ startCase(section) }</div>
              <ul className="group-container">
                { Object.entries(content).map(([k, v]) => (
                    <li className={"group-member " + (this.state.range == k ? 'selected' : '')}
                      onClick={() => this.setRange(k)} key={k}>{v}</li>
                  )) }
              </ul>
            </div>
          ))
        }
        <div className="divider"></div>
        <div className="button-group">
          <ul className="group-container">
            <li className="group-member primary-color" onClick={ this.acceptRange }>OK</li>
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    range: state.setRanges.range,
    startTime: state.setRanges.startTime,
    endTime: state.setRanges.endTime
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(RelativeRange);
