import { ContourShape } from '@app/classes/contour-shape/contour-shape';
import { ContourFit } from '@app/classes/interfaces/contour-fit';
import { Point } from '@app/classes/utils/point';

export const TRIANGLE = 3;
const TRIANGLE_INNERFILL_FACTOR = 1.7;
const OTHER_INNERFILL_FACTOR = 2.3;

export interface Radius extends ContourFit {
    r: number;
}

export class Polygone extends ContourShape {
    center: Point;
    radius: Radius;
    numberOfSides: number;
    yAxisSign: number;

    constructor(width: number, fillColor: string, strokeColor: string, withBorder: boolean, withFill: boolean, numberOfSides: number) {
        super(width, fillColor, strokeColor, withBorder, withFill);
        this.radius = { r: 0 };
        this.numberOfSides = numberOfSides;
        this.yAxisSign = 1;
    }

    protected canContourFit(): boolean {
        return this.radius.canContourFit || !this.withBorder;
    }

    protected drawFilledShape(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = 0;
        ctx.fillStyle = this.strokeColor;

        ctx.beginPath();
        for (let i = 0; i <= this.numberOfSides + 1; i += 1) {
            const nextPoint = this.calculateNextPoint(i, this.radius.r);
            ctx.lineTo(nextPoint.x, nextPoint.y);
        }
        ctx.fill();
    }

    protected drawNormalShape(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        for (let i = 0; i <= this.numberOfSides + 1; i += 1) {
            const nextPoint = this.calculateNextPoint(i, this.radius.r);
            ctx.lineTo(nextPoint.x, nextPoint.y);
        }
        ctx.stroke();
    }

    protected tryDrawInnerFill(ctx: CanvasRenderingContext2D): void {
        const border = this.withBorder ? this.width / 2 : 0;
        let innerFillRadius = this.radius.r - border;
        if (this.numberOfSides === TRIANGLE) innerFillRadius -= this.width / Math.pow(this.numberOfSides / 2.0, TRIANGLE_INNERFILL_FACTOR);
        else innerFillRadius -= this.width / Math.pow(this.numberOfSides / 2.0, OTHER_INNERFILL_FACTOR);

        if (innerFillRadius <= 0) return;

        ctx.beginPath();

        for (let i = 0; i <= this.numberOfSides + 1; i += 1) {
            const nextPoint = this.calculateNextPoint(i, innerFillRadius);
            ctx.lineTo(nextPoint.x, nextPoint.y);
        }
        ctx.fill();
    }

    private calculateNextPoint(indexVertex: number, radius: number): Point {
        const x = this.center.x + radius * Math.sin((indexVertex * 2 * Math.PI) / this.numberOfSides);
        const y = this.center.y + radius * this.yAxisSign * Math.cos((indexVertex * 2 * Math.PI) / this.numberOfSides);
        return new Point(x, y);
    }
}
