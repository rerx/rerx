import { Component } from 'react';

export const helper = {
  refEvent(ref, type) {
    if (!(this instanceof Component)) {
      console.error(`You have to bind \`helper.refEvent()\` to the component before using it.`);
    }

    return e => this.refs[ref] && this.refs[ref].event[type](e);
  },
  thisEvent(type) {
    if (!(this instanceof Component)) {
      console.error(`You have to bind \`helper.thisEvent()\` to the component before using it.`);
    }

    return e => e.target === this && e.type === type;
  }
};
