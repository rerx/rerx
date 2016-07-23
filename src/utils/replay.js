import { publishReplay } from 'rxjs/operator/publishReplay';

export function replay(stream$) {
  return stream$
    ::publishReplay(1)
    .refCount();
}
