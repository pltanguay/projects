import { Injectable } from '@angular/core';
import { Radius } from '@app/classes/contour-shape/ellipse/ellipse';
import { TRIANGLE } from '@app/classes/contour-shape/polygone/polygone';
import { Dimension } from '@app/classes/interfaces/dimension';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { Point } from '@app/classes/utils/point';

// tslint:disable:no-magic-numbers
export const MINIMAL_ALIGN = Math.PI / 8;
export const MAXIMAL_ALIGN = (3 * Math.PI) / 8;

@Injectable({
    providedIn: 'root',
})
export class MathUtilsService {
    getAlignedSegment(firstPoint: Vec2, oppositePoint: Vec2): Vec2 {
        const deltaX = oppositePoint.x - firstPoint.x;
        const deltaY = oppositePoint.y - firstPoint.y;
        const angle = Math.abs(Math.atan(deltaY / deltaX));

        if (angle < MINIMAL_ALIGN) {
            return new Point(oppositePoint.x, firstPoint.y);
        }
        if (angle > MAXIMAL_ALIGN) {
            return new Point(firstPoint.x, oppositePoint.y);
        }
        if (deltaY * deltaX > 0) {
            return new Point(oppositePoint.x, firstPoint.y + deltaX);
        }
        return new Point(oppositePoint.x, firstPoint.y - deltaX);
    }

    getCenterShape(startPoint: Vec2, oppositePoint: Vec2): Vec2 {
        const deltaX = oppositePoint.x - startPoint.x;
        const deltaY = oppositePoint.y - startPoint.y;
        return new Point(startPoint.x + deltaX / 2, startPoint.y + deltaY / 2);
    }

    getRadiusEllipse(startPoint: Vec2, oppositePoint: Vec2, strokeWidth: number = 0): Radius {
        const dim = this.getRectangleDimension(startPoint, oppositePoint);

        const diameterX = dim.width - strokeWidth;
        const diameterY = dim.height - strokeWidth;

        const isEllipseBiggerThanRectangle = diameterX < strokeWidth || diameterY < strokeWidth;
        if (isEllipseBiggerThanRectangle) {
            return {
                rx: dim.width / 2,
                ry: dim.height / 2,
                canContourFit: false,
            };
        }

        return {
            rx: Math.max(diameterX / 2, 0),
            ry: Math.max(diameterY / 2, 0),
            canContourFit: true,
        };
    }
    getRadiusPolygone(startPoint: Vec2, oppositePoint: Vec2, strokeWidth: number, numbersOfSides: number): Radius {
        const dim = this.getRectangleDimension(startPoint, oppositePoint);
        const minDim = Math.min(dim.width, dim.height);
        const radius = minDim - strokeWidth;

        const isPolygoneBiggerThanCercle = radius < strokeWidth;
        if (isPolygoneBiggerThanCercle) {
            return {
                rx: minDim / 2,
                ry: minDim / 2,
                canContourFit: false,
            };
        }
        if (numbersOfSides === TRIANGLE) {
            return {
                rx: Math.max(radius / 2, 0) - strokeWidth / 2,
                ry: Math.max(radius / 2, 0) - strokeWidth / 2,
                canContourFit: true,
            };
        } else {
            return {
                rx: Math.max(radius / 2, 0) - strokeWidth / Math.pow(numbersOfSides / 2.0, 2.0),
                ry: Math.max(radius / 2, 0) - strokeWidth / Math.pow(numbersOfSides / 2.0, 2.0),
                canContourFit: true,
            };
        }
    }
    getRectangleDimension(startPoint: Vec2, oppositePoint: Vec2, strokeWidth?: number): Dimension {
        const border = strokeWidth ? strokeWidth : 0;
        const deltaX = oppositePoint.x - startPoint.x;
        const deltaY = oppositePoint.y - startPoint.y;
        const dim: Dimension = {
            width: Math.max(Math.abs(deltaX) - border, 0),
            height: Math.max(Math.abs(deltaY) - border, 0),
            canContourFit: true,
        };

        if (dim.width === 0 || dim.height === 0) {
            return {
                width: Math.abs(deltaX),
                height: Math.abs(deltaY),
                canContourFit: false, // The case: when the border can not fit in the surface hehe
            };
        }
        return dim;
    }

    getRectangleUpperLeft(startPoint: Vec2, oppositePoint: Vec2, strokeWidth?: number): Vec2 {
        const border = strokeWidth ? strokeWidth / 2 : 0;
        const minX = Math.min(startPoint.x, oppositePoint.x) + border;
        const minY = Math.min(startPoint.y, oppositePoint.y) + border;

        return new Point(minX, minY);
    }

    transformRectangleToSquare(startPoint: Vec2, oppositePoint: Vec2): Vec2 {
        const deltaX = oppositePoint.x - startPoint.x;
        const deltaY = oppositePoint.y - startPoint.y;
        const minShift = Math.min(Math.abs(deltaX), Math.abs(deltaY));
        if (minShift === Math.abs(deltaX)) {
            return new Point(startPoint.x + deltaX, startPoint.y + minShift * Math.sign(deltaY));
        }

        return new Point(startPoint.x + minShift * Math.sign(deltaX), startPoint.y + deltaY);
    }
}
