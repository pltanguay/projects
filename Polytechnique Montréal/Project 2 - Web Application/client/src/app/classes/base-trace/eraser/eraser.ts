import { BaseTrace } from '@app/classes/base-trace/base-trace';
import { Path } from '@app/classes/paths/path';
import { Extrapolation } from '@app/classes/utils/extrapolation';
import { Point } from '@app/classes/utils/point';

export const ERASER_EXTRAPOLATION_RATIO = 4;

export class Eraser extends BaseTrace {
    constructor(width: number) {
        super(width, 'white');
    }

    processDrawing(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        const newPath = new Path(this.path.getLastPoints(2));
        const extrapolatedPath = Extrapolation.getExtrapolatedPath(newPath, this.width / ERASER_EXTRAPOLATION_RATIO);
        extrapolatedPath.forEach((point: Point) => {
            this.eraseSurface(ctx, point);
        });
    }

    processReDrawing(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;

        const extrapolatedPath = Extrapolation.getExtrapolatedPath(this.path, this.width / ERASER_EXTRAPOLATION_RATIO);
        extrapolatedPath.forEach((point: Point) => {
            this.eraseSurface(ctx, point);
        });
    }

    private eraseSurface(ctx: CanvasRenderingContext2D, point: Point): void {
        ctx.fillRect(point.x - this.width / 2, point.y - this.width / 2, this.width, this.width);
    }
}
