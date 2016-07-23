import { createCore } from './createCore';

let core = createCore();

export function select() {
  return core.select.apply(this, arguments);
}

export function dispatch() {
  core.dispatch.apply(this, arguments);
}

export function willMount() {
  core.willMount.apply(this, arguments);
}

export function willUnmount() {
  core.willUnmount.apply(this, arguments);
}

export function getEventStream() {
  return core.event$;
}

export function run() {
  core.event$.connect();
}

export function reset() {
  core = createCore();
}
