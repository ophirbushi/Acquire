import { PhaseName, AcquireConfig, GiveCoordinatesCardsToPlayerPayload, ChooseCoordinatesCardPayload } from './interfaces';

export interface AcquireActions {
    setPhaseName: PhaseName;
    loadConfig: AcquireConfig;
    init: null;
    giveCoordinatesCardsToPlayer: GiveCoordinatesCardsToPlayerPayload;
    chooseCoordinatesCard: ChooseCoordinatesCardPayload;
    endTurn: null;
    setCurrentPlayerIndex: number;
}
