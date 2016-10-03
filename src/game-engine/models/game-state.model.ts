import { Player, Bank, Board } from 'models';
import { TurnPhase } from './turn-phase.model';

export class GameState {
    constructor(
        public bank: Bank,
        public players: Player[],
        public currentPlayerIndex: number,
        public board: Board,
        public turnPhase: TurnPhase
    ) { }
}
