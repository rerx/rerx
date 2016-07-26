import { BehaviorSubject } from 'rxjs/Rx';

export function injectRefStream(component, refStreamName = 'ref$') {
  const refs$ = new BehaviorSubject(component.refs);
  const emptyArray = [];
  const cache = {};

  component[refStreamName] = refs$;

  return new Proxy({}, {
    get(target, name) {
      if (name.charAt(name.length - 1) === '$') {
        const refName = name.substr(0, name.length - 1);
        const cachedStream = cache[refName];

        if (cachedStream) {
          return cachedStream;
        }

        const ref$ = refs$.map(refs => {
          const ref = refs[refName];
          if (ref) {
            return [ref];
          }

          return emptyArray;
        });

        cache[refName] = ref$;
        return ref$;
      }

      return function refHandler(ref) {
        const { refs } = component;
        refs[name] = ref;
        refs$.next(refs);
      }
    }
  });
}
