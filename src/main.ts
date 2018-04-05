import { of as _of } from 'rxjs/observable/of';

import { InputProvider, AcquireEngine } from './engine';

class MockInputSource implements InputProvider {
  getInput = function <T>() {
    return _of<T>(<any>'mock input').toPromise();
  };
}

const engine = new AcquireEngine(new MockInputSource());

engine.go();

const a = 0;