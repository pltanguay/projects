import { BaseTrace } from '@app/classes/base-trace/base-trace';
import { Path } from '@app/classes/paths/path';
import { Extrapolation } from '@app/classes/utils/extrapolation';
import { Point } from '@app/classes/utils/point';
import { Calligraphy } from './calligraphy/calligraphy';

const MIN_RESOLUTION = 1;

export class FeatherPen extends BaseTrace {
    angle: number;
    path: Path<Point>;
    private calligraphy: Calligraphy;

    constructor(width: number, angle: number, color: string) {
        super(width, color);
        this.angle = angle;
        this.calligraphy = new Calligraphy(this.width, this.angle, this.color);
    }

    setContextAttribute(ctx: CanvasRenderingContext2D): void {
        this.calligraphy.setContextAttribute(ctx);
    }

    processDrawing(ctx: CanvasRenderingContext2D): void {
        const newPath = new Path(this.path.getLastPoints(2));
        const extrapolatedPath = Extrapolation.getExtrapolatedPath(newPath, MIN_RESOLUTION);
        extrapolatedPath.forEach((point: Point) => {
            this.drawCalligraphy(point, ctx);
        });
    }

    processReDrawing(ctx: CanvasRenderingContext2D): void {
        const extrapolatedPath = Extrapolation.getExtrapolatedPath(this.path, MIN_RESOLUTION);
        extrapolatedPath.forEach((point: Point) => {
            this.drawCalligraphy(point, ctx);
        });
    }

    private drawCalligraphy(point: Point, ctx: CanvasRenderingContext2D): void {
        this.calligraphy.angle = this.angle;
        this.calligraphy.setPoint(point);
        this.calligraphy.processDrawing(ctx);
    }
}
