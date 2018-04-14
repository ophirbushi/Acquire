import { Acquire, AcquireActions } from '../store';
import { InputProvider } from '../input-provider';
import { StateService } from '../state.service';

export type Phase = (stateService: StateService, inputProvider: InputProvider, done: () => void) => void;
