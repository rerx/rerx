import React, { Component, PropTypes } from 'react';
import { willMount, willUnmount } from 'rerx/core';
import { DOM } from 'rerx/component';
import { helper } from 'rerx/utils';
import { Observable } from 'rxjs/Rx';
import { Button } from './Button';

const { Span } = DOM;

export class Counter extends Component {
  constructor(props) {
    super(props);

    const refEvent = helper.refEvent.bind(this);

    this.event = {
      incrementClick: refEvent('incrementBtn', 'click'),
      decrementClick: refEvent('decrementBtn', 'click')
    };
  }

  componentWillMount() {
    willMount(this);
  }

  componentWillUnmount() {
    willUnmount(this);
  }

  render() {
    const { count, count$ } = this.props;

    return (
      <div>
        <Span children={count} children$={count$} />
        <Button ref="incrementBtn">+</Button>
        <Button ref="decrementBtn">-</Button>
      </div>
    );
  }
}

Counter.defaultProps = {
  count: 0
};

Counter.propTypes = {
  count: PropTypes.number.isRequired,
  count$: PropTypes.instanceOf(Observable)
};
