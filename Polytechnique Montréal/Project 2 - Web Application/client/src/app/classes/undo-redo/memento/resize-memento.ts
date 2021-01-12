import { Memento, MementoType } from './memento';

export class ResizeMemento implements Memento {
    readonly type: MementoType;
    width: number;
    height: number;
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.type = MementoType.Resize;
    }
}
