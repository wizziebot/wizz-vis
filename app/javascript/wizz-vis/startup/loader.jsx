/* jshint esversion: 6 */

import React from 'react';
import { Provider } from 'react-redux';
import ReactOnRails from 'react-on-rails';
import { render } from "react-dom";

/*
*  Export a function that returns a ReactComponent, depending on a store named ReduxStore.
*  This is used for the client rendering hook after the page html is rendered.
*  React will see that the state is the same and not do anything.
*/
export function init(Component, props, domNodeId) {
  // This is where we get the existing store.
  const store = ReactOnRails.getStore('ReduxStore');

  // Provider uses this.props.children, so we're not typical React syntax.
  // This allows redux to add additional props to the ControlsContainer.
  const element = (
    <Provider store={store}>
      <Component {...props} />
    </Provider>
  )

  return render(element, document.getElementById(domNodeId));
};
