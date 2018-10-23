/* jshint esversion: 6 */

import PropTypes from 'prop-types';
import React from 'react';
import MenuRange from './controls/MenuRange';

export default class Controls extends React.Component {
  constructor(props){
    super(props);

    this.updateReload = this.updateReload.bind(this);
  }

  updateReload() {
    this.props.actions.updateReload(Date.now());
  }

  render() {
    return(
      <div>
        <div className='nav-entry col right'>
          <a href="#" onClick={ this.updateReload }>
            <i className="material-icons">autorenew</i>
          </a>
        </div>
        <MenuRange id={this.props.dashboard_id} />
      </div>
    );
  }
}
