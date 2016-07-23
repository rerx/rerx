import React, { Component, PropTypes } from 'react';
import { select, willMount, willUnmount } from 'rerx/core';
import { DOM } from 'rerx/component';
import { helper, replayDistinct } from 'rerx/utils';
import { Observable } from 'rxjs/Rx';
import { Button } from './Button';

const { Span } = DOM;

export class Counter extends Component {
  constructor(props) {
    super(props);

    // Match the events dispatched by referenced component (e.target === this.refs.component).
    const refEvent = helper.refEvent.bind(this);

    this.event = {
      incrementClick: refEvent('incrementBtn', 'click'),
      decrementClick: refEvent('decrementBtn', 'click')
    };


    // cache this selector
    const this$ = select(this);

    const increment$ = select(this$, 'incrementClick')
      .map(() => count => count + 1);

    const decrement$ = select(this$, 'decrementClick')
      .map(() => count => count - 1);

    const count$ = replayDistinct(
      Observable
        .merge(
          increment$,
          decrement$
        )
        .startWith(this.props.count)
        .scan((state, update) => update(state))
    );

    // State streams inside `this.state` are observable.
    this.state = {
      count$
    };
  }

  componentWillMount() {
    willMount(this);
  }

  componentWillUnmount() {
    willUnmount(this);
  }

  render() {
    const { count } = this.props;
    const { count$ } = this.state;

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
  count: PropTypes.number.isRequired
};
