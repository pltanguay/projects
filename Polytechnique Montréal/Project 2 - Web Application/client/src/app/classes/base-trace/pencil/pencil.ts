import { BaseTrace } from '@app/classes/base-trace/base-trace';

export class Pencil extends BaseTrace {
    constructor(width: number, color: string) {
        super(width, color);
    }

    setContextAttribute(ctx: CanvasRenderingContext2D): void {
        super.setContextAttribute(ctx);
        ctx.fillStyle = this.color;
    }
}
