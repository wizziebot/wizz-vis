/* jshint esversion: 6 */

import React from 'react';
import PropTypes from 'prop-types';
import Info from './../Info';
import get from 'lodash/get';
import Format from './../../utils/format';
import * as common from './../../props';

export default class WidgetText extends React.Component {
  get text() {
    return get(this.props, 'options.text');
  }

  get fontSize() {
    return get(this.props, 'options.fontSize') ||
      Format.estimateFontSize(this.props.width, this.props.height);
  }

  render () {
    if(this.props.error)
      return(<Info error={this.props.error} />)

    return (
      <div className='widget-text'>
        <div className='card valign-wrapper' style={{ fontSize: this.fontSize }}>
          <div className='card-content center-block'>
            { this.text }
          </div>
        </div>
      </div>
    )
  }
};

WidgetText.propTypes = {
  ...common.BASE,
  ...common.SIZE,
  options: PropTypes.shape({
    text: PropTypes.string,
    fontSize: PropTypes.string
  })
};
