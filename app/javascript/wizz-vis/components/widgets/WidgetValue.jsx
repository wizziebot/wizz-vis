import React from 'react';

export default class WidgetValue extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    const data = 2222;
    const title = 'Title';

    return (
    <div className='widget-value'>
      <div className='card horizontal'>
        <div className='card-stacked'>
          <div className='card-title center-align'>
            {title}
          </div>
          <div className='card-content center-align valign-wrapper'>
            <p>{data}</p>
          </div>
        </div>
      </div>
    </div>
    )
  }
}
