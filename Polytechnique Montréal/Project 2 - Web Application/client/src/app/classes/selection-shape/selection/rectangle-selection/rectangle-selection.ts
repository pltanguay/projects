import { Matrix } from '@app/classes/matrix/matrix';
import { Selection } from '@app/classes/selection-shape/selection/selection';
import { Point } from '@app/classes/utils/point';

export class RectangleSelection extends Selection {
    constructor(selectionCanvas: HTMLCanvasElement, upperLeft: Point, matrix?: Matrix) {
        super(selectionCanvas, upperLeft, matrix);
    }

    protected processDrawing(ctx: CanvasRenderingContext2D): void {
        if (!this.pasted) this.drawVoid(ctx);
        if (this.deleted) return;

        ctx.setTransform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.e, this.matrix.f);

        ctx.drawImage(this.selectionCanvas, -this.selectionCanvas.width / 2, -this.selectionCanvas.height / 2);
    }

    drawVoid(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.fillRect(this.upperLeft.x, this.upperLeft.y, this.initialCanvasDimension.width, this.initialCanvasDimension.height);
    }
}
