import { Action } from '@app/classes/undo-redo/action/action';
import { Memento } from '@app/classes/undo-redo/memento/memento';

export type actionCallback = (memento: Memento) => void;

export class ConcreteAction implements Action {
    memento: Memento;
    callback: actionCallback;
    constructor(memento: Memento, callbackIn: actionCallback) {
        this.memento = memento;
        this.callback = callbackIn;
    }

    execute(): void {
        this.callback(this.memento);
    }
}
