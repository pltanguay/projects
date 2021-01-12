import { DrawableObject } from '@app/classes/drawable/drawable';
import { Point } from '@app/classes/utils/point';

const DEGREE_180 = 180;

export class Stamp extends DrawableObject {
    angle: number;
    drawnCanvas: HTMLCanvasElement;
    drawPosition: Point;

    constructor(bufferCanvas: HTMLCanvasElement, angle: number, drawPosition: Point) {
        super();
        this.angle = angle;
        this.drawnCanvas = bufferCanvas;
        this.drawPosition = drawPosition;
    }

    processDrawing(ctx: CanvasRenderingContext2D): void {
        ctx.setTransform(1, 0, 0, 1, this.drawPosition.x, this.drawPosition.y);
        ctx.rotate((this.angle * Math.PI) / DEGREE_180);
        ctx.drawImage(this.drawnCanvas, -this.drawnCanvas.width / 2, -this.drawnCanvas.height / 2);
        ctx.setTransform();
    }
}
