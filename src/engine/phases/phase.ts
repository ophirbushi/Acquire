import { Store } from 'roxanne';
import { Acquire, AcquireActions } from '../store';
import { InputProvider } from '../input-provider';

export type Phase = (store: Store<Acquire, AcquireActions>, inputProvider: InputProvider, done: () => void) => void;
