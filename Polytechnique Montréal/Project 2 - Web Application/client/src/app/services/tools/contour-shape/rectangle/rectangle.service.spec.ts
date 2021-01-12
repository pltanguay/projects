import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Rectangle } from '@app/classes/contour-shape/rectangle/rectangle';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MathUtilsService } from '@app/services/mathematic/math-utils.service';
import { RectangleService } from './rectangle.service';
// tslint:disable:no-string-literal
describe('RectangleService', () => {
    let service: RectangleService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let mathService: jasmine.SpyObj<MathUtilsService>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['cleanPreview', 'drawPreview', 'drawBase', 'pushData']);
        mathService = jasmine.createSpyObj('MathUtilsService()', ['transformRectangleToSquare', 'getRectangleDimension', 'getRectangleUpperLeft']);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: MathUtilsService, useValue: mathService },
            ],
            imports: [MatSnackBarModule],
        });
        service = TestBed.inject(RectangleService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' #configureShape should set upper left and dimension of rectangle (border can fit)', () => {
        // Arrange
        const dimension = { width: 1, height: 1, canContourFit: true };
        const upperLeft = { x: 2, y: 2 };
        mathService.getRectangleDimension.and.returnValue(dimension);
        mathService.getRectangleUpperLeft.and.returnValue(upperLeft);

        // Act
        service['configureShape']();

        // Assert
        expect((service['currentShape'] as Rectangle).dimension).toBe(dimension);
        expect((service['currentShape'] as Rectangle).upperLeft).toBe(upperLeft);
    });

    it(' #configureShape should set dimension and recalculate upper left when border can not fit', () => {
        // Arrange
        const dimension = { width: 1, height: 1, canContourFit: false };
        const upperLeft1 = { x: 2, y: 2 };
        const upperLeft2 = { x: 3, y: 3 };
        mathService.getRectangleDimension.and.returnValue(dimension);
        mathService.getRectangleUpperLeft.and.returnValue(upperLeft1).and.returnValue(upperLeft2);

        // Act
        service['configureShape']();

        // Assert
        expect((service['currentShape'] as Rectangle).dimension).toBe(dimension);
        expect((service['currentShape'] as Rectangle).upperLeft).toBe(upperLeft2);
    });

    it(' #transformShapeAlgorithm should call transformRectangleToSquare', () => {
        // Arrange
        const expectedResult = { x: 1, y: 1 };
        mathService.transformRectangleToSquare.and.returnValue(expectedResult);

        // Act
        const result = service['transformShapeAlgorithm']({ x: 0, y: 0 }, { x: 0, y: 0 });

        // Assert
        expect(result).toBe(expectedResult);
    });

    it(' #newShape should create current shape', () => {
        // Arrange
        const width = 2;
        const strokeColor = 'white';
        const fillColor = 'black';
        const withBorder = false;
        const withFill = true;
        service.width = width;
        service.strokeColor = strokeColor;
        service.fillColor = fillColor;
        service.withBorder = withBorder;
        service.withFill = withFill;

        // Act
        service['newShape']();

        // Assert
        expect(service['width']).toBe(width);
        expect(service['strokeColor']).toBe(strokeColor);
        expect(service['fillColor']).toBe(fillColor);
        expect(service['withBorder']).toBe(withBorder);
        expect(service['withFill']).toBe(withFill);
    });
});
