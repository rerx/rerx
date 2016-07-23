import { Subject } from 'rxjs/Subject';
import { publish } from 'rxjs/operator/publish';
import { startWith } from 'rxjs/operator/startWith';
import { scan } from 'rxjs/operator/scan';
import { publishReplay } from 'rxjs/operator/publishReplay';
import { createSelect } from './createSelect';
import { isBrowser } from '../utils/isBrowser';
import { noop } from '../utils/noop';

function createComponentStream(mountEvent) {
  const components$ = mountEvent
    ::startWith([])
    ::scan(function handleMountEvent(components, e) {
      const newComponents = [].concat(components);

      if (e.mount) {
        newComponents.push(e.component);
      } else {
        newComponents.splice(newComponents.indexOf(e.component), 1);
      }

      return newComponents;
    })
    ::publishReplay(1);

  components$.connect();
  return components$;
}

export function createCore() {
  const event = new Subject();
  const event$ = event::publish();
  const mountEvent = new Subject();
  const components$ = createComponentStream(mountEvent);
  const select = isBrowser ? createSelect(components$, event$) : noop;

  return {
    event$,
    components$,
    willMount: component => {
      mountEvent.next({
        component,
        mount: true
      });
    },
    willUnmount: component => {
      mountEvent.next({
        component,
        mount: false
      });
    },
    select,
    dispatch: event.next.bind(event)
  }
}
