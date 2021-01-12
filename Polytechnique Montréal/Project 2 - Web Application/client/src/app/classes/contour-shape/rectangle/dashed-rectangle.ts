import { DASH_DISTANCE } from '@app/classes/base-shape/base-shape';
import { Rectangle } from './rectangle';

export class DashedRectangle extends Rectangle {
    segmentDash: number;

    constructor(width: number, strokeColor: string, fillColor: string, withBorder: boolean, withFill: boolean) {
        super(width, strokeColor, fillColor, withBorder, withFill);
        this.segmentDash = DASH_DISTANCE;
    }

    processDrawing(ctx: CanvasRenderingContext2D): void {
        ctx.setLineDash([this.segmentDash, this.segmentDash]);
        super.processDrawing(ctx);
    }
}
