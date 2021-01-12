import { BaseShape } from '@app/classes/base-shape/base-shape';
import { DEFAULT_TOOL_WIDTH } from '@app/classes/tool/tool';

export abstract class ContourShape extends BaseShape {
    protected fillColor: string;
    protected withBorder: boolean;
    protected withFill: boolean;

    constructor(width: number, strokeColor: string, fillColor: string, withBorder: boolean, withFill: boolean) {
        super(width, strokeColor);
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.withBorder = withBorder;
        this.width = this.withBorder ? width : 0;
        this.withFill = withFill;
    }

    protected processDrawing(ctx: CanvasRenderingContext2D): void {
        if (!this.canContourFit()) {
            this.drawFilledShape(ctx);
            return;
        }

        this.setCanvasSettings(ctx);

        this.drawNormalShape(ctx);

        if (!this.withFill) return;

        this.tryDrawInnerFill(ctx);
    }

    protected abstract canContourFit(): boolean;
    protected abstract drawFilledShape(ctx: CanvasRenderingContext2D): void;
    protected abstract drawNormalShape(ctx: CanvasRenderingContext2D): void;
    protected abstract tryDrawInnerFill(ctx: CanvasRenderingContext2D): void;

    protected setCanvasSettings(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.fillColor;

        if (this.withBorder) {
            ctx.lineWidth = this.width;
            ctx.strokeStyle = this.strokeColor;
            return;
        }

        ctx.strokeStyle = this.fillColor;
        ctx.lineWidth = DEFAULT_TOOL_WIDTH;
    }
}
