import { Vec2 } from '@app/classes/interfaces/vec2';
import { Path } from '@app/classes/paths/path';
import { Point } from '@app/classes/utils/point';

export class Extrapolation {
    static getExtrapolatedPath(path: Path<Vec2>, minimalDistanceResolution: number): Path<Vec2> {
        if (path.length < 2) return path;

        const pointsExtrapolated: Path<Vec2> = new Path<Vec2>();

        path.forEach((point) => {
            if (point === path.getFirst()) {
                pointsExtrapolated.add(path.getFirst());
                return;
            }

            while (this.getDistance(pointsExtrapolated.getLast(), point) > minimalDistanceResolution) {
                const pointToAdd = this.getTranslatedPointWith(pointsExtrapolated.getLast(), point, minimalDistanceResolution);
                pointsExtrapolated.add(pointToAdd);
            }

            pointsExtrapolated.add(point);
        });

        return pointsExtrapolated;
    }

    static getNormalizedDeltaVector(firstPoint: Vec2, secondPoint: Vec2): Vec2 {
        const distance = this.getDistance(firstPoint, secondPoint);
        const deltaX = secondPoint.x - firstPoint.x;
        const deltaY = secondPoint.y - firstPoint.y;
        return {
            x: deltaX / distance,
            y: deltaY / distance,
        };
    }
    private static getTranslatedPointWith(startPoint: Point, endPoint: Point, distanceResolution: number): Vec2 {
        const normalVect = this.getNormalizedDeltaVector(startPoint, endPoint);
        const point: Vec2 = {
            x: startPoint.x + normalVect.x * distanceResolution,
            y: startPoint.y + normalVect.y * distanceResolution,
        };
        return point;
    }
    private static getDistance(firstPoint: Vec2, secondPoint: Vec2): number {
        const deltaX = firstPoint.x - secondPoint.x;
        const deltaY = firstPoint.y - secondPoint.y;
        return Math.sqrt(deltaX ** 2 + deltaY ** 2);
    }
}
