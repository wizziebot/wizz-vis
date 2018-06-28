/* jshint esversion: 6 */
import React from 'react';
import get from 'lodash/get';

export default class WidgetImage extends React.Component {
  get keepRatio() {
    return this.props.keepRatio || get(this.props, 'options.keep_ratio');
  }

  get imageURL() {
    return this.props.image || get(this.props, 'options.image');
  }

  get opacity() {
    return this.props.opacity || get(this.props, 'options.opacity');
  }

  get onLoad() {
    return this.props.onLoad;
  }

  render() {
    let style = { position: 'absolute', top: 0, left: 0 };

    if (this.keepRatio) {
      style = {...style, top: '50%', left: '50%',
               transform: 'translate(-50%, -50%)',
               maxWidth: '100%', maxHeight: '100%',
               height: 'auto'};
    } else {
      style = {...style, width: '100%', height: '100%',
               opacity: this.opacity};
    }

    return (
      <img
        ref={(image) => { this.image = image; }}
        style={style}
        src={this.imageURL}
        onLoad={this.onLoad}
      />
    )
  }
}
