import { BaseTrace } from '@app/classes/base-trace/base-trace';
import { Point } from '@app/classes/utils/point';

const DEFAULT_FEATHER_PEN_LINE_WIDTH = 2;
const RADIAN_CONVERSION_ANGLE = 180;
export const DEFAULT_FEATHER_PEN_WIDTH = 20;

export class Calligraphy extends BaseTrace {
    private currentPoint: Point;
    angle: number;
    color: string;
    width: number;

    constructor(width: number, angle: number, color: string) {
        super(width, color);
        this.angle = angle;
        this.color = color;
        this.width = width;
    }

    setContextAttribute(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.lineCap = 'round';
        ctx.lineWidth = DEFAULT_FEATHER_PEN_LINE_WIDTH;
    }

    private angleInRadians(): number {
        return (this.angle * Math.PI) / RADIAN_CONVERSION_ANGLE;
    }

    processDrawing(ctx: CanvasRenderingContext2D): void {
        this.setContextAttribute(ctx);

        const theta = this.angleInRadians();
        const upperX = this.currentPoint.x + (this.width / 2) * Math.cos(theta);
        const upperY = this.currentPoint.y + (this.width / 2) * Math.sin(theta);
        const bottomX = this.currentPoint.x - (this.width / 2) * Math.cos(theta);
        const bottomY = this.currentPoint.y - (this.width / 2) * Math.sin(theta);

        ctx.beginPath();
        ctx.moveTo(this.currentPoint.x, this.currentPoint.y);
        ctx.lineTo(upperX, upperY);
        ctx.lineTo(bottomX, bottomY);
        ctx.stroke();
    }

    setPoint(newPoint: Point): void {
        this.currentPoint = newPoint;
    }
}
