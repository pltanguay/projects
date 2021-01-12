import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { Line } from '@app/classes/line/line';
import { MouseButton } from '@app/declarations/mouse.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MathUtilsService } from '@app/services/mathematic/math-utils.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { LineService } from './line.service';
// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:max-file-line-count
// On adopte la methode AAA, ce qui augmente les lignes

describe('LineService', () => {
    let service: LineService;
    let mouseEvent: PointerEvent;
    let keyevent: KeyboardEvent;
    let snapshotFactory: jasmine.SpyObj<SnapshotFactoryService>;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let mathService: jasmine.SpyObj<MathUtilsService>;
    let lineSpy: jasmine.SpyObj<Line>;

    beforeEach(() => {
        snapshotFactory = jasmine.createSpyObj('SnapshotFactoryService', ['save']);
        mathService = jasmine.createSpyObj('MathUtilsService', ['getAlignedSegment']);
        lineSpy = jasmine.createSpyObj('Line', [
            'addSegment',
            'addPreviewSegment',
            'removeLastVertex',
            'removeSegments',
            'getLastVertex',
            'isStarted',
        ]);

        lineSpy.isStarted.and.returnValue(true);
        drawServiceSpy = {
            ...jasmine.createSpyObj('DrawingService', ['cleanPreview', 'drawPreview', 'drawBase']),
            canvasWidth: 0,
            canvasHeight: 0,
        } as jasmine.SpyObj<DrawingService>;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: MathUtilsService, useValue: mathService },
                { provide: SnapshotFactoryService, useValue: snapshotFactory },
            ],
        });
        service = TestBed.inject(LineService);
        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as PointerEvent;
        service['currentLine'] = lineSpy;
        keyevent = {
            key: 'Shift',
        } as KeyboardEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' onMouseClick should call mouseClickHandle when left mouse clicked', fakeAsync(() => {
        // Arrange
        spyOn<any>(service, 'mouseClickHandle');

        // Act
        service.onMouseClick(mouseEvent);
        tick();

        // Assert
        expect(service['mouseClickHandle']).toHaveBeenCalled();
    }));

    it(' onMouseClick should call mouseClickHandle when left mouse clicked', fakeAsync(() => {
        // Arrange
        spyOn<any>(service, 'mouseClickHandle');

        // Act
        service.onMouseClick(mouseEvent);
        service.onMouseDoubleClick(mouseEvent);
        tick();

        // Assert
        expect(service['mouseClickHandle']).not.toHaveBeenCalled();
    }));

    it(' onMouseClick should not call mouseClickHandle when left mouse is not clicked', fakeAsync(() => {
        // Arrange
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as PointerEvent;
        spyOn<any>(service, 'mouseClickHandle');

        // Act
        service.onMouseClick(mouseEventRClick);
        tick();

        // Assert
        expect(service['mouseClickHandle']).not.toHaveBeenCalled();
    }));

    it(' onMouseClick should set mousePosition to correct position', () => {
        // Arrange
        const expectedResult: Vec2 = { x: mouseEvent.offsetX, y: mouseEvent.offsetY };

        // Act
        service['mouseClickHandle'](mouseEvent);

        // Assert
        expect(service['mousePosition']).toEqual(expectedResult);
    });
    it(' onMouseClick should set mouseFirstClick property to false on right click', () => {
        // Arrange
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as PointerEvent;

        // Act
        service['mouseClickHandle'](mouseEventRClick);

        // Assert
        expect(service['mouseFirstClick']).toEqual(false);
    });

    it(' onMouseClick should set mouseFirstClick property to true on left click', () => {
        // Arrange

        // Act
        service['mouseClickHandle'](mouseEvent);

        // Assert
        expect(service['mouseFirstClick']).toEqual(true);
    });

    it(' onMouseClick should draw a segment', () => {
        // Arrange
        service['mouseFirstClick'] = true;

        // Act
        service['mouseClickHandle'](mouseEvent);

        // Assert
        expect(lineSpy.addSegment).toHaveBeenCalled();
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(drawServiceSpy.drawPreview).toHaveBeenCalled();
    });

    it(' onMouseClick when shift key is pressed should draw an aligned segment when the line is started', () => {
        // Arrange
        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
            shiftKey: true,
        } as PointerEvent;
        service['mouseFirstClick'] = true;
        lineSpy.isStarted.and.returnValue(true);

        // Act
        service['mouseClickHandle'](mouseEvent);

        // Assert
        expect(lineSpy.addSegment).toHaveBeenCalled();
        expect(mathService.getAlignedSegment).toHaveBeenCalled();
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(drawServiceSpy.drawPreview).toHaveBeenCalled();
    });

    it(' onMouseMove should call drawPreview if drawing started', () => {
        // Arrange
        service['mouseFirstClick'] = true;

        // Act
        service.onMouseMove(mouseEvent);

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(drawServiceSpy.drawPreview).toHaveBeenCalled();
        expect(lineSpy.addPreviewSegment).toHaveBeenCalledWith({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
    });

    it(' onMouseMove should call drawPreview with an aligned segment when mouse moving with shif key pressed', () => {
        // Arrange
        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
            shiftKey: true,
        } as PointerEvent;
        service['mouseFirstClick'] = true;

        // Act
        service.onMouseMove(mouseEvent);

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(drawServiceSpy.drawPreview).toHaveBeenCalled();
        expect(mathService.getAlignedSegment).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawPreview if mouse was not already clicked', () => {
        // Arrange
        service['mouseFirstClick'] = false;

        // Act
        service.onMouseMove(mouseEvent);

        // Assert
        expect(drawServiceSpy.cleanPreview).not.toHaveBeenCalled();
        expect(drawServiceSpy.drawPreview).not.toHaveBeenCalled();
    });

    it(' onMouseDoubleClick should call stopDrawing if mouse was already clicked', () => {
        // Arrange
        service['mouseFirstClick'] = true;
        spyOn(service, 'stopDrawing');

        // Act
        service.onMouseDoubleClick(mouseEvent);

        // Assert
        expect(service.stopDrawing).toHaveBeenCalled();
    });

    it(' onMouseDoubleClick should not call stopDrawing if left mouse is not already clicked', () => {
        // Arrange
        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as PointerEvent;
        service['mouseFirstClick'] = true;
        spyOn(service, 'stopDrawing');

        // Act
        service.onMouseDoubleClick(mouseEvent);

        // Assert
        expect(service.stopDrawing).not.toHaveBeenCalled();
    });

    it(' onKeyDown with mouse not clicked should do nothing', () => {
        // Arrange

        // Act
        service.onKeyDown(keyevent);

        // Assert
        expect(drawServiceSpy.cleanPreview).not.toHaveBeenCalled();
        expect(drawServiceSpy.drawPreview).not.toHaveBeenCalled();
    });

    it(' onKeyDown with unhandled key should do nothing', () => {
        // Arrange
        service['mouseFirstClick'] = true;
        keyevent = {
            key: 'Space',
        } as KeyboardEvent;

        // Act
        service.onKeyDown(keyevent);

        // Assert
        expect(drawServiceSpy.cleanPreview).not.toHaveBeenCalled();
        expect(drawServiceSpy.drawPreview).not.toHaveBeenCalled();
    });

    it(' onKeyDown with shift key should update preview canvas with aligned segment', () => {
        // Arrange
        service['mouseFirstClick'] = true;

        // Act
        service.onKeyDown(keyevent);

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(mathService.getAlignedSegment).toHaveBeenCalled();
        expect(drawServiceSpy.drawPreview).toHaveBeenCalled();
    });

    it(' onKeyDown with backspace key should update preview with removed last segment', () => {
        // Arrange
        service['mouseFirstClick'] = true;
        keyevent = {
            key: 'Backspace',
        } as KeyboardEvent;

        // Act
        service.onKeyDown(keyevent);

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(lineSpy.removeLastVertex).toHaveBeenCalled();
        expect(drawServiceSpy.drawPreview).toHaveBeenCalled();
    });

    it(' onKeyDown with escape key should only clean preview and remove segments', () => {
        // Arrange
        service['mouseFirstClick'] = true;
        keyevent = {
            key: 'Escape',
        } as KeyboardEvent;

        // Act
        service.onKeyDown(keyevent);

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
    });

    it(' onKeyUp with shift key should update preview canvas with segment not aligned', () => {
        // Arrange
        service['mouseFirstClick'] = true;

        // Act
        service.onKeyUp(keyevent);

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(drawServiceSpy.drawPreview).toHaveBeenCalled();
    });

    it(' onKeyUp with mouse not clicked should not update preview canvas', () => {
        // Arrange

        // Act
        service.onKeyUp(keyevent);

        // Assert
        expect(drawServiceSpy.cleanPreview).not.toHaveBeenCalled();
        expect(drawServiceSpy.drawPreview).not.toHaveBeenCalled();
    });

    it(' onKeyUp with key different than shift should not update preview canvas', () => {
        // Arrange
        service['mouseFirstClick'] = true;
        keyevent = {
            key: 'Escape',
        } as KeyboardEvent;

        // Act
        service.onKeyUp(keyevent);

        // Assert
        expect(drawServiceSpy.cleanPreview).not.toHaveBeenCalled();
        expect(drawServiceSpy.drawPreview).not.toHaveBeenCalled();
    });

    it(' startDrawing should call newLine', () => {
        // Arrange
        spyOn<any>(service, 'newLine');

        // Act
        service.startDrawing();

        // Assert
        expect(service['newLine']).toHaveBeenCalled();
    });

    it(' stopDrawing should drawBase when mouse is already clicked', () => {
        // Arrange
        service['mouseFirstClick'] = true;

        // Act
        service.stopDrawing();

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(drawServiceSpy.drawBase).toHaveBeenCalled();
        expect(snapshotFactory.save).toHaveBeenCalled();
    });

    it(' stopDrawing should do nothing when mouse is not already clicked', () => {
        // Arrange
        service['mouseFirstClick'] = false;

        // Act
        service.stopDrawing();

        // Assert
        expect(drawServiceSpy.cleanPreview).not.toHaveBeenCalled();
        expect(drawServiceSpy.drawBase).not.toHaveBeenCalled();
        expect(snapshotFactory.save).not.toHaveBeenCalled();
    });
});
