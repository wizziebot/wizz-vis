import React from 'react';
import request from 'axios';
import {Responsive, WidthProvider} from 'react-grid-layout';
import WidgetBase from './WidgetBase';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const COLS = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
const ROWHEIGHT = 100;

export default class Dashboard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      $$widgets: [],
      layout: null,
      fetchWidgetsError: null,
      updateLayoutError: null
    };
  }

  componentDidMount() {
    this.fetchWidgets();
  }

  fetchWidgets() {
    return (
      request
        .get('/dashboards/' + this.props.id + '/widgets.json', { responseType: 'json' })
        .then(res => this.setState({
          $$widgets: res.data,
          layout: res.data.map((w) => {
            return { i: w.id.toString(), x: w.col, y: w.row, w: w.size_x, h: w.size_y }
          })
        }))
        .catch(error => this.setState({ fetchWidgetsError: error }))
    );
  }

  onLayoutChange(layout) {
    fetch(
      '/dashboards/' + this.props.id + '/layout.json',
      {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layout: layout })
      }
    )
    .then(response => this.setState({ layout: layout }))
    .catch(error => this.setState({ updateLayoutError: error }));
  }

  render () {
    // layout is an array of objects, see the demo for more complete usage
    const layout = { lg: (this.state.layout || []) };

    const widgets = this.state.$$widgets.map((w) => {
                      return <div key={ w.id }>
                              <WidgetBase {...w} theme={this.props.theme} />
                             </div>;
                    });

    return (
      <ResponsiveReactGridLayout
        className={'layout ' + this.props.theme}
        layouts={layout}
        rowHeight={ROWHEIGHT} breakpoints={BREAKPOINTS}
        cols={COLS}
        onLayoutChange={ (layout) => this.onLayoutChange(layout) }>

        { widgets }

      </ResponsiveReactGridLayout>
    )
  }
}
