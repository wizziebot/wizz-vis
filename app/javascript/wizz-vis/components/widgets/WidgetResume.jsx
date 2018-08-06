/* jshint esversion: 6 */

import React from 'react';
import Compare from './../../utils/compare';
import Format from './../../utils/format';
import ResumeValue from './../ResumeValue';


export default class WidgetResume extends React.Component {
  constructor(props) {
    super(props);
  }

  getHeight() {
    return this.props.aggregators.length * 8 + '%';
  }

  render () {
    return(
      <div className='widget-resume' style = {{ height: this.getHeight() }} >
        {
          this.props.aggregators.map((aggregator) => {
            const total = this.props.data[1][aggregator];
            const total_compared = this.props.data[0][aggregator];

            return(
              <div key={'resume-' + aggregator}>
                <span>Number of {aggregator}: </span>
                <ResumeValue show_total total={total} total_compared={total_compared} />
              </div>
            )
          })
        }
      </div>
    )
  }
}
