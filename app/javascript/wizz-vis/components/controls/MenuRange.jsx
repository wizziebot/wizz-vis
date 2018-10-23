/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/index';
import Time from './../../utils/time';
import FixedRange from './FixedRange';
import RelativeRange from './RelativeRange';
import startCase from 'lodash/startCase';

class MenuRange extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      error: null,
      menuOpen: false,
      menuType: 'relative',
      menuRange: this.props.range,
      startTime: this.props.startTime || '',
      endTime: this.props.endTime || ''
    };

    this.toggleMenu = this.toggleMenu.bind(this);
    this.setMenu = this.setMenu.bind(this);
    this.updateDashboard = this.updateDashboard.bind(this);
  }

  toggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  setMenu(value) {
    this.setState({ menuType: value });
  }

  updateDashboard(params) {
    fetch(
      '/dashboards/' + this.props.id + '.json',
      { method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': ReactOnRails.authenticityToken()
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          range: params.range,
          start_time: params.startTime,
          end_time: params.endTime
        })
      }
    ).catch(error => this.setState({ error: error }));

    this.toggleMenu();
  }

  render() {
    return(
      <div className='nav-entry col menu-range right'>
        <div className='ellipsis' href='#' onClick={ this.toggleMenu }>
          { startCase(this.props.range) || Time.formatTimeRange(this.props.startTime, this.props.endTime) }
        </div>

        <div className={'dropdown-content ' + (this.state.menuOpen ? 'open' : 'close')}>
          <div className="col s12 cont">
            <div className="button-group">
              <ul className="group-container">
                <li className={"group-member " + (this.state.menuType == 'relative' ? 'primary-color' : '')}
                  onClick={ () => this.setMenu('relative') }>Relative</li>
                <li className={"group-member " + (this.state.menuType == 'fixed' ? 'primary-color' : '')}
                  onClick={ () => this.setMenu('fixed') }>Fixed</li>
              </ul>
            </div>

            { this.state.menuType == 'relative' ?
              <RelativeRange updateDashboard={ this.updateDashboard } />
              :
              <FixedRange updateDashboard={ this.updateDashboard } />
            }
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MenuRange);
