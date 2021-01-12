import { DASH_DISTANCE } from '@app/classes/base-shape/base-shape';
import { Point } from '@app/classes/utils/point';
import { MathUtilsService } from '@app/services/mathematic/math-utils.service';
import { Ellipse, Radius } from './ellipse';

export class DashedEllipse extends Ellipse {
    center: Point;
    radius: Radius;
    segmentDash: number;
    mathService: MathUtilsService;

    constructor(width: number, strokeColor: string, fillColor: string, withBorder: boolean, withFill: boolean) {
        super(width, strokeColor, fillColor, withBorder, withFill);
        this.segmentDash = DASH_DISTANCE;
    }

    protected drawNormalShape(ctx: CanvasRenderingContext2D): void {
        ctx.setLineDash([this.segmentDash, this.segmentDash]);
        ctx.beginPath();
        ctx.ellipse(this.center.x, this.center.y, this.radius.rx, this.radius.ry, 0, 0, 2 * Math.PI);
        ctx.stroke();
    }
}
