import { TestBed } from '@angular/core/testing';
import { Ellipse } from '@app/classes/contour-shape/ellipse/ellipse';
import { Rectangle } from '@app/classes/contour-shape/rectangle/rectangle';
import { Point } from '@app/classes/utils/point';
import { DashedShapeService } from './dashed-shape.service';

const WIDTH = 3;
const HEIGHT = 4;

describe('DashedShapeService', () => {
    let service: DashedShapeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DashedShapeService);
        // tslint:disable-next-line: no-magic-numbers
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getDashedRectangle should return dashed rectangle with correct dimensions', () => {
        // Arrange
        const firstPoint = new Point(0, 0);
        const oppositePoint = new Point(2, 2);

        // Act
        const result = service.getDashedRectangle(firstPoint, oppositePoint, 'white');

        // Assert
        expect((result as Rectangle).dimension).toEqual({ width: 2, height: 2, canContourFit: true });
        expect((result as Rectangle).upperLeft).toEqual(firstPoint);
    });

    it('getDashedRectangle should return dashed rectangle with default color black', () => {
        // Arrange
        const firstPoint = new Point(0, 0);
        const oppositePoint = new Point(2, 2);

        // Act
        const result = service.getDashedRectangle(firstPoint, oppositePoint);

        // Assert
        expect((result as Rectangle).strokeColor).toEqual('black');
    });

    it('getDashedEllipse should return dashed ellipse with correct dimensions if #isCercle = false', () => {
        // Arrange
        const firstPoint = new Point(0, 0);
        const oppositePoint = new Point(WIDTH, HEIGHT);
        const isCercle = false;

        // Act
        const result = service.getDashedEllipse(firstPoint, oppositePoint, isCercle, 'black');

        // Assert
        expect((result as Ellipse).center).toEqual(new Point(WIDTH / 2, HEIGHT / 2));
        expect((result as Ellipse).radius).toEqual({ rx: (WIDTH - 1) / 2, ry: (HEIGHT - 1) / 2, canContourFit: true });
    });

    it('getDashedEllipse should return dashed cercle with correct dimensions if #isCercle = true', () => {
        // Arrange
        const firstPoint = new Point(0, 0);
        const oppositePoint = new Point(WIDTH, HEIGHT);
        const isCercle = true;

        // Act
        const result = service.getDashedEllipse(firstPoint, oppositePoint, isCercle, 'black');

        // Assert
        expect((result as Ellipse).center).toEqual(new Point(WIDTH / 2, WIDTH / 2));
        expect((result as Ellipse).radius).toEqual({ rx: (WIDTH - 1) / 2, ry: (WIDTH - 1) / 2, canContourFit: true });
    });
});
