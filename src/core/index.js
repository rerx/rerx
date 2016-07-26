import { createCore } from './createCore';

let core = createCore();

export function select() {
  return core.select.apply(this, arguments);
}

export function dispatch() {
  core.dispatch.apply(this, arguments);
}

export function mount() {
  core.mount.apply(this, arguments);
}

export function unmount() {
  core.unmount.apply(this, arguments);
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
