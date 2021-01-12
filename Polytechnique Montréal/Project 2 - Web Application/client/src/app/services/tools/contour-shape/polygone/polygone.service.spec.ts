import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Polygone } from '@app/classes/contour-shape/polygone/polygone';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MathUtilsService } from '@app/services/mathematic/math-utils.service';
import { PolygoneService } from './polygone.service';

const oppositePoint = { x: 2, y: 4 };
const startPoint = { x: 0, y: 0 };

// tslint:disable:no-string-literal
describe('PolygoneService', () => {
    let service: PolygoneService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let mathService: jasmine.SpyObj<MathUtilsService>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['cleanPreview', 'drawPreview', 'drawBase', 'pushData']);
        mathService = jasmine.createSpyObj('MathUtilsService()', [
            'transformRectangleToSquare',
            'getCenterShape',
            'getRadiusPolygone',
            'getRadiusEllipse',
        ]);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: MathUtilsService, useValue: mathService },
            ],
            imports: [MatSnackBarModule],
        });
        service = TestBed.inject(PolygoneService);

        service['startPoint'] = startPoint;
        service['oppositePoint'] = oppositePoint;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' #configureShape should set center, radius and yAxisSign of polygone', () => {
        // Arrange
        const radius = { rx: 1, ry: 1, canContourFit: true };
        const center = { x: 2, y: 2 };

        mathService.getRadiusPolygone.and.returnValue(radius);
        mathService.getCenterShape.and.returnValue(center);
        mathService.transformRectangleToSquare.and.returnValue(oppositePoint);

        // Act
        service['configureShape']();
        const expectedYAxisSign = Math.sign(oppositePoint.y - startPoint.y);

        // Assert
        expect((service['currentShape'] as Polygone).center).toBe(center);
        expect((service['currentShape'] as Polygone).radius.r).toBe(radius.rx);
        expect((service['currentShape'] as Polygone).radius.canContourFit).toBe(radius.canContourFit);
        expect((service['currentShape'] as Polygone).yAxisSign).toBe(expectedYAxisSign);
    });

    it(' #transformShapeAlgorithm should return oppositePoint', () => {
        // Arrange

        // Act
        const result = service['transformShapeAlgorithm']({ x: 0, y: 0 }, { x: 1, y: 1 });

        // Assert
        expect(result).toEqual(service['oppositePoint']);
    });

    it(' #newShape should create current shape', () => {
        // Arrange
        const width = 2;
        const strokeColor = 'white';
        const fillColor = 'black';
        const withBorder = false;
        const withFill = true;
        const numberOfSides = 3;
        service.width = width;
        service.strokeColor = strokeColor;
        service.fillColor = fillColor;
        service.withBorder = withBorder;
        service.withFill = withFill;
        service.numberOfSides = numberOfSides;

        // Act
        service['newShape']();

        // Assert
        expect(service['width']).toBe(width);
        expect(service['strokeColor']).toBe(strokeColor);
        expect(service['fillColor']).toBe(fillColor);
        expect(service['withBorder']).toBe(withBorder);
        expect(service['withFill']).toBe(withFill);
        expect(service['numberOfSides']).toBe(numberOfSides);
    });

    it(' #drawPreview should draw a dashed cercle', () => {
        // Arrange

        // Act
        service['drawPreview']();

        // Assert
        expect(drawServiceSpy.drawPreview).toHaveBeenCalled();
    });
});
