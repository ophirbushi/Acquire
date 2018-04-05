import { TurnPhase } from './turn-phase.interface';
import { ChooseCoordinateCardPhase } from './choose-coordinate-card-phase.model';

export const TurnPhaseDictionary: { [name: string]:  TurnPhase } = {
    'ChooseCoordinateCardPhase': ChooseCoordinateCardPhase
};
