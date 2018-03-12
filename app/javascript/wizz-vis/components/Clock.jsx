import React from 'react';

export default class Clock extends React.Component {
  constructor(props){
    super(props);
    this.state = { currentCount: this.props.interval || 10 }
  }

  timer() {
    this.setState({
      currentCount: this.state.currentCount - 1
    })
    if(this.state.currentCount < 0) {
      this.props.clockReload()
      this.setState({ currentCount: this.props.interval || 10 })
    }
  }

  componentDidMount() {
    this.intervalId = setInterval(this.timer.bind(this), 1000);
  }

  componentWillUnmount(){
    clearInterval(this.intervalId);
  }

  render() {
    return(null);
  }
}
