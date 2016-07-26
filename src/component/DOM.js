import React from 'react';
import { reactive } from './reactive';

export const DOM = {};

Object.keys(React.DOM).forEach(tag => {
  const name = tag.charAt(0).toUpperCase() + tag.substr(1);
  const get = (function() {
    let component;

    return () => {
      if (!component) {
        component = reactive(tag);
      }

      return component;
    }
  })();

  Object.defineProperty(DOM, name, { get });
});
