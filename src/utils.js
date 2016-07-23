import { Component } from 'react';
import { distinctUntilChanged } from 'rxjs/operator/distinctUntilChanged';
import { publishReplay } from 'rxjs/operator/publishReplay';

export { isBrowser } from './isBrowser';
export { isServer } from './isServer';

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

export function replay(stream$) {
  return stream$
    ::publishReplay(1)
    .refCount();
}

export function replayDistinct(stream$) {
  return stream$
    ::distinctUntilChanged()
    ::publishReplay(1)
    .refCount();
}
