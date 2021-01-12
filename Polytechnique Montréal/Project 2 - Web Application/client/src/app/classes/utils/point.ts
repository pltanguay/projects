import { Vec2 } from '@app/classes/interfaces/vec2';

export class Point implements Vec2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
