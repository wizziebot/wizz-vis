/* jshint esversion: 6 */

import React from 'react';
import Info from './Info';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    this.setState({hasError: true});
  }

  render() {
    if (this.state.hasError) {
      return (
        <Info error="Something went wrong. Check the javascript console and contact the administrator." />
      );
    }

    return this.props.children;
  }
}
