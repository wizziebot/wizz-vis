/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/index';
import Kronos from 'react-kronos';
import Time from './../../utils/time';

class FixedRange extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      range: this.props.range,
      startTime: this.props.startTime || '',
      endTime: this.props.endTime || ''
    };

    this.setStartTime = this.setStartTime.bind(this);
    this.setEndTime = this.setEndTime.bind(this);
    this.acceptRange = this.acceptRange.bind(this);
  }

  acceptRange() {
    this.props.actions.updateRanges(this.state);
    this.props.updateDashboard(this.state);
  }

  setEndTime(endTime) {
    this.setState({
      endTime: Time.moment(endTime).toISOString(),
      startTime: this.state.startTime || Time.moment(endTime).subtract(1, 'hour').toISOString(),
      range: null
    });
  }

  setStartTime(startTime) {
    this.setState({
      startTime: Time.moment(startTime).toISOString(),
      endTime: this.state.endTime || Time.moment(startTime).add(1, 'hour').toISOString(),
      range: null
    });
  }

  render() {
    return(
      <div>
        <div className="date-range-input">
          <div className="label">Start</div>
          <Kronos date={this.state.startTime} onChangeDateTime={this.setStartTime}
            calendarStyle={{lineHeight: '20px'}} />
          <Kronos time={this.state.startTime} onChangeDateTime={this.setStartTime}
            hideOutsideDateTimes format={'HH:mm'} options={{format: {hour: 'HH:mm'}}} />
        </div>

        <div className="date-range-input">
          <div className="label">End</div>
          <Kronos date={this.state.endTime} onChangeDateTime={this.setEndTime}
            calendarStyle={{lineHeight: '20px'}} />
          <Kronos time={this.state.endTime} format={'HH:mm'} hideOutsideDateTimes
            onChangeDateTime={this.setEndTime} options={{format: {hour: 'HH:mm'}}} />
        </div>

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
    startTime: state.setRanges.startTime,
    endTime: state.setRanges.endTime
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(FixedRange);
