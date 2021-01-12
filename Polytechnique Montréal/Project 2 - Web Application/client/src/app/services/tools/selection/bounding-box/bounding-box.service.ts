import { Injectable } from '@angular/core';
import { Dimension } from '@app/classes/interfaces/dimension';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { Matrix } from '@app/classes/matrix/matrix';
import { Point } from '@app/classes/utils/point';

export interface State {
    points?: Vec2[];
    dimension: Dimension;
    center: Vec2;
}

@Injectable({
    providedIn: 'root',
})
export class BoundingBoxService {
    left: number;
    top: number;
    dimension: Dimension;
    borderPoints: Set<Vec2>;

    centerRotation: Vec2 | undefined;
    strokeResolution: number;

    constructor() {
        this.strokeResolution = 0;
    }

    applyTranslation(translation: Vec2): void {
        this.left += translation.x;
        this.top += translation.y;
    }

    applyMatrixOnBorderPoints(m: Matrix): void {
        this.updateDimension(m);
    }

    private updateDimension(m: Matrix): void {
        let point: Vec2;
        let left = 0xffffff;
        let right = -1;
        let top = 0xffffff;
        let bottom = -1;
        for (const borderPoint of this.borderPoints.values()) {
            point = this.applyTransformationOnPoint(borderPoint, m);
            if (point.x < left) {
                left = point.x;
            }
            if (point.x > right) {
                right = point.x;
            }
            if (point.y < top) {
                top = point.y;
            }
            if (point.y > bottom) {
                bottom = point.y;
            }
        }
        this.left = left;
        this.top = top;
        this.dimension.width = right - left;
        this.dimension.height = bottom - top;
    }

    private applyTransformationOnPoint(point: Vec2, m: Matrix): Vec2 {
        let point2D = new Matrix([[point.x], [point.y], [1]]);

        point2D = m.multiply(point2D);
        return { x: point2D.a, y: point2D.b };
    }

    get upperLeft(): Point {
        return new Point(this.left, this.top);
    }

    get center(): Point {
        return new Point(this.left + this.absDimension.width / 2, this.top + this.absDimension.height / 2);
    }

    get absDimension(): Dimension {
        return {
            width: Math.abs(this.dimension.width),
            height: Math.abs(this.dimension.height),
        };
    }

    get topLeft(): Point {
        return new Point(this.upperLeft.x, this.upperLeft.y);
    }
    get topCenter(): Point {
        return { x: this.center.x, y: this.center.y - this.absDimension.height / 2 };
    }
    get topRight(): Point {
        return { x: this.upperLeft.x + this.absDimension.width, y: this.upperLeft.y };
    }
    get centerLeft(): Point {
        return { x: this.center.x - this.absDimension.width / 2, y: this.center.y };
    }
    get centerRight(): Point {
        return { x: this.center.x + this.absDimension.width / 2, y: this.center.y };
    }
    get bottomLeft(): Point {
        return { x: this.center.x - this.absDimension.width / 2, y: this.center.y + this.absDimension.height / 2 };
    }
    get bottomCenter(): Point {
        return { x: this.center.x, y: this.center.y + this.absDimension.height / 2 };
    }
    get bottomRight(): Point {
        return { x: this.center.x + this.absDimension.width / 2, y: this.center.y + this.absDimension.height / 2 };
    }
}
