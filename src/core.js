import { createCore } from './createCore';

let core = createCore();

export function select(args) {
  core.select.apply(this, args);
}

export function dispatch(args) {
  core.dispatch.apply(this, args);
}

export function willMount(args) {
  core.willMount.apply(this, args);
}

export function willUnmount(args) {
  core.willUnmount.apply(this, args);
}

export function getEventStream() {
  return core.event$;
}

export function reset() {
  core = createCore();
}
