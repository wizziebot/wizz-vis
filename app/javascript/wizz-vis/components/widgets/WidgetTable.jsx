/* jshint esversion: 6 */

import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DataTables from 'material-ui-datatables';
import Theme from './../../utils/theme';
import Format from './../../utils/format';
import Info from './../Info';
import castArray from 'lodash/castArray';
import find from 'lodash/find';
import pick from 'lodash/pick';
import cloneDeep from 'lodash/cloneDeep';
import ResumeValue from './../ResumeValue';

const HEADER_HEIGHT = 80;

export default class WidgetTable extends React.Component {
  constructor(props) {
    super(props);

    this.aggregators = [];
    this.dimensions = [];
    this.header = [];
  }

  data() {
    return this.props.data.data || [];
  }

  compare() {
    return this.props.data.compare || [];
  }

  formatData() {
    // Prevent to change the data props, for resizes.
    let data = cloneDeep(this.data());

    if (this.compare().length > 0) {
      data.map((actual_data) => {
        // Selects the item from compare data which dimension values are equal to
        // the ones in the actual data, in order to calculate increments.
        var comp_data = find(this.compare(), pick(actual_data, this.dimensions));

        // Calculates the increments(by aggregator) and updates the array of data
        // to show. If there are no past values to compare, interpret that the
        // values are equal to zero, so an increase of 100% is shown.
        this.aggregators.map((agg) => {
          actual_data[agg] =
            <ResumeValue
              showTotal actualData={actual_data[agg]}
              compareData={comp_data === undefined ? 0 : comp_data[agg]} />
        });
      });
    }

    return data.map((d) =>
      Format.formatColumns(d)
    );
  }

  setAggregators() {
    if (this.props.options.metrics) {
      this.aggregators = castArray(this.props.options.metrics);
    } else {
      this.aggregators = this.props.aggregators.map(a => a.name);
    }
  }

  setDimensions() {
    this.dimensions = this.props.dimensions.map(d => d.name);
  }

  setHeader() {
    this.header = this.dimensions.concat(this.aggregators)
      .map(d => {
        return ({
          key: d,
          label: d,
          style: {
            height: (
              this.props.height - HEADER_HEIGHT < 0 ?
                this.props.height : HEADER_HEIGHT
            )
          }
        });
      });
  }

  getContentHeight() {
    const content_size = this.props.height - HEADER_HEIGHT
    return content_size < 0 ? '0px' : content_size.toString() + 'px'
  }

  render () {
    if(this.props.error || this.data().length == 0) {
      return(<Info error={this.props.error} />)
    } else {
      const theme = {
        tableHeader: {
          backgroundColor: Theme.table(this.props.theme).thead_bg,
          color: Theme.table(this.props.theme).thead_color
        },
        table: {
          backgroundColor: Theme.table(this.props.theme).tbody_bg,
          color: Theme.table(this.props.theme).tbody_color,
          borderColor: Theme.table(this.props.theme).border_color
        }
      }
      this.setAggregators();
      this.setDimensions();
      this.setHeader();

      const data = this.formatData();

      return (
        <div className="widget_table">
          <MuiThemeProvider>
            <DataTables
              height={this.getContentHeight()}
              showHeaderToolbar={false}
              showHeaderToolbarFilterIcon={false}
              tableHeaderStyle={theme.tableHeader}
              tableHeaderColumnStyle={theme.tableHeader}
              tableRowStyle={theme.table}
              fixedHeader={true}
              selectable={false}
              showRowHover={false}
              columns={this.header}
              data={data}
              showCheckboxes={false}
              showFooterToolbar={false}
            />
          </MuiThemeProvider>
        </div>
      );
    }
  }
}
