import React, { Component } from 'react';
import { dispatch } from 'rerx/core';
import { helper } from 'rerx/utils';

export class Button extends Component {
  constructor(props) {
    super(props);

    const thisEvent = helper.thisEvent.bind(this);

    this.event = {
      click: thisEvent('click')
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    dispatch({
      type: 'click',
      target: this
    });
  }

  render() {
    return (
      <button {...this.props} onClick={this.onClick} />
    );
  }
}
