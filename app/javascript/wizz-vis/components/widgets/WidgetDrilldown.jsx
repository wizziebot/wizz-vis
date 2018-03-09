import React, { Component } from 'react';

export default class WidgetDrilldown extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div className="drilldown left">
        <a className="dropdown-button" href="#" data-activates={"links_" + this.props.widget_id} data-constrainwidth="false">
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
