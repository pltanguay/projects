import { DrawableObject } from '@app/classes/drawable/drawable';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { Path } from '@app/classes/paths/path';
import { Point } from '@app/classes/utils/point';

export const ANTIALIASING_CORRECTION = 0.5;

export abstract class BaseTrace extends DrawableObject {
    path: Path<Point>;
    protected width: number;
    protected color: string;

    constructor(width: number, color: string) {
        super();
        this.path = new Path<Point>();
        this.width = width + ANTIALIASING_CORRECTION;
        this.color = color;
    }

    processDrawing(ctx: CanvasRenderingContext2D): void {
        this.setContextAttribute(ctx);
        ctx.beginPath();
        this.path.forEach((point) => {
            ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
    }

    setContextAttribute(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.color;
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.lineWidth = this.width;
    }

    addPoint(point: Vec2): void {
        this.path.add(point);
    }
}
