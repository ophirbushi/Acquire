import { Observable } from 'rxjs';

import { GameEngine, InputSource, TurnPhase } from './game-engine';

class MockInputSource implements InputSource {
  getInput(TurnPhase: TurnPhase): Observable<any> {
    return Observable.of('mock input');
  };
}
debugger;
var engine = new GameEngine(new MockInputSource());

engine.newGame([]);
