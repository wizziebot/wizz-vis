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

  componentWillReceiveProps(nextProps) {
    if (nextProps.reloadTimestamp !== this.props.reloadTimestamp) {
      this.fetchData();
    }
  }

  fetchData() {
    let button = $('.preloader-wrapper[widget_id="' + this.props.id + '"]');
    button.addClass('active');
    return (
      fetch('/widgets/' + this.props.id + '/data.json')
        .then(response => response.json())
        .then(data => this.setState({
          $$data: data.map((d) => {
            if(d[this.state.dimension.name] == null) d[this.state.dimension.name] = 'N/A'
            return d
          })
        }))
        .then(data => button.removeClass('active'))
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
    if(this.state.$$data.length == 0) {
      return(<h5>No data points.</h5>)
    } else {
      let theme = {
        tableHeader: {
          backgroundColor: Theme.table(this.props.theme).thead_bg,
          color: Theme.table(this.props.theme).thead_color
        },
        table: {
          backgroundColor: Theme.table(this.props.theme).tbody_bg,
          color: Theme.table(this.props.theme).tbody_color,
          borderColor: Theme.table(this.props.theme).border_color,
          height: '20px'
        }
      }
      return (
        <div className="widget_table">
          <MuiThemeProvider>
            <DataTables
              height={(this.props.height - HEADER_HEIGHT).toString() + 'px'}
              showHeaderToolbar={false}
              showHeaderToolbarFilterIcon={false}
              tableHeaderStyle={theme.tableHeader}
              tableHeaderColumnStyle={theme.tableHeader}
              /* tableBodyStyle={theme.table} */
              tableRowStyle={theme.table}
              /* tableRowColumnStyle={theme.table} */
              fixedHeader={true}
              selectable={false}
              showRowHover={false}
              columns={this.state.header}
              data={this.state.$$data}
              showCheckboxes={false}
              showFooterToolbar={false}
            />
          </MuiThemeProvider>
        </div>
      );
    }
  }
}
