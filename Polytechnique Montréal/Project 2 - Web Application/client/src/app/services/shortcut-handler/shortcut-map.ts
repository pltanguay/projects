import { Callback, Shortcut } from './shortcut';

export class ShortcutMap {
    private map: Map<string, Callback>;

    constructor() {
        this.map = new Map();
    }

    get(sh: Shortcut): Callback | undefined {
        return this.map.get(sh.toString());
    }

    set(sh: Shortcut, cb: Callback): void {
        this.map.set(sh.toString(), cb);
    }
}
