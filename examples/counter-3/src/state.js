import { select } from 'rerx/core';
import { replayDistinct } from 'rerx/utils';
import { Observable } from 'rxjs/Rx';

const count = 0;
const counter$ = select('#my-counter');

const increment$ = select(counter$, 'incrementClick')
  .map(() => count => count + 1);

const decrement$ = select(counter$, 'decrementClick')
  .map(() => count => count - 1);

const count$ = replayDistinct(
  Observable
    .merge(
      increment$,
      decrement$
    )
    .startWith(count)
    .scan((state, update) => update(state))
);

export const state = {
  count,
  count$
};
