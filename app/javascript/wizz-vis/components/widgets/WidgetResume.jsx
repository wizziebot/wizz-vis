/* jshint esversion: 6 */

import React from 'react';
import Compare from './../../utils/compare';
import Format from './../../utils/format';
import ResumeValue from './../ResumeValue';


export default class WidgetResume extends React.Component {
  constructor(props) {
    super(props);
  }

  getValue(data, aggregator, compare) {
    const aggregator_key = Compare.metric_name(aggregator, compare);
    if (data.length == 0) {
      return 0;
    } else {
      return data.map(
        d => d[aggregator_key]
      ).reduce((a,b) => a + (b || 0), 0);
    }
  }

  getHeight() {
    return this.props.aggregators.length * 8 + '%';
  }

  render () {
    if(this.props.compare) {
      return(
        <div className='widget-resume' style = {{ height: this.getHeight() }} >
          {
            this.props.aggregators.map((aggregator) => {
              const total = this.getValue(this.props.data, aggregator);
              const total_compared = this.getValue(this.props.data, aggregator, this.props.compare);
              const increment = total - total_compared;
              const percent = Format.prefix(Math.abs(increment) * 100 / total, 1);

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
    } else {
      return(null);
    }
  }
}
