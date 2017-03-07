import { Player, Bank, Board, BoardService } from 'core';
import { InputSource } from './input-source';
import { Provider } from './provider.interface';
import { TurnPhase, TurnPhaseContext, ChooseCoordinateCardPhase, TurnPhaseDictionary } from './turn-phase';
import { GameState, TurnOutcome } from './models';

export class GameEngine implements TurnPhaseContext {
    constructor(private inputSource: InputSource, private provider: Provider) { }


    setPhase = (turnPhase: TurnPhase): void => {
        this.inputSource.getInput(turnPhase)
            .subscribe(input => turnPhase.handleInput(this, input), (error) => {  /** todo: handle error */ });
    }
}
