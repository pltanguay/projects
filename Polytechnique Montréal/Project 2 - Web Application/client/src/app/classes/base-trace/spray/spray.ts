import { BaseTrace } from '@app/classes/base-trace/base-trace';

export class Spray extends BaseTrace {
    constructor(widthDroplet: number, color: string) {
        super(widthDroplet, color);
    }

    setContextAttribute(ctx: CanvasRenderingContext2D): void {
        super.setContextAttribute(ctx);
    }

    processDrawing(ctx: CanvasRenderingContext2D): void {
        this.setContextAttribute(ctx);
        ctx.beginPath();
        this.path.forEach((point) => {
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
    }
}
