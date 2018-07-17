/* jshint esversion: 6 */

import React from 'react';
import Compare from './../../utils/compare';
import Format from './../../utils/format';


export default class WidgetResume extends React.Component {
  constructor(props) {
    super(props);
  }

  getValue(data, aggregator, compare) {
    const aggregator_key = Compare.compared_name(aggregator, compare);
    if (data.length == 0) {
      return 0;
    } else {
      return data.map(
        d => d[aggregator_key]
      ).reduce((a,b) => a + (b || 0), 0);
    }
  }

  getColor(increment) {
    return increment > 0 ? 'green' : 'red';
  }

  getIcon(increment) {
    return increment > 0 ? ' \u25B2 ' : ' \u25BC ';
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
                  {
                    'Number of ' + aggregator + ': ' + Format.prefix(total, 2)
                  }
                  <span className='compare' style={{ color: this.getColor(increment) }}>
                    { this.getIcon(increment) +
                      Format.prefix(Math.abs(increment), 2) + ' (' + percent + '%)'
                    }
                  </span>
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
