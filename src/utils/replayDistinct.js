import { distinctUntilChanged } from 'rxjs/operator/distinctUntilChanged';
import { publishReplay } from 'rxjs/operator/publishReplay';

export function replayDistinct(stream$) {
  return stream$
    ::distinctUntilChanged()
    ::publishReplay(1)
    .refCount();
}
