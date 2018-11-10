/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Dashboard from '../components/Dashboard';

import * as actions from '../actions/index';

const DashboardContainer = ({actions, ...props }) => (
  <Dashboard {...{actions, ...props }} />
);

DashboardContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  reloadTimestamp: PropTypes.number
};

function mapStateToProps(state) {
  return {
    reloadTimestamp: state.reloadTimestamp
    // Component's prop_name: reducer_name set in index file.
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
