import React, { Component, PropTypes } from 'react';
import { DOM } from 'rerx/DOM';
import { helper, replayDistinct } from 'rerx/utils';
import { select, dispatch, willMount, willUnmount } from 'rerx/core';
import { Observable } from 'rxjs/Rx';

const { Span } = DOM;

export class Counter extends Component {
  constructor(props) {
    super(props);

    // Match if event is dispatched by this component (e.target === this).
    const thisEvent = helper.thisEvent.bind(this);


    // Events inside `this.event` are observable.
    this.event = {
      incrementClick: thisEvent('incrementClick'),
      decrementClick: thisEvent('decrementClick')
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

    this.onIncrement = this.onIncrement.bind(this);
    this.onDecrement = this.onDecrement.bind(this);
  }

  onIncrement() {
    dispatch({
      type: 'incrementClick',
      target: this
    });
  }

  onDecrement() {
    dispatch({
      type: 'decrementClick',
      target: this
    });
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
        <button onClick={this.onIncrement}>+</button>
        <button onClick={this.onDecrement}>-</button>
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
