import React from 'react';

export default class WidgetRefresh extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div className='preloader-wrapper active' widget_id={this.props.widget_id}>
        <div className='spinner-layer'>
          <div className='circle-clipper left'>
            <div className='circle' />
          </div>
          <div className='gap-patch'>
            <div className='circle' />
          </div>
          <div className='circle-clipper right'>
            <div className='circle' />
          </div>
        </div>
      </div>
    )
  }
}
