import { Injectable } from '@angular/core';
import { DashedEllipse } from '@app/classes/contour-shape/ellipse/dashed-ellipse';
import { DashedRectangle } from '@app/classes/contour-shape/rectangle/dashed-rectangle';
import { Drawable } from '@app/classes/drawable/drawable';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { DEFAULT_TOOL_WIDTH } from '@app/classes/tool/tool';
import { MathUtilsService } from '@app/services/mathematic/math-utils.service';
import { DASH_SEGMENT } from '@app/services/tools/contour-shape/contour-shape-abs';

@Injectable({
    providedIn: 'root',
})
export class DashedShapeService {
    constructor(private mathUtil: MathUtilsService) {}

    getDashedEllipse(startPoint: Vec2, oppositePoint: Vec2, isCercle: boolean, strokeColor: string = 'black'): Drawable {
        if (isCercle) {
            oppositePoint = this.mathUtil.transformRectangleToSquare(startPoint, oppositePoint);
        }

        const dashedEllipse = new DashedEllipse(DEFAULT_TOOL_WIDTH, '', strokeColor, false, false);
        dashedEllipse.segmentDash = DASH_SEGMENT;
        dashedEllipse.radius = this.mathUtil.getRadiusEllipse(startPoint, oppositePoint, 1);
        dashedEllipse.center = this.mathUtil.getCenterShape(startPoint, oppositePoint);

        return dashedEllipse;
    }

    getDashedRectangle(startPoint: Vec2, oppositePoint: Vec2, strokeColor: string = 'black'): Drawable {
        const dim = this.mathUtil.getRectangleDimension(startPoint, oppositePoint);
        const rectangleUpperLeft = this.mathUtil.getRectangleUpperLeft(startPoint, oppositePoint);

        const dashedRectangle = new DashedRectangle(DEFAULT_TOOL_WIDTH, strokeColor, '', false, false);
        dashedRectangle.segmentDash = DASH_SEGMENT;
        dashedRectangle.dimension = dim;
        dashedRectangle.upperLeft = rectangleUpperLeft;

        return dashedRectangle;
    }
}
