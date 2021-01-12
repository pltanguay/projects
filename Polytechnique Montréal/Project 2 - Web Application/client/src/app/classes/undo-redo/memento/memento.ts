export const enum MementoType {
    Initial = 'Initial',
    Draw = 'Draw',
    Resize = 'Resize',
}

export interface Memento {
    type: MementoType;
}
