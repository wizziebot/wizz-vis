/* jshint esversion: 6 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/index';

class Clock extends React.Component {
  constructor(props){
    super(props);
    this.state = { currentCount: this.props.interval };
    this.updateReload = this.updateReload.bind(this);
  }

  timer() {
    this.setState({
      currentCount: this.state.currentCount - 1
    });
    if(this.state.currentCount < 0) {
      this.updateReload();
      this.setState({ currentCount: this.props.interval });
    }
  }

  componentDidMount() {
    this.intervalId = setInterval(this.timer.bind(this), 1000);
  }

  componentWillUnmount(){
    clearInterval(this.intervalId);
  }

  updateReload() {
    this.props.actions.updateReload(Date.now());
  }

  render() {
    return(null);
  }
}

Clock.propTypes = {
  interval: PropTypes.number.isRequired
};

function mapStateToProps(state) {
  return {
    reloadTimestamp: state.reloadTimestamp
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Clock);
