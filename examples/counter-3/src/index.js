import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { run } from 'rerx/core';
import { state } from './state';
import { Counter } from './Counter';

const mountNode = document.getElementById("root");
const { count, count$ } = state;

render(<Counter id="my-counter" count={count} count$={count$} /> , mountNode, run);
