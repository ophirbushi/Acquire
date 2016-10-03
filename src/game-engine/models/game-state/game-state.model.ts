import { Player, Bank, Board } from 'models';
import { TurnOutcome } from '../turn-outcome';
import { TurnPhase } from '../turn-phases';

export class GameState {
    constructor(
        public bank: Bank,
        public players: Player[],
        public currentPlayer: Player,
        public board: Board,
        public turnPhase: TurnPhase<any>,
        public turnOutcome: TurnOutcome
    ) { }
}
