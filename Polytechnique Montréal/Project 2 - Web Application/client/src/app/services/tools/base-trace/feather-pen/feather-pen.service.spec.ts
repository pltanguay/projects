import { TestBed } from '@angular/core/testing';
import { MouseButton } from '@app/declarations/mouse.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { FeatherPenService } from './feather-pen.service';

// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
// tslint:disable:no-any

describe('FeatherPenService', () => {
    let service: FeatherPenService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let snapshotFactory: jasmine.SpyObj<SnapshotFactoryService>;
    let mouseEvent: PointerEvent;

    beforeEach(() => {
        drawServiceSpy = {
            ...jasmine.createSpyObj('DrawingService', ['cleanPreview', 'drawPreview', 'drawBase']),
            canvasWidth: 100,
            canvasHeight: 100,
        } as jasmine.SpyObj<DrawingService>;
        snapshotFactory = jasmine.createSpyObj('SnapshotFactoryService', ['save']);

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as PointerEvent;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: SnapshotFactoryService, useValue: snapshotFactory },
            ],
        });
        service = TestBed.inject(FeatherPenService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onMouseMove should call #drawPoint', () => {
        // Arrange
        const spy = spyOn(service, 'drawPoint');

        // Act
        service.onMouseMove(mouseEvent);

        // Arrange
        expect(spy).toHaveBeenCalled();
    });

    it('#onMouseUp should call not save if #mouseDown is false', () => {
        // Arrange
        service['mouseDown'] = false;

        // Act
        service.onMouseUp(mouseEvent);

        // Arrange
        expect(snapshotFactory.save).not.toHaveBeenCalled();
    });

    it('#onMouseUp should save if #mouseDown is true', () => {
        // Arrange
        service['mouseDown'] = true;

        // Act
        service.onMouseUp(mouseEvent);

        // Arrange
        expect(snapshotFactory.save).toHaveBeenCalled();
    });

    it('#onMouseOut should call #cleanPreview if mouse position is not in canvas', () => {
        // Arrange
        const mouseEventOut = {
            offsetX: 150,
            offsetY: 150,
            button: MouseButton.Left,
        } as PointerEvent;

        spyOn<any>(service, 'isReallyOut').and.returnValue(true);

        // Act
        service.onMouseOut(mouseEventOut);

        // Assert
        expect(drawServiceSpy['cleanPreview']).toHaveBeenCalled();
    });

    it('#onMouseOut should not call #cleanPreview if mouse position is in canvas', () => {
        // Arrange
        const mouseEventOut = {
            offsetX: 50,
            offsetY: 50,
            button: MouseButton.Left,
        } as PointerEvent;

        spyOn<any>(service, 'isReallyOut').and.returnValue(false);

        // Act
        service.onMouseOut(mouseEventOut);

        // Assert
        expect(drawServiceSpy['cleanPreview']).not.toHaveBeenCalled();
    });

    it('#onWheelScroll should call drawCursor', () => {
        // Arrange
        service['mouseDown'] = true;
        const wheelEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as WheelEvent;
        const spy = spyOn<any>(service, 'drawCursor');

        // Act
        service.onWheelScroll(wheelEvent);

        // Arrange
        expect(spy).toHaveBeenCalled();
    });
    it(' #validateLimits should set #angle to 360 if #angle is -1', () => {
        // Arrange
        service.angle = -1;

        // Act
        service['validateLimits']();

        // Assert
        expect(service.angle).toEqual(360);
    });

    it(' #validateLimits should set #angle to 0 if #angle is 361', () => {
        // Arrange
        service.angle = 361;

        // Act
        service['validateLimits']();

        // Assert
        expect(service.angle).toEqual(0);
    });

    it('#updateAngle should increment angle by 1 is altKey is not pressed', () => {
        // Arrange
        service.angle = 30;
        const isAltKeyPressed = true;

        // Act
        service['updateAngle'](-1, isAltKeyPressed);

        // Arrange
        expect(service.angle).toBe(31);
    });

    it('#updateAngle should increment angle by 15 is altKey is pressed', () => {
        // Arrange
        service.angle = 30;
        const isAltKeyPressed = false;

        // Act
        service['updateAngle'](1, isAltKeyPressed);

        // Arrange
        expect(service.angle).toBe(15);
    });

    it('#getAngleObservable should call #asObservable', () => {
        // Arrange
        const spyAsObservable = spyOn<any>(service['angleSubject'], 'asObservable');

        // Act
        service.getAngleObservable();

        // Assert
        expect(spyAsObservable).toHaveBeenCalled();
    });
});
