import * as path from 'path';
import * as fs from 'fs';
import { Observable, Subscription } from 'rxjs';
import { State, StateA, StateContext } from './models';

export class DummyGameEngine implements StateContext {
    currentState: State;

    private counter = 0;
    private inputListener: Subscription;

    run() {
        this.setState(new StateA(this));
    }

    setState(state: State) {
        this.currentState = state;
        console.log(state.name);
        this.saveState();
        this.inputListener = this.getInput().subscribe(
            input => this.onInputReceived(input),
            err => this.onError(err)
        );
    }

    private onInputReceived(input: string) {
        this.currentState.handleInput(input);
    }
    
    private onError(error) {
        if (error) {
            console.error(error);
        }
    }

    // todo: move to service
    private saveState() {
        let tmpDir = './temp',
            fileName = 'test.txt';

        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir);
        }

        fs.writeFileSync(path.join(tmpDir, fileName), JSON.stringify(this.currentState.name));
    }

    // todo: move to service
    private getInput(): Observable<string> {
        this.counter++;
        return Observable.interval(800)
            .map(() => {
                if (this.counter % 4 === 0) {
                    return 'skip to state c';
                }
                if (this.counter % 7 === 0) {
                    return 'back to state a';
                }
                if (this.counter % 11 === 0) {
                    return 'back to state b';
                }
                return this.counter.toString();
            }).take(1);
    }
}
