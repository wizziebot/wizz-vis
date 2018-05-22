/* jshint esversion: 6 */

import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DataTables from 'material-ui-datatables';
import Theme from './../../utils/theme';
import Format from './../../utils/format';
import Info from './../Info';

const HEADER_HEIGHT = 80;

export default class WidgetTable extends React.Component {
  constructor(props) {
    super(props);

    this.aggregators = [];
    this.dimensions = [];
    this.header = [];

    this.state = {
      $$data: this.props.data,
      error: this.props.error,
    };
  }

  componentDidMount() {
    this.setAggregators();
    this.setDimensions();
    this.setHeader();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.$$data || nextProps.error !== prevState.error) {
      return {
        $$data: nextProps.data.map((d) =>
          Format.formatColumns(d)
        ),
        error: nextProps.error
      };
    }

    // No state update necessary
    return null;
  }

  setAggregators() {
    if (this.props.options.metrics) {
      this.aggregators =
        Array.isArray(this.props.options.metrics) ? this.props.options.metrics : [this.props.options.metrics];
    } else {
      this.aggregators = this.props.aggregators.map(a => a.name);
    }
  }

  setDimensions() {
    this.dimensions = this.props.dimensions.map(d => d.name);
  }

  setHeader() {
    this.header =
      this.dimensions.concat(this.aggregators)
      .map(d => {
        return ({
          key: d,
          label: d,
          style: {
            height: HEADER_HEIGHT
          }
        });
      });
  }

  render () {
    if(this.state.error || this.state.$$data.length == 0) {
      return(<Info error={this.state.error} />)
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
              tableRowStyle={theme.table}
              fixedHeader={true}
              selectable={false}
              showRowHover={false}
              columns={this.header}
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
