import { Memento, MementoType } from '@app/classes/undo-redo/memento/memento';
export interface Drawable {
    draw(ctx: CanvasRenderingContext2D): void;
    drawPreview(ctx: CanvasRenderingContext2D): void;
    redraw(ctx: CanvasRenderingContext2D): void;
}

export abstract class DrawableObject implements Drawable, Memento {
    readonly type: MementoType;

    constructor() {
        this.type = MementoType.Draw;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        this.processDrawing(ctx);
        ctx.restore();
    }
    drawPreview(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        this.processPreviewDrawing(ctx);
        ctx.restore();
    }
    redraw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        this.processReDrawing(ctx);
        ctx.restore();
    }

    protected abstract processDrawing(ctx: CanvasRenderingContext2D): void;

    protected processPreviewDrawing(ctx: CanvasRenderingContext2D): void {
        this.processDrawing(ctx);
    }
    protected processReDrawing(ctx: CanvasRenderingContext2D): void {
        this.processDrawing(ctx);
    }
}
