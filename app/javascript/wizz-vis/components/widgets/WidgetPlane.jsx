/*jshint esversion: 6 */
import React from 'react';
import ReactHeatmap from '../../vendor/ReactHeatmap';

export default class WidgetPlane extends React.Component {

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    let button = $('.preloader-wrapper[widget_id="' + this.props.id + '"]');
    button.addClass('active');
    button.removeClass('active');
  }

  getImageURL() {
    return this.props.options.image;
  }

  render () {
    const data = [
      { x: 9, y: 5, value: 30}, { x: 5, y: 1, value: 5},
      { x: 8, y: 4, value: 5}, { x: 8, y: 4, value: 5},
      { x: 8, y: 4, value: 5}, { x: 10, y: 15, value: 5},
      { x: 50, y: 40, value: 2}, { x: 20, y: 20, value: 3},
      { x: 50, y: 30, value: 3}, { x: 40, y: 15, value: 3},
      { x: 50, y: 2, value: 2}, { x: 20, y: 40, value: 2},
      { x: 10, y: 5, value: 2}, { x: 8, y: 4, value: 5}
    ];

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <img style={{ position: 'absolute', top: 0, left: 0,
                      width: '100%', height: '100%' }}
          src={ this.getImageURL() }
        />
      <ReactHeatmap max={5} data={data} />
      </div>
    )
  }
}
