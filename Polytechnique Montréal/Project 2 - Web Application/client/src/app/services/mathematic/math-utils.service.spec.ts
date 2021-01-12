import { TestBed } from '@angular/core/testing';
import { Point } from '@app/classes/utils/point';
import { MathUtilsService } from './math-utils.service';

describe('MathUtilsService', () => {
    let service: MathUtilsService;
    let coord: number;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MathUtilsService);
        // tslint:disable-next-line: no-magic-numbers
        coord = 4;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getAlignedSegment should return' + 'oppositePoint.x and firstPoint.y', () => {
        // Arrange
        const firstPoint = new Point(0, 0);
        const oppositePoint = new Point(coord + 1, 1);

        // Act
        const result = service.getAlignedSegment(firstPoint, oppositePoint);

        // Assert
        expect(result).toEqual(new Point(oppositePoint.x, firstPoint.y));
    });

    it('getAlignedSegment should return firstPoint.x and oppositePoint.y', () => {
        // Arrange
        const firstPoint = new Point(0, 0);
        const oppositePoint = new Point(1, coord + 1);

        // Act
        const result = service.getAlignedSegment(firstPoint, oppositePoint);

        // Assert
        expect(result).toEqual(new Point(firstPoint.x, oppositePoint.y));
    });

    it('getAlignedSegment should return oppositePoint.x and firstPoint.y + deltaX', () => {
        // Arrange
        const firstPoint = new Point(0, 0);
        const oppositePoint = new Point(coord, coord + 1);
        const deltaX = oppositePoint.x - firstPoint.x;

        // Act
        const result = service.getAlignedSegment(firstPoint, oppositePoint);

        // Assert
        expect(result).toEqual(new Point(oppositePoint.x, firstPoint.y + deltaX));
    });

    it('getAlignedSegment should return oppositePoint.x and firstPoint.y - deltaX', () => {
        // Arrange
        const firstPoint = new Point(0, 0);
        const oppositePoint = new Point(-coord, coord + 1);
        const deltaX = oppositePoint.x - firstPoint.x;

        // Act
        const result = service.getAlignedSegment(firstPoint, oppositePoint);
        // Assert
        expect(result).toEqual(new Point(oppositePoint.x, firstPoint.y - deltaX));
    });

    it('getCenterShape should correct center of ellipse', () => {
        // Arrange
        const firstPoint = new Point(0, 0);
        const oppositePoint = new Point(2, 2);

        // Act
        const result = service.getCenterShape(firstPoint, oppositePoint);

        // Assert
        expect(result).toEqual(new Point(1, 1));
    });

    it('getRadiusEllipse should return radius with default algorithm of when the border bigger than rectangle', () => {
        // Arrange
        const firstPoint = new Point(0, 0);
        const oppositePoint = new Point(2, 2);
        const strokeWidth = 2;

        // Act
        const result = service.getRadiusEllipse(firstPoint, oppositePoint, strokeWidth);

        // Assert
        expect(result).toEqual({ rx: 1, ry: 1, canContourFit: false });
    });

    it('getRadiusEllipse should return correct radius when the border can fit in rectangle', () => {
        // Arrange
        const firstPoint = new Point(0, 0);
        const oppositePoint = new Point(2, 2);
        const strokeWidth = 1;

        // Act
        const result = service.getRadiusEllipse(firstPoint, oppositePoint, strokeWidth);

        // Assert
        expect(result).toEqual({ rx: 1 / 2, ry: 1 / 2, canContourFit: true });
    });

    it('getRadiusEllipse should return default radius when there is no border', () => {
        // Arrange
        const firstPoint = new Point(0, 0);
        const oppositePoint = new Point(2, 2);

        // Act
        const result = service.getRadiusEllipse(firstPoint, oppositePoint);

        // Assert
        expect(result).toEqual({ rx: 1, ry: 1, canContourFit: true });
    });

    it('getRadiusPolygone should return radius with default algorithm of when the border bigger than polygone', () => {
        // Arrange
        const firstPoint = new Point(0, 0);
        const oppositePoint = new Point(2, 2);
        const strokeWidth = 2;
        const numberOfSides = 3;

        // Act
        const result = service.getRadiusPolygone(firstPoint, oppositePoint, strokeWidth, numberOfSides);

        // Assert
        expect(result).toEqual({ rx: 1, ry: 1, canContourFit: false });
    });

    it('getRadiusPolygone should return radius with algorithm for triangle when the border is not bigger than polygone', () => {
        // Arrange
        const firstPoint = new Point(0, 0);
        const oppositePoint = new Point(2, 2);
        const strokeWidth = 1;
        const numberOfSides = 3;

        // Act
        const result = service.getRadiusPolygone(firstPoint, oppositePoint, strokeWidth, numberOfSides);

        // Assert
        expect(result).toEqual({ rx: 0, ry: 0, canContourFit: true });
    });

    it('getRadiusPolygone should return radius with algorithm for shapes that are not triangles when the border is not bigger than polygone', () => {
        // Arrange
        const firstPoint = new Point(0, 0);
        const oppositePoint = new Point(2, 2);
        const strokeWidth = 1;
        const numberOfSides = 5;

        // Act
        const result = service.getRadiusPolygone(firstPoint, oppositePoint, strokeWidth, numberOfSides);

        // Assert
        const expectedRadius = 1 / 2 - strokeWidth / Math.pow(numberOfSides / 2.0, 2.0);
        expect(result).toEqual({ rx: expectedRadius, ry: expectedRadius, canContourFit: true });
    });

    it('getRectangleDimension should return correct dimension when there is no border', () => {
        // Arrange
        const firstPoint = new Point(0, 0);
        const oppositePoint = new Point(2, 2);

        // Act
        const result = service.getRectangleDimension(firstPoint, oppositePoint);

        // Assert
        expect(result).toEqual({ width: oppositePoint.x, height: oppositePoint.y, canContourFit: true });
    });

    it('getRectangleDimension should return correct dimension with canContourFit true when the border can fit', () => {
        // Arrange
        const firstPoint = new Point(0, 0);
        const oppositePoint = new Point(2, 2);
        const strokeWidth = 1;

        // Act
        const result = service.getRectangleDimension(firstPoint, oppositePoint, strokeWidth);

        // Assert
        expect(result).toEqual({ width: 1, height: 1, canContourFit: true });
    });

    it('getRectangleDimension should return default algorithm dimension with canContourFit false', () => {
        // Arrange
        const firstPoint = new Point(0, 0);
        const oppositePoint = new Point(2, 2);
        const strokeWidth = 2;

        // Act
        const result = service.getRectangleDimension(firstPoint, oppositePoint, strokeWidth);

        // Assert
        expect(result).toEqual({ width: 2, height: 2, canContourFit: false });
    });

    it('getRectangleUpperLeft should return correct left upper corner when there is no border', () => {
        // Arrange
        const firstPoint = new Point(0, 0);
        const oppositePoint = new Point(2, 2);

        // Act
        const result = service.getRectangleUpperLeft(firstPoint, oppositePoint);

        // Assert
        expect(result).toEqual(firstPoint);
    });

    it('getRectangleUpperLeft should return correct left upper when there is a border', () => {
        // Arrange
        const firstPoint = new Point(0, 0);
        const oppositePoint = new Point(2, 2);
        const strokeWidth = 1;

        // Act
        const result = service.getRectangleUpperLeft(firstPoint, oppositePoint, strokeWidth);

        // Assert
        expect(result).toEqual(new Point(firstPoint.x + 1 / 2, firstPoint.y + 1 / 2));
    });

    it('transformRectangleToSquare should return correct right lower corner when the min shift is in x axis', () => {
        // Arrange
        const firstPoint = new Point(0, 0);
        const oppositePoint = new Point(2 + 1, 2);

        // Act
        const result = service.transformRectangleToSquare(firstPoint, oppositePoint);

        // Assert
        expect(result).toEqual(new Point(2, 2));
    });

    it('transformRectangleToSquare should return correct right lower corner when the min shift is in y axis ', () => {
        // Arrange
        const firstPoint = new Point(0, 0);
        const oppositePoint = new Point(2, 2 + 1);

        // Act
        const result = service.transformRectangleToSquare(firstPoint, oppositePoint);

        // Assert
        expect(result).toEqual(new Point(2, 2));
    });
});
