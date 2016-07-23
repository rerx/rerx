import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { select, run } from 'rerx/core';
import { Counter } from './Counter';

const mountNode = document.getElementById("root");
const component$ = select(components => components);


// Mounting components are observable.
component$.subscribe(components => {
  console.info(components);
});

// Events are observable.
select('#my-counter', 'incrementClick').subscribe(e => {
  console.log(e);
});

// States are observable.
select('#my-counter', 'count$').subscribe(count => {
  console.log(count);
});


render(<Counter id="my-counter" /> , mountNode, run);

// Try calling unmount() from the console.
window.unmount = () => unmountComponentAtNode(mountNode);
