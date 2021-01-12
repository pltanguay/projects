import { DrawableObject } from '@app/classes/drawable/drawable';

export const DASH_DISTANCE = 5;

export abstract class BaseShape extends DrawableObject {
    strokeColor: string;
    width: number;

    constructor(width: number, strokeColor: string) {
        super();
        this.width = width;
        this.strokeColor = strokeColor;
    }

    protected abstract drawNormalShape(ctx: CanvasRenderingContext2D): void;

    protected processDrawing(ctx: CanvasRenderingContext2D): void {
        this.setCanvasSettings(ctx);
        this.drawNormalShape(ctx);
    }

    protected setCanvasSettings(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.strokeColor;
    }
}
