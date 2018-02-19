import React from 'react';
import request from 'axios';
import Immutable from 'immutable';
import {Responsive, WidthProvider} from 'react-grid-layout';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default class Dashboard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      $$widgets: [],
      dashboard_id: this.props.id,
      fetchWidgetsError: null
    };
  }

  componentDidMount() {
    this.fetchWidgets();
  }

  fetchWidgets() {
    return (
      request
        .get('/dashboards/' + this.state.dashboard_id + '/widgets.json', { responseType: 'json' })
        .then(res => this.setState({ $$widgets: res.data }))
        .catch(error => this.setState({ fetchWidgetsError: error }))
    );
  }

  render () {
    const lg_layout =
      this.state.$$widgets.map((w) => {
        return { i: w.id.toString(), x: w.row, y: w.col, w: w.size_x, h: w.size_y }
      });


    // layout is an array of objects, see the demo for more complete usage
    const layout = { lg: (lg_layout || []) };

    const widgets = this.state.$$widgets.map((w) => {
                      return <div key={ w.id }>{ w.name }</div>;
                    });

    return (
      <ResponsiveReactGridLayout className="layout" layouts={layout}
        cols={12} rowHeight={30}
        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
        cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}>

        { widgets }

      </ResponsiveReactGridLayout>
    )
  }
}
