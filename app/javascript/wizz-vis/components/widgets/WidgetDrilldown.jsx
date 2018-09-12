import React from 'react';
import PropTypes from 'prop-types';

export default class WidgetDrilldown extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if(this.refs.dropdown !== undefined)
      $(this.refs.dropdown).dropdown();
  }

  render () {
    return (
      <div className="drilldown left">
        <a ref='dropdown' className="dropdown-button" href="#" data-activates={"links_" + this.props.widget_id} data-constrainwidth="false">
          <i className="material-icons">launch</i>
        </a>
        <ul id={"links_" + this.props.widget_id} className="dropdown-content">
          {
            this.props.links.map((link, index) => (
              <li key={index}>
                <a href={link.url} target={ link.type == "absolute" ? "_blank" : "_self" }>
                  {link.name || link.url}
                </a>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}

WidgetDrilldown.propTypes = {
  widget_id: PropTypes.number,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.string
    })
  )
};
