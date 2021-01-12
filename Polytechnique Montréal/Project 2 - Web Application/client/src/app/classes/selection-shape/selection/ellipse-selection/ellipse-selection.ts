import { Matrix } from '@app/classes/matrix/matrix';
import { Selection } from '@app/classes/selection-shape/selection/selection';
import { Point } from '@app/classes/utils/point';

export class EllipseSelection extends Selection {
    center: Point;

    constructor(selectionCanvas: HTMLCanvasElement, upperLeft: Point, center: Point, matrix?: Matrix) {
        super(selectionCanvas, upperLeft, matrix);
        this.center = center;
    }

    protected processDrawing(ctx: CanvasRenderingContext2D): void {
        if (!this.pasted) this.drawVoid(ctx);
        if (this.deleted) return;

        ctx.beginPath();
        ctx.setTransform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.e, this.matrix.f);

        ctx.ellipse(0, 0, this.selectionCanvas.width / 2, this.selectionCanvas.height / 2, 0, 0, 2 * Math.PI);
        ctx.clip();

        ctx.drawImage(this.selectionCanvas, -this.selectionCanvas.width / 2, -this.selectionCanvas.height / 2);
    }

    drawVoid(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.ellipse(this.center.x, this.center.y, this.initialCanvasDimension.width / 2, this.initialCanvasDimension.height / 2, 0, 0, 2 * Math.PI);
        ctx.fill();
    }
}
