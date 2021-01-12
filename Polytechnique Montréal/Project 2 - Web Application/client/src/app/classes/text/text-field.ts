import { DrawableObject } from '@app/classes/drawable/drawable';
import { MementoType } from '@app/classes/undo-redo/memento/memento';
import { Point } from '@app/classes/utils/point';

export interface TextAttribute {
    color: string;
    size: number;
    police: string;
    isBold: boolean;
    align: CanvasTextAlign;
    isItalic: boolean;
}

export class TextField extends DrawableObject {
    readonly type: MementoType;

    text: string[];
    startPoint: Point;

    attribute: TextAttribute;

    alignFactor: number;
    width: number;

    constructor(startPoint: Point, attribute: TextAttribute) {
        super();
        this.type = MementoType.Draw;

        this.text = new Array();
        this.text[0] = '';
        this.startPoint = startPoint;

        this.attribute = attribute;

        this.alignFactor = 0;
    }

    processDrawing(ctx: CanvasRenderingContext2D): void {
        this.setContext(ctx);
        this.setProperty(ctx);
        for (let i = 0; i < this.text.length; i++) {
            ctx.fillText(this.text[i], this.startPoint.x + this.alignFactor, this.startPoint.y + i * this.attribute.size);
        }
    }

    getWidth(ctx: CanvasRenderingContext2D): number {
        this.setContext(ctx);
        this.width = 0;
        for (const line of this.text) {
            const lineWidth = ctx.measureText(line).width;
            if (this.width < lineWidth) this.width = lineWidth;
        }
        return this.width;
    }

    getHeight(): number {
        return this.text.length * this.attribute.size;
    }

    setProperty(ctx: CanvasRenderingContext2D): void {
        this.getWidth(ctx);

        switch (this.attribute.align) {
            case 'left':
                this.alignFactor = 0;
                break;
            case 'center':
                this.alignFactor = this.width / 2;
                break;
            case 'right':
                this.alignFactor = this.width;
                break;
        }
    }

    private setContext(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.attribute.color;
        ctx.textAlign = this.attribute.align;
        ctx.font = this.fontConstructor();
    }

    private fontConstructor(): string {
        let font = '';
        if (this.attribute.isItalic) font += 'italic ';
        if (this.attribute.isBold) font += 'bold ';
        font += this.attribute.size + 'px ';
        font += this.attribute.police;
        return font;
    }
}
