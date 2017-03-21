import * as equal from 'deep-equal';
import { Observable } from 'rxjs/Observable';
import { CoordinatesCard, BoardService } from 'core';
import { GameState, TurnOutcome } from '../models';
import { TurnPhase } from './turn-phase.interface';
import { TurnPhaseContext } from './turn-phase-context.interface';
import { GameStateService } from '../game-state.service';

export class ChooseCoordinateCardPhase implements TurnPhase {
    handleInput(turnPhaseContext: TurnPhaseContext, chosenCardIndex: number,
        boardService: BoardService, gameStateService: GameStateService): void {
        const snapshot = gameStateService.gameStateSnapshot;
        const currentPlayer = snapshot.players[snapshot.currentPlayerIndex];
        const chosenCard = currentPlayer.coordinatesCards[chosenCardIndex];
        const coordinatesCardEffect = boardService.getCoordinatesCardEffect(snapshot.board, chosenCard.coordinates);

        

        turnPhaseContext.setPhase('choose-coordinate-card');
    }
}
