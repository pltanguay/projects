export type Callback = () => void;

export class Shortcut {
    key: string;
    ctrl: boolean;
    shift: boolean;
    constructor(key: string, ctrl: boolean = false, shift: boolean = false) {
        this.key = key;
        this.ctrl = ctrl;
        this.shift = shift;
    }

    toString(): string {
        return `${this.ctrl ? 'Ctrl' : ''}${this.shift ? 'Shift' : ''}${this.key.toLowerCase()}`;
    }
}
