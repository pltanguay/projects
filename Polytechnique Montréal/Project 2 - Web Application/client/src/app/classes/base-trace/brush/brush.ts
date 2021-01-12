import { BaseTrace } from '@app/classes/base-trace/base-trace';

export const SHADOW_20 = 20;
export const SHADOW_0 = 0;
export const FILTER_NONE = 'none';

export class Brush extends BaseTrace {
    private filter: string;

    constructor(width: number, color: string, filter: string) {
        super(width, color);
        this.filter = filter;
    }

    setContextAttribute(ctx: CanvasRenderingContext2D): void {
        super.setContextAttribute(ctx);
        ctx.filter = this.filter;
        if (this.filter === FILTER_NONE) {
            ctx.shadowBlur = SHADOW_20;
            ctx.shadowColor = this.color;
        } else {
            ctx.shadowBlur = SHADOW_0;
        }
    }
}
