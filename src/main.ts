import { of as _of } from 'rxjs/observable/of';

import { InputProvider, AcquireEngine } from './engine';
import { Acquire, AcquireConfig } from 'engine/store';

class MockInputSource implements InputProvider {
  getInput = function (type: string, state: Acquire) {
    if (type === 'config') {
      const config: AcquireConfig = {
        boardHeight: 4,
        boardWidth: 4,
        hotels: [{ name: 'Continental', prestige: 'expensive' }],
        initialCashPerPlayer: 5000,
        playersCount: 3, 
        stocksPerHotel: 24,
        unmergeableHotelSize: 11
      };
      return _of(config).toPromise();
    } else if (type === 'coordinatesCard') {
      return _of(0).toPromise();
    }
    return _of(<any>'mock input').toPromise();
  };
}

const engine = new AcquireEngine(new MockInputSource());

engine.go();
