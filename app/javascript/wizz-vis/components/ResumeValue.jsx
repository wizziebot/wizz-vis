/* jshint esversion: 6 */

import React from 'react';
import Format from './../utils/format';

export default class WidgetResume extends React.Component {
  constructor(props) {
    super(props);
  }

  getColor(increment) {
    return increment > 0 ? 'green' : 'red';
  }

  getIcon(increment) {
    return increment > 0 ? ' \u25B2 ' : ' \u25BC ';
  }

  render () {
    const increment = this.props.total - this.props.total_compared;
    const percent = Format.prefix(Math.abs(increment) * 100 / this.props.total, 1);

    return (
      <span>
          {
            this.props.show_total ? Format.prefix(this.props.total, 2) :
            null
          }
          <span className='compare' style={{ color: this.getColor(increment) }}>
            { this.getIcon(increment) +
              Format.prefix(Math.abs(increment), 2) + ' (' + percent + '%)'
            }
          </span>
      </span>
    )
  }
}
