import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Ellipse } from '@app/classes/contour-shape/ellipse/ellipse';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MathUtilsService } from '@app/services/mathematic/math-utils.service';
import { EllipseService } from './ellipse.service';
// tslint:disable:no-string-literal
describe('EllipseService', () => {
    let service: EllipseService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let mathService: jasmine.SpyObj<MathUtilsService>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['cleanPreview', 'drawPreview', 'drawBase', 'pushData']);
        mathService = jasmine.createSpyObj('MathUtilsService()', ['transformRectangleToSquare', 'getCenterShape', 'getRadiusEllipse']);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: MathUtilsService, useValue: mathService },
            ],
            imports: [MatSnackBarModule],
        });
        service = TestBed.inject(EllipseService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' #configureShape should set center and radius of ellipse', () => {
        // Arrange
        const radius = { rx: 1, ry: 1 };
        const center = { x: 2, y: 2 };
        mathService.getRadiusEllipse.and.returnValue(radius);
        mathService.getCenterShape.and.returnValue(center);

        // Act
        service['configureShape']();

        // Assert
        expect((service['currentShape'] as Ellipse).center).toBe(center);
        expect((service['currentShape'] as Ellipse).radius).toBe(radius);
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
