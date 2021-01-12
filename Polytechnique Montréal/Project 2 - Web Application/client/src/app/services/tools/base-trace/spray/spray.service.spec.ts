import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { Point } from '@app/classes/utils/point';
import { MouseButton } from '@app/declarations/mouse.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { SprayService } from './spray.service';

// tslint:disable:no-magic-numbers
// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('SprayService', () => {
    let service: SprayService;
    let mouseEvent: PointerEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let snapshotFactory: jasmine.SpyObj<SnapshotFactoryService>;

    beforeEach(() => {
        snapshotFactory = jasmine.createSpyObj('SnapshotFactoryService', ['save']);

        drawServiceSpy = {
            ...jasmine.createSpyObj('DrawingService', ['cleanPreview', 'drawPreview', 'drawBase']),
            canvasWidth: 0,
            canvasHeight: 0,
        } as jasmine.SpyObj<DrawingService>;

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
            imports: [MatSnackBarModule],
        });
        service = TestBed.inject(SprayService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' #onMouseDown should set #mousePosition to correct position', () => {
        // Arrange
        const expectedResult: Vec2 = { x: 25, y: 25 };

        // Act
        service.onMouseDown(mouseEvent);

        // Assert
        expect(service['mousePosition']).toEqual(expectedResult);
    });

    it(' #onMouseDown should set #mouseDown property to true on left click', () => {
        // Arrange

        // Act
        service.onMouseDown(mouseEvent);

        // Assert
        expect(service['mouseDown']).toEqual(true);
    });

    it(' #onMouseDown should set #mouseDown property to false on right click', () => {
        // Arrange
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as PointerEvent;

        // Act
        service.onMouseDown(mouseEventRClick);

        // Assert
        expect(service['mouseDown']).toEqual(false);
    });

    it(' #onMouseDown should call #calculateRandomPosition', () => {
        // Arrange
        const spyStartInterval = spyOn<any>(service, 'startInterval');

        // Act
        service.onMouseDown(mouseEvent);

        // Assert
        expect(spyStartInterval).toHaveBeenCalled();
    });

    it(' #onMouseMove should call #getPositionFromMouse', () => {
        // Arrange
        const spyGetPositionFromMouse = spyOn<any>(service, 'getPositionFromMouse');

        // Act
        service.onMouseMove(mouseEvent);

        // Assert
        expect(spyGetPositionFromMouse).toHaveBeenCalled();
    });

    it(' #onMouseUp should not call drawBase if mouse was not already down', () => {
        // Arrange
        const spyStopInterval = spyOn<any>(service, 'stopInterval');

        // Act
        service.onMouseUp(mouseEvent);

        // Assert
        expect(spyStopInterval).toHaveBeenCalled();
    });

    it(' #startInterval should call #setInterval', () => {
        // Arrange
        jasmine.clock().install();
        const spyFunctionDrawSplash = spyOn<any>(service, 'functionDrawSplash');
        const time = 5;
        spyOn<any>(service, 'calculateSplashPeriod').and.returnValue(time);

        // Act
        const startInterval = service['startInterval']();
        jasmine.clock().tick(time + 1);

        // Assert
        expect(startInterval).not.toBeNull();
        expect(spyFunctionDrawSplash).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });

    it(' #stopInterval should call #clearInterval', () => {
        // Arrange
        jasmine.clock().install();
        let test = true;
        const time = 5;

        service['interval'] = setInterval(() => {
            test = false;
        }, time);

        // Act
        service['stopInterval']();
        jasmine.clock().tick(time - 1);

        // Assert
        expect(test).toEqual(true);
        jasmine.clock().uninstall();
    });

    it(' #calculateRandomPosition should return a point with offset on #x and #y', () => {
        // Arrange
        service['mousePosition'] = new Point(10, 10);
        spyOn<any>(service, 'getRandomOffset').and.returnValue(new Point(7, 8));

        // Act
        const calculatedPoint = service['calculateRandomPosition']();

        // Assert
        expect(calculatedPoint).toEqual(new Point(17, 18));
    });

    it(' #getRandomOffset should return a random #x and #y value', () => {
        // Arrange
        spyOn<any>(service, 'getRandomOffset');

        // Act
        const calculatedRandomOffset = service['getRandomOffset']();

        // Assert
        expect(calculatedRandomOffset).not.toBeNull();
    });
});
