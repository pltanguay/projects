import { TestBed } from '@angular/core/testing';
import { Color } from '@app/classes/color/color';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { FloodFillContinuousStrategy } from '@app/classes/utils/floodfill-strategy/floodfills/floodfill-continuous';
import { FloodFillNonContinuousStrategy } from '@app/classes/utils/floodfill-strategy/floodfills/floodfill-noncontinuous';
import { Point } from '@app/classes/utils/point';
import { MouseButton } from '@app/declarations/mouse.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { BucketService } from './bucket.service';

// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
// tslint:disable:no-any
describe('BucketService', () => {
    let service: BucketService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let snapshotFactoryService: jasmine.SpyObj<SnapshotFactoryService>;

    beforeEach(() => {
        const context = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        snapshotFactoryService = jasmine.createSpyObj('SnapshotFactoryService', ['save']);

        drawServiceSpy = {
            ...jasmine.createSpyObj('DrawingService', ['cleanPreview', 'drawPreview', 'drawBase']),
            canvasWidth: 0,
            canvasHeight: 0,
            baseCtx: context,
        } as jasmine.SpyObj<DrawingService>;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: SnapshotFactoryService, useValue: snapshotFactoryService },
            ],
        });
        service = TestBed.inject(BucketService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onMouseDown should construct a bucket with a NonContinuous floodfill mode on left click', () => {
        // Arrange
        const color = new Color({
            red: '05',
            green: '05',
            blue: '05',
            opacity: 1,
        });
        spyOn<any>(service, 'createfloodFillNonContinuous');
        spyOn<any>(service, 'getOldColor').and.returnValue(color);
        spyOn<any>(service, 'failedInitialVerification');

        const mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as PointerEvent;

        // Act
        service['onMouseDown'](mouseEvent);

        // Assert
        expect(service['createfloodFillNonContinuous']).toHaveBeenCalled();
    });

    it('#onMouseDown should construct a bucket with a Continuous floodfill mode on right click', () => {
        // Arrange
        const color = new Color({
            red: '05',
            green: '05',
            blue: '05',
            opacity: 1,
        });
        spyOn<any>(service, 'createfloodFillContinuous');
        spyOn<any>(service, 'getOldColor').and.returnValue(color);
        spyOn<any>(service, 'failedInitialVerification');

        const mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as PointerEvent;

        // Act
        service['onMouseDown'](mouseEvent);

        // Assert
        expect(service['createfloodFillContinuous']).toHaveBeenCalled();
    });

    it('#onMouseDown should do nothing if #failedInitialVerification is true', () => {
        // Arrange
        const color = new Color({
            red: '05',
            green: '05',
            blue: '05',
            opacity: 1,
        });
        spyOn<any>(service, 'createfloodFillContinuous');
        spyOn<any>(service, 'getOldColor').and.returnValue(color);
        spyOn<any>(service, 'failedInitialVerification').and.returnValue(true);

        const mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as PointerEvent;

        // Act
        service['onMouseDown'](mouseEvent);

        // Assert
        expect(service['isProcessing']).toBe(false);
    });

    it('#createfloodFillNonContinuous should return on instance of FloodFillNonContinuousStrategy', () => {
        // Arrange
        const indexOneDimensional = 20;

        // Act
        const instanceOf = service['createfloodFillNonContinuous'](indexOneDimensional);

        // Assert
        expect(instanceOf).toBeInstanceOf(FloodFillNonContinuousStrategy);
    });

    it('#createfloodFillContinuous should return on instance of FloodFillContinuousStrategy', () => {
        // Arrange

        // Act
        const instanceOf = service['createfloodFillContinuous']();

        // Assert
        expect(instanceOf).toBeInstanceOf(FloodFillContinuousStrategy);
    });

    it('#failedInitialVerification should be true if #fillColor is equal to #oldColor', () => {
        // Arrange
        service['fillColor'] = new Color({
            red: '00',
            green: '00',
            blue: '00',
            opacity: 1,
        });

        service['oldColor'] = new Color({
            red: '00',
            green: '00',
            blue: '00',
            opacity: 1,
        });

        // Act
        const hasPassed = service['failedInitialVerification']();

        // Assert
        expect(hasPassed).toBe(true);
    });

    it('#failedInitialVerification should be true if #outsideCanvas is true', () => {
        // Arrange
        service['fillColor'] = new Color({
            red: '00',
            green: '00',
            blue: '00',
            opacity: 1,
        });

        service['oldColor'] = new Color({
            red: 'FF',
            green: 'FF',
            blue: 'FF',
            opacity: 1,
        });

        spyOn<any>(service, 'outsideCanvas').and.returnValue(true);

        // Act
        const hasPassed = service['failedInitialVerification']();

        // Assert
        expect(hasPassed).toBe(true);
    });

    it('#outsideCanvas should return false if #position is between 0 and canvas length (one dimensional)', () => {
        // Arrange
        const mousePosition = new Point(100, 100);
        service['canvasSize'] = {
            width: 300,
            height: 300,
        };
        // Act
        const hasPassed = service['outsideCanvas'](mousePosition);

        // Assert
        expect(hasPassed).toBe(false);
    });

    it('#outsideCanvas should return true if #position is below 0', () => {
        // Arrange
        const mousePosition = new Point(-40, -40);
        service['canvasSize'] = {
            width: 300,
            height: 300,
        };
        // Act
        const hasPassed = service['outsideCanvas'](mousePosition);

        // Assert
        expect(hasPassed).toBe(true);
    });

    it('#outsideCanvas should return true if #position is above canvas length (one dimensional)', () => {
        // Arrange
        const mousePosition = new Point(400, 400);
        service['canvasSize'] = {
            width: 300,
            height: 300,
        };
        // Act
        const hasPassed = service['outsideCanvas'](mousePosition);

        // Assert
        expect(hasPassed).toBe(true);
    });

    it('#roundMousePosition should return rounded value', () => {
        // Arrange
        const mousePosition = new Point(3.3, 5.6);
        const roundedPointExpectation = new Point(3, 6);

        // Act
        const roundedPoint = service['roundMousePosition'](mousePosition);

        // Assert
        expect(roundedPoint).toEqual(roundedPointExpectation);
    });

    it('#getOldColor should return a null color', () => {
        // Arrange
        service['mouseDownPosition'] = new Point(0, 0);

        // Act
        const pickedColor = service['getOldColor']();

        // Assert
        expect(pickedColor.uint32).not.toBeNull();
    });
});
