import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DataTables from 'material-ui-datatables';
import Theme from './../../utils/theme';

const HEADER_HEIGHT = 80;

export default class WidgetTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      $$data: [],
      aggregators: [],
      dimension: null,
      header: []
    };
  }

  componentDidMount() {
    this.setAggregators();
    this.setDimension();
    this.fetchData();
    this.setHeader();
  }

  fetchData() {
    return (
      fetch('/widgets/' + this.props.id + '/data.json')
        .then(response => response.json())
        .then(data => this.setState({ $$data: data }))
    );
  }

  setAggregators() {
    this.setState({
      aggregators: this.props.aggregators
    })
  }

  setDimension() {
    this.setState({
      dimension: this.props.dimensions[0]
    })
  }

  setHeader() {
    this.setState({
      header: [this.props.dimensions[0]].concat(this.props.aggregators).map((d) => {
                return ({
                  key: d.name,
                  label: d.name,
                  style: {
                    height: HEADER_HEIGHT
                  }
                })
              })
    })
  }

  render () {
    let theme = {
      backgroundColor: Theme.grid(this.props.theme),
      color: Theme.text(this.props.theme)
    }
    return (
      <MuiThemeProvider>
        <DataTables
          height={(this.props.height - HEADER_HEIGHT).toString() + 'px'}
          showHeaderToolbar={false}
          showHeaderToolbarFilterIcon={false}
          tableStyle={theme}
          tableRowStyle={theme}
          fixedHeader={true}
          selectable={false}
          showRowHover={false}
          columns={this.state.header}
          data={this.state.$$data}
          showCheckboxes={false}
          showFooterToolbar={false}
        />
      </MuiThemeProvider>
    );
  }
}
