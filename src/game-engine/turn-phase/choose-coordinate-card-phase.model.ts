import * as equal from 'deep-equal';
import { Observable } from 'rxjs';
import { CoordinatesCard, BoardService } from 'core';
import { GameState, TurnOutcome } from '../models';
import { Provider } from '../provider.interface';
import { TurnPhase } from './turn-phase.interface';
import { TurnPhaseContext } from './turn-phase-context.interface';
import { GameStateService } from '../game-state.service';

export class ChooseCoordinateCardPhase implements TurnPhase {
    constructor(private provider: Provider, private boardService: BoardService, private gameStateService: GameStateService) { }

    handleInput(turnPhaseContext: TurnPhaseContext, coordinatesCard: CoordinatesCard) {
        this.gameStateService.updateGameState((gameState) => {
            gameState.bank.cash += 2;
        });
        const snapshot = this.gameStateService.gameStateSnapshot;
        const coordinatesCardEffect = this.boardService.getCoordinatesCardEffect(snapshot.board, coordinatesCard.coordinates);
        turnPhaseContext.setPhase(this.provider.provide(ChooseCoordinateCardPhase));

        //  let coordinatesCardIndex = this.gameState.currentPlayer.coordinatesCards.findIndex(coordinatesCard => equal(coordinatesCard, input));
    }
}
