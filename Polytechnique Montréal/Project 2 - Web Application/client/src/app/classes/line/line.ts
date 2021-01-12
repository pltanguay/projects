import { DrawableObject } from '@app/classes/drawable/drawable';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { Path } from '@app/classes/paths/path';
import { Point } from '@app/classes/utils/point';

export const MAXIMUM_DISTANCE_LOOP = 20;
export class Line extends DrawableObject {
    private path: Path<Point>;
    private previewVertex: Point;
    private width: number;
    private withJunctions: boolean;
    private radius: number;
    private color: string;

    constructor(width: number, withJunctions: boolean, radius: number, color: string) {
        super();
        this.path = new Path<Point>();
        this.width = width;
        this.withJunctions = withJunctions;
        this.radius = radius;
        this.color = color;
    }

    processDrawing(ctx: CanvasRenderingContext2D): void {
        this.drawLine(ctx, false);
    }

    processPreviewDrawing(ctx: CanvasRenderingContext2D): void {
        this.drawLine(ctx, true);
    }

    private drawLine(ctx: CanvasRenderingContext2D, isPreviewLine: boolean): void {
        this.setContextAttribute(ctx);
        const path = new Path2D();
        if (!isPreviewLine) this.tryAddLoop();
        this.path.forEach((point) => {
            path.lineTo(point.x, point.y);

            if (this.withJunctions) {
                const junctionPath = this.getJunctionForm(point, this.radius);
                ctx.fill(junctionPath);
                path.addPath(junctionPath);
                path.moveTo(point.x, point.y);
            }
        });

        if (isPreviewLine) {
            path.lineTo(this.previewVertex.x, this.previewVertex.y);
        }
        ctx.stroke(path);
    }

    private setContextAttribute(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
    }

    removeLastVertex(): void {
        if (this.path.length === 1) return;
        this.path.removeLast();
    }

    getLastVertex(): Vec2 {
        return this.path.getLast();
    }

    addSegment(point: Vec2): void {
        this.path.add(point);
    }

    addPreviewSegment(point: Vec2): void {
        this.previewVertex = point;
    }

    removeSegments(): void {
        this.path.clear();
    }

    isStarted(): boolean {
        return !this.path.isEmpty();
    }

    private tryAddLoop(): void {
        if (this.path.length < 2) return;

        const firstPoint = this.path.getFirst();
        const lastPoint = this.path.getLast();
        if (this.canAddLoop(firstPoint, lastPoint)) {
            this.path.removeLast();
            this.path.add(firstPoint);
        }
    }

    private canAddLoop(firstPoint: Point, lastPoint: Point): boolean {
        const deltaX = lastPoint.x - firstPoint.x;
        const deltaY = lastPoint.y - firstPoint.y;
        return Math.abs(deltaX) <= MAXIMUM_DISTANCE_LOOP && Math.abs(deltaY) <= MAXIMUM_DISTANCE_LOOP;
    }

    private getJunctionForm(point: Point, radius: number): Path2D {
        const path = new Path2D();
        path.arc(point.x, point.y, radius, 0, 2 * Math.PI, true);
        return path;
    }
}
