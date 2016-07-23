import React from 'react';
import { createReactiveComponent } from './createReactiveComponent';

export const DOM = Object.keys(React.DOM).reduce((result, tag) => {
  const name = tag.charAt(0).toUpperCase() + tag.substr(1);
  result[name] = createReactiveComponent(tag);
  return result;
}, {});
