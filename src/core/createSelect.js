import { Component } from 'react';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operator/filter';
import { withLatestFrom } from 'rxjs/operator/withLatestFrom';
import { map } from 'rxjs/operator/map';
import { merge } from 'rxjs/observable/merge';
import { mergeMap } from 'rxjs/operator/mergeMap';
import { distinctUntilChanged } from 'rxjs/operator/distinctUntilChanged';

function matchClassName(className) {
  return component => {
    if (!component.props.className) {
      return false;
    }

    const propsClassNames = component.props.className.split(/\s+/);
    return propsClassNames.indexOf(className) !== -1;
  };
}

function matchId(id) {
  return component => {
    if (!component.props.id) {
      return false;
    }

    return component.props.id === id;
  };
}

export function createSelect(components$, event$) {
  const cache = {};

  return function select(pattern, type) {
    let matchedComponents$;
    let isCacheable = false;
    let isReusedComponentStream = false;

    if (type && typeof type !== 'string') {
      console.error('Type should be a string.');
      return;
    }

    if (typeof pattern === 'string') {
      matchedComponents$ = cache[pattern];

      if (matchedComponents$) {
        isReusedComponentStream = true;
      } else {
        const prefix = pattern.charAt(0);
        const selectTarget = pattern.substr(1);
        let match;

        if (prefix === '.') {
          match = matchClassName(selectTarget);
          isCacheable = true;
        } else if (prefix === '#') {
          match = matchId(selectTarget);
          isCacheable = true;
        } else if (prefix === '@') {
          if (!this) {
            console.error('You have to bind the component to `select()` before using it.');
            return;
          }

          match = component => component === this.refs[selectTarget];
        } else {
          console.error(`Unknown select pattern: ${pattern}.`);
          return;
        }

        matchedComponents$ = components$
          ::map(components => components.reduce((result, component) => {
            if (match(component)) {
              result.push(component);
            }

            return result;
          }, []));
      }
    } else if (pattern instanceof Component) {
      matchedComponents$ = components$
        ::map(components => {
          for (let i = 0 ; i < components.length ; i += 1) {
            const component = components[i];
            if (component === pattern) {
              return [component];
            }
          }

          return [];
        });
    } else if (pattern instanceof Observable) {
      matchedComponents$ = pattern;
      isReusedComponentStream = true;
    } else if (typeof pattern === 'function') {
      matchedComponents$ = components$::map(pattern);
    } else {
      console.error('Selector pattern should be a string, a React Component, a function or a selected component stream.');
      return;
    }

    if (!isReusedComponentStream) {
      matchedComponents$ = matchedComponents$::distinctUntilChanged((x, y) => {
        if (x.length !== y.length) {
          return false;
        }

        for (let i = 0 ; i < x.length ; i += 1) {
          if (y.indexOf(x[i]) === -1) {
            return false;
          }
        }

        return true;
      });

      if (isCacheable) {
        cache[pattern] = matchedComponents$;
      }
    }

    if (!type) {
      return matchedComponents$;
    }

    let stream$;

    const isStateSelector = type.charAt(type.length - 1) === '$';

    if (isStateSelector) {
      stream$ = matchedComponents$
        ::map(function componentsToStateStreams(components) {
          return components.map(component => {
            const state$ = component.state[type];

            if (!state$) {
              console.error(`State \`${type}\` not found in component => `, component);
              return;
            }

            return state$::map(state => {
              return { target: component, value: state };
            });
          });
        })
        ::mergeMap(stateStreams => Observable::merge(...stateStreams));
    } else { // event selector
      stream$ = event$
        ::withLatestFrom(matchedComponents$, function matchEvent(e, components) {
          for (let i = 0 ; i < components.length ; i += 1) {
            const component = components[i];
            const eventMatcher = component.event[type];
  
            if (!eventMatcher) {
              console.error(`Event \`${type}\` not found in component => `, component);
              return;
            }
  
            if (eventMatcher(e)) {
              return e;
            }
          }
  
          return null;
        })
        ::filter(e => e); // not null
    }

    return stream$;
  }
}
