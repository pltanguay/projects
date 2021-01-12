import { Point } from '@app/classes/utils/point';
import { DashedShapeService } from '@app/services/dashed-shape/dashed-shape.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MathUtilsService } from '@app/services/mathematic/math-utils.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { ContourShapeServiceAbs } from './contour-shape-abs';

class ContourShapeServiceTest extends ContourShapeServiceAbs {
    protected configureShape(): void {
        return;
    }
    protected newShape(): void {
        return;
    }
    protected transformShapeAlgorithm(startPoint: Point, oppositePoint: Point): Point {
        return { x: 0, y: 0 };
    }
}

// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:max-file-line-count

describe('ContourShapeServiceAbs', () => {
    let service: ContourShapeServiceTest;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let snapshotFactory: jasmine.SpyObj<SnapshotFactoryService>;
    const mathService: MathUtilsService = new MathUtilsService();
    let dashedShapeService: jasmine.SpyObj<DashedShapeService>;

    beforeEach(() => {
        dashedShapeService = jasmine.createSpyObj('DashedShapeService()', ['getDashedRectangle']);
        snapshotFactory = jasmine.createSpyObj('SnapshotFactoryService', ['save']);
        drawServiceSpy = {
            ...jasmine.createSpyObj('DrawingService', ['cleanPreview', 'drawPreview', 'drawBase']),
            canvasWidth: 0,
            canvasHeight: 0,
        } as jasmine.SpyObj<DrawingService>;

        service = new ContourShapeServiceTest(drawServiceSpy, snapshotFactory, mathService, dashedShapeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' #stopDrawing with mouse down and mouse move should #cleanPreview, #drawBase, #save, #isTranformed to false', () => {
        // Arrange
        service['mouseDown'] = true;
        service['mouseMove'] = true;

        // Act
        service.stopDrawing();

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(drawServiceSpy.drawBase).toHaveBeenCalled();
        expect(snapshotFactory.save).toHaveBeenCalled();
        expect(service['isTransformed']).toBeFalse();
    });

    it(' #stopDrawing with mouse down and mouse not move should #cleanPreview, #isTranformed to false', () => {
        // Arrange
        service['mouseDown'] = true;

        // Act
        service.stopDrawing();

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(drawServiceSpy.drawBase).not.toHaveBeenCalled();
        expect(snapshotFactory.save).not.toHaveBeenCalled();
        expect(service['isTransformed']).toBeFalse();
    });

    it(' #stopDrawing with mouse down false should do nothing', () => {
        // Arrange
        service['mouseDown'] = false;

        // Act
        service.stopDrawing();

        // Assert
        expect(drawServiceSpy.cleanPreview).not.toHaveBeenCalled();
    });

    it(' #updateView should call #drawPreview', () => {
        // Arrange
        spyOn<any>(service, 'drawPreview');

        // Act
        service['updateView']();

        // Assert
        expect(service['drawPreview']).toHaveBeenCalled();
    });

    it(' #drawPreview should draw a dashed rectangle', () => {
        // Arrange
        const value = jasmine.createSpyObj('DashedRectangle', ['']);
        dashedShapeService.getDashedRectangle.and.returnValue(value);

        // Act
        service['drawPreview']();

        // Assert
        expect(drawServiceSpy.drawPreview).toHaveBeenCalledWith(value);
    });
});
