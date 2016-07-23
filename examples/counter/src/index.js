import React from 'react';
import ReactDOM from 'react-dom';
import { select, run } from 'rerx/core';
import { Counter } from './Counter';

const mountNode = document.getElementById("root");

// Component events are observable.
select('#my-counter', 'incrementClick').subscribe(e => {
  console.log(e);
});

// Component state is observable.
select('#my-counter', 'count$').subscribe(count => {
  console.log(count);
});

ReactDOM.render(<Counter id="my-counter" /> , mountNode, run);
