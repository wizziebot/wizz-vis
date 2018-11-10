/* jshint esversion: 6 */

import React from 'react';
import PropTypes from 'prop-types';

export default class Info extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if(this.props.error) {
      return(
        <div className='widget-info'>
          <div className='card'>
            <div className='card-content'>
              <span className="info-corner"></span>
              <a className='activator'>
                <i className='material-icons'>error</i>
              </a>
            </div>
            <div className='card-reveal'>
              <span className='card-title'>
                {this.props.error}
                <i className='material-icons right'>close</i>
              </span>
            </div>
          </div>
        </div>
      )
    } else {
      return(<h5>No data points.</h5>)
    }
  }
};

Info.propTypes = {
  error: PropTypes.string
};
