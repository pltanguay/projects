import { ContourShape } from '@app/classes/contour-shape/contour-shape';
import { ContourFit } from '@app/classes/interfaces/contour-fit';
import { Point } from '@app/classes/utils/point';

export interface Radius extends ContourFit {
    rx: number;
    ry: number;
}

export class Ellipse extends ContourShape {
    center: Point;
    radius: Radius;

    constructor(width: number, strokeColor: string, fillColor: string, withBorder: boolean, withFill: boolean) {
        super(width, strokeColor, fillColor, withBorder, withFill);
        this.radius = { rx: 0, ry: 0 };
    }

    protected canContourFit(): boolean {
        return this.radius.canContourFit || !this.withBorder;
    }

    protected drawFilledShape(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = 0;
        ctx.fillStyle = this.strokeColor;
        ctx.beginPath();
        ctx.ellipse(this.center.x, this.center.y, this.radius.rx, this.radius.ry, 0, 0, 2 * Math.PI);
        ctx.fill();
    }

    protected drawNormalShape(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.ellipse(this.center.x, this.center.y, this.radius.rx, this.radius.ry, 0, 0, 2 * Math.PI);
        ctx.stroke();
    }

    protected tryDrawInnerFill(ctx: CanvasRenderingContext2D): void {
        const border = this.withBorder ? this.width / 2 : 0;
        const innerFillRadius = { rx: this.radius.rx - border, ry: this.radius.ry - border };

        if (innerFillRadius.rx <= 0 || innerFillRadius.ry <= 0) return;

        ctx.beginPath();
        ctx.ellipse(this.center.x, this.center.y, innerFillRadius.rx, innerFillRadius.ry, 0, 0, 2 * Math.PI);
        ctx.fill();
    }
}
