/* jshint esversion: 6 */

import React from 'react';
import Format from './../utils/format';

export default class WidgetResume extends React.Component {
  constructor(props) {
    super(props);
  }

  getColor(difference) {
    if (difference == 0) {
      return 'inherited';
    } else if (difference > 0) {
      return 'green';
    } else {
      return 'red';
    }
  }

  getIcon(difference) {
    if (difference == 0) {
      return ' = ';
    } else if (difference > 0) {
      return ' \u25B2 ';
    } else {
      return ' \u25BC ';
    }
  }

  getPercentText(value, difference) {
    if(value == 0){
      return ' (new)';
    } else {
      const percent = Format.prefix(Math.abs(difference) * 100 / value, 1);
      return ` (${percent}%)`;
    }
  }

  render () {
    const difference = this.props.actualData - this.props.compareData;

    return (
      <span>
          {
            this.props.showTotal ? Format.prefix(this.props.actualData, 2) :
            null
          }
          <span className='compare' style={{ color: this.getColor(difference) }}>
            { this.getIcon(difference) +
              Format.prefix(Math.abs(difference), 2) + this.getPercentText(this.props.compareData, difference)
            }
          </span>
      </span>
    )
  }
}
