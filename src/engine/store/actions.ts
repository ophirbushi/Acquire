import { PhaseName, AcquireConfig, GiveCoordinatesCardsToPlayerPayload } from './interfaces';

export interface AcquireActions {
    setPhaseName: PhaseName;
    loadConfig: AcquireConfig;
    init: null;
    giveCoordinatesCardsToPlayer: GiveCoordinatesCardsToPlayerPayload;
    endTurn: null;
    setCurrentPlayerIndex: number;
}
