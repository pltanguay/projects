import { ContourShape } from '@app/classes/contour-shape/contour-shape';
import { Dimension } from '@app/classes/interfaces/dimension';
import { Point } from '@app/classes/utils/point';

export class Rectangle extends ContourShape {
    dimension: Dimension;
    upperLeft: Point;

    constructor(width: number, strokeColor: string, fillColor: string, withBorder: boolean, withFill: boolean) {
        super(width, strokeColor, fillColor, withBorder, withFill);

        this.dimension = { width: 0, height: 0 };
    }

    protected canContourFit(): boolean {
        return this.dimension.canContourFit || !this.withBorder;
    }

    protected drawFilledShape(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = 0;
        ctx.fillStyle = this.strokeColor;
        ctx.beginPath();
        ctx.rect(this.upperLeft.x, this.upperLeft.y, this.dimension.width, this.dimension.height);
        ctx.fill();
    }

    protected drawNormalShape(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.strokeRect(this.upperLeft.x, this.upperLeft.y, this.dimension.width, this.dimension.height);
    }

    protected tryDrawInnerFill(ctx: CanvasRenderingContext2D): void {
        const innerRectFillDim: Dimension = { width: this.dimension.width - this.width, height: this.dimension.height - this.width };
        const innerRectFillLeftCorner: Point = new Point(this.upperLeft.x + this.width / 2, this.upperLeft.y + this.width / 2);

        if (innerRectFillDim.width <= 0 || innerRectFillDim.height <= 0) return;

        ctx.beginPath();
        ctx.rect(innerRectFillLeftCorner.x, innerRectFillLeftCorner.y, innerRectFillDim.width, innerRectFillDim.height);
        ctx.fill();
    }
}
