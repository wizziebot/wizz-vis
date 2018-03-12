import React from 'react';

export default class WidgetValue extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      $$data: [],
      aggregator: '',
      fetchDataError: null
    };
  }

  componentDidMount() {
    this.fetchData();
    this.setAggregator();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reloadTimestamp !== this.props.reloadTimestamp) {
      this.fetchData();
    }
  }

  fetchData() {
    return (
      fetch('/widgets/' + this.props.id + '/data.json')
        .then(response => response.json())
        .then(data => this.setState({ $$data: data }))
    )
  }

  setAggregator() {
    this.setState({
      aggregator: this.props.aggregators[0].name
    })
  }

  getValue() {
    const data_length = this.state.$$data.length;
    return data_length == 0 ? 0 : Math.round(this.state.$$data[data_length - 1][this.state.aggregator]);
  }

  render () {
    const data = 2222;
    const title = 'Title';

    return (
    <div className='widget-value'>
      <div className='card horizontal'>
        <div className='card-stacked'>
          <div className='card-content center-align valign-wrapper'>
            <p>{this.getValue()}</p>
          </div>
        </div>
      </div>
    </div>
    )
  }
}
