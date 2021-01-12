import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { Point } from '@app/classes/utils/point';
import { GridService } from '@app/services/tools/grid-service/grid.service';
import { BoundingBoxService } from '@app/services/tools/selection/bounding-box/bounding-box.service';

export enum SnapDirection {
    TopLeft = 'TopLeft',
    TopCenter = 'TopCenter',
    TopRight = 'TopRight',
    CenterLeft = 'CenterLeft',
    Center = 'Center',
    CenterRight = 'CenterRight',
    BottomLeft = 'BottomLeft',
    BottomCenter = 'BottomCenter',
    BottomRight = 'BottomRight',
}

export type SnapPoint = () => Point;
@Injectable({
    providedIn: 'root',
})
export class SnapToGridService {
    active: boolean;
    snapDirection: SnapDirection;
    snappingPoints: Map<SnapDirection, SnapPoint>;
    snapIndicator: number;

    constructor(private gridService: GridService, public boundingBox: BoundingBoxService) {
        this.active = false;
        this.snapDirection = SnapDirection.TopLeft;
        this.snappingPoints = new Map();
        this.addSnappingPoints();
    }

    getNearestPointTranslation(point: Vec2, translation: Vec2): Vec2 {
        point = { x: point.x + translation.x, y: point.y + translation.y };
        const candidates = [];
        const s = this.gridService.squareSize;
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                const pointToAdd = new Point(point.x - (point.x % s) + i * s, point.y - (point.y % s) + j * s);
                candidates.push(pointToAdd);
            }
        }
        const nearPoint = candidates.sort((a, b) => this.distance(a, point) - this.distance(b, point))[0];
        translation = { x: translation.x + nearPoint.x - point.x, y: translation.y + nearPoint.y - point.y };
        return translation;
    }

    getArrowTranslationPoint(translationDelta: Vec2, translation: Vec2): Vec2 {
        if (
            (!translation.x && !translation.y) ||
            (!this.isSameSign(translation.x, translationDelta.x) && !this.isSameSign(translation.y, translationDelta.y))
        ) {
            return {
                x: translation.x + this.gridService.squareSize * Math.sign(translationDelta.x),
                y: translation.y + this.gridService.squareSize * Math.sign(translationDelta.y),
            };
        }

        return translation;
    }

    toggle(): void {
        this.active = !this.active;
    }

    get snapPoint(): Point {
        const point = this.snappingPoints.get(this.snapDirection) as SnapPoint;
        return point();
    }

    private distance(a: Point, b: Point): number {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }

    private isSameSign(x: number, y: number): boolean {
        return Math.sign(x) === Math.sign(y);
    }

    private addSnappingPoints(): void {
        this.snappingPoints.set(SnapDirection.TopLeft, () => {
            return this.boundingBox.topLeft;
        });
        this.snappingPoints.set(SnapDirection.TopCenter, () => {
            return this.boundingBox.topCenter;
        });
        this.snappingPoints.set(SnapDirection.TopRight, () => {
            return this.boundingBox.topRight;
        });
        this.snappingPoints.set(SnapDirection.CenterLeft, () => {
            return this.boundingBox.centerLeft;
        });
        this.snappingPoints.set(SnapDirection.Center, () => {
            return this.boundingBox.center;
        });
        this.snappingPoints.set(SnapDirection.CenterRight, () => {
            return this.boundingBox.centerRight;
        });
        this.snappingPoints.set(SnapDirection.BottomLeft, () => {
            return this.boundingBox.bottomLeft;
        });
        this.snappingPoints.set(SnapDirection.BottomCenter, () => {
            return this.boundingBox.bottomCenter;
        });
        this.snappingPoints.set(SnapDirection.BottomRight, () => {
            return this.boundingBox.bottomRight;
        });
    }
}
