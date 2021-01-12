import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Rectangle } from '@app/classes/contour-shape/rectangle/rectangle';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { DEFAULT_TOOL_WIDTH } from '@app/classes/tool/tool';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { Extrapolation } from '@app/classes/utils/extrapolation';
import { MouseButton } from '@app/declarations/mouse.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { EraserService } from './eraser.service';

// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('EraserService', () => {
    let service: EraserService;
    let mouseEvent: PointerEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let snapshotFactory: jasmine.SpyObj<SnapshotFactoryService>;
    let canvasContext: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;

    beforeEach(() => {
        jasmine.createSpyObj('Extrapolation', ['getInterpolatedPoint']);
        snapshotFactory = jasmine.createSpyObj('SnapshotFactoryService', ['save']);
        canvasStub = canvasTestHelper.canvas;
        canvasContext = canvasStub.getContext('2d') as CanvasRenderingContext2D;

        drawServiceSpy = {
            ...jasmine.createSpyObj('DrawingService', ['cleanPreview', 'drawPreview', 'drawBase']),
            canvasWidth: 100,
            canvasHeight: 100,
            baseCtx: canvasContext,
        } as jasmine.SpyObj<DrawingService>;

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: SnapshotFactoryService, useValue: snapshotFactory },
            ],
            imports: [MatSnackBarModule],
        });
        service = TestBed.inject(EraserService);
        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as PointerEvent;

        spyOn(Extrapolation, 'getNormalizedDeltaVector');
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

    it(' #onMouseUp should call save if mouse was already down', () => {
        // Arrange
        service['mousePosition'] = { x: 0, y: 0 };
        service['mouseDown'] = true;

        // Act
        service.onMouseUp(mouseEvent);

        // Assert
        expect(snapshotFactory.save).toHaveBeenCalled();
    });

    it(' #onMouseUp should not call drawBase if mouse was not already down', () => {
        // Arrange
        service['mouseDown'] = false;
        service['mousePosition'] = { x: 0, y: 0 };

        // Act
        service.onMouseUp(mouseEvent);

        // Assert
        expect(drawServiceSpy.drawBase).not.toHaveBeenCalled();
    });

    it(' #onMouseMove should call drawBase if mouse was already down', () => {
        // Arrange
        service['mousePosition'] = { x: 0, y: 0 };
        service['mouseDown'] = true;

        // Act
        service.onMouseMove(mouseEvent);

        // Assert
        expect(drawServiceSpy.drawBase).toHaveBeenCalled();
    });

    it(' #onMouseMove should not call drawBase if mouse was not already down', () => {
        // Arrange
        service['mousePosition'] = { x: 0, y: 0 };
        service['mouseDown'] = false;

        // Act
        service.onMouseMove(mouseEvent);

        // Assert
        expect(drawServiceSpy.drawBase).not.toHaveBeenCalled();
    });

    it(' #onMouseMove should not call drawBase if mouse is outside', () => {
        // Arrange
        service['mousePosition'] = { x: 0, y: 0 };
        service['mouseOut'] = true;

        // Act
        service.onMouseMove(mouseEvent);

        // Assert
        expect(drawServiceSpy.drawBase).not.toHaveBeenCalled();
    });

    it(' #onMouseOut should clean preview if isReallyOut is true', () => {
        // Arrange
        spyOn<any>(service, 'isReallyOut').and.returnValue(true);

        // Act
        service.onMouseOut(mouseEvent);

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
    });

    it(' #onMouseOut should not clean preview if isReallyOut is false', () => {
        // Arrange
        spyOn<any>(service, 'isReallyOut').and.returnValue(false);

        // Act
        service.onMouseOut(mouseEvent);

        // Assert
        expect(drawServiceSpy.cleanPreview).not.toHaveBeenCalled();
    });

    it(' #stopDrawing with #mouseDown true should clean preview and push the data', () => {
        // Arrange
        service['mouseDown'] = true;

        // Act
        service.stopDrawing();

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(snapshotFactory.save).toHaveBeenCalled();
    });

    it(' #stopDrawing with #mouseDown false should only clean preview canvas', () => {
        // Arrange
        service['mouseDown'] = false;

        // Act
        service.stopDrawing();

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(snapshotFactory.save).not.toHaveBeenCalled();
    });

    it('#drawEraser should draw an eraser curson on preview', () => {
        // Arrange
        service['mousePosition'] = { x: 0, y: 0 };
        service['mouseDown'] = false;
        const rectangle = new Rectangle(DEFAULT_TOOL_WIDTH, 'white', 'black', true, true);
        service['rectangle'] = rectangle;

        // Act
        service['drawEraser']();

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(drawServiceSpy.drawPreview).toHaveBeenCalledWith(rectangle);
    });
});
