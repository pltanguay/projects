import { BaseTrace } from '@app/classes/base-trace/base-trace';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { MouseButton } from '@app/declarations/mouse.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BaseTraceService } from '@app/services/tools/base-trace/base-trace.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';

// tslint:disable:max-classes-per-file
// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:no-empty
// tslint:disable:no-magic-numbers

class TestTool extends BaseTrace {
    addPoint(): void {}

    pushCurrentPath(): void {}
}
class BaseTraceServiceTest extends BaseTraceService {
    protected newTrace(): void {
        return;
    }
}

describe('BaseTraceService', () => {
    let service: BaseTraceServiceTest;
    let mouseEvent: PointerEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let snapshotFactory: jasmine.SpyObj<SnapshotFactoryService>;
    let baseCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        snapshotFactory = jasmine.createSpyObj('SnapshotFactoryService', ['save']);
        drawServiceSpy = {
            ...jasmine.createSpyObj('DrawingService', ['cleanPreview', 'drawPreview', 'drawBase']),
            canvasWidth: 0,
            canvasHeight: 0,
            baseCtx: baseCtxStub,
        } as jasmine.SpyObj<DrawingService>;

        service = new BaseTraceServiceTest(drawServiceSpy, snapshotFactory);

        /*
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;*/
        service.currentTrace = new TestTool(10, 'white');
        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as PointerEvent;
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

    it(' #onMouseDown should set #mouseDown property to true on left click and drawPreview', () => {
        // Arrange

        // Act
        service.onMouseDown(mouseEvent);

        // Assert
        expect(drawServiceSpy.drawPreview).toHaveBeenCalled();
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

    it(' #onMouseUp should call #stopDrawing if mouse was already down', () => {
        // Arrange
        service['mousePosition'] = { x: 0, y: 0 };
        service['mouseDown'] = true;
        spyOn(service, 'stopDrawing');

        // Act
        service.onMouseUp(mouseEvent);

        // Assert
        expect(service.stopDrawing).toHaveBeenCalled();
    });

    it(' #onMouseUp should not call #stopDrawing if mouse was not already down', () => {
        // Arrange
        service['mouseDown'] = false;
        spyOn(service, 'stopDrawing');

        // Act
        service.onMouseUp(mouseEvent);

        // Assert
        expect(service.stopDrawing).not.toHaveBeenCalled();
    });

    it(' #onMouseMove should call #drawPreview if mouse was already down (inside)', () => {
        // Arrange
        service['mouseDown'] = true;

        // Act
        service.onMouseMove(mouseEvent);

        // Assert
        expect(drawServiceSpy.drawPreview).toHaveBeenCalled();
    });

    it(' #onMouseMove should not call #drawPreview if mouse was not already down', () => {
        // Arrange
        service['mouseDown'] = false;

        // Act
        service.onMouseMove(mouseEvent);

        // Assert
        expect(drawServiceSpy.cleanPreview).not.toHaveBeenCalled();
        expect(drawServiceSpy.drawPreview).not.toHaveBeenCalled();
    });

    it(' #stopDrawing with mouse down should save the snapshot', () => {
        // Arrange
        service['mouseDown'] = true;

        // Act
        service.stopDrawing();

        // Assert
        expect(snapshotFactory.save).toHaveBeenCalled();
        expect(drawServiceSpy.drawBase).toHaveBeenCalled();
    });

    it(' #stopDrawing with mouse down false should do nothing', () => {
        // Arrange
        service['mouseDown'] = false;

        // Act
        service.stopDrawing();

        // Assert
        expect(drawServiceSpy.cleanPreview).not.toHaveBeenCalled();
        expect(snapshotFactory.save).not.toHaveBeenCalled();
    });
    it(' #onMouseDown should set #mousePosition to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service['mousePosition']).toEqual(expectedResult);
    });

    it(' #onMouseDown should set #mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service['mouseDown']).toEqual(true);
    });

    it(' #onMouseDown should set #mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as PointerEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service['mouseDown']).toEqual(false);
    });

    it(' #onMouseUp should do nothing if the up button was something other than left', () => {
        // Arrange
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as MouseEvent;
        spyOn(service, 'stopDrawing');

        // Act
        service.onMouseUp(mouseEventRClick);

        // Assert
        expect(service.stopDrawing).not.toHaveBeenCalled();
    });

    it(' #onMouseUp should call #pushData if mouse was already down', () => {
        service['mousePosition'] = { x: 0, y: 0 };
        service['mouseDown'] = true;
        service.onMouseUp(mouseEvent);
        expect(snapshotFactory.save).toHaveBeenCalled();
    });

    it(' #onMouseUp should not call #drawBase if mouse was not already down', () => {
        service['mouseDown'] = false;
        service['mousePosition'] = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawServiceSpy.drawBase).not.toHaveBeenCalled();
    });

    it(' #onMouseMove should call #drawBase if mouse was already down', () => {
        service['mousePosition'] = { x: 0, y: 0 };
        service['mouseDown'] = true;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(drawServiceSpy.drawPreview).toHaveBeenCalled();
    });

    it(' #onMouseMove should not call #drawBase if mouse was not already down', () => {
        service['mousePosition'] = { x: 0, y: 0 };
        service['mouseDown'] = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.drawBase).not.toHaveBeenCalled();
    });

    it(' #onMouseMove should not call #drawBase if mouse is outside', () => {
        service['mousePosition'] = { x: 0, y: 0 };
        service['mouseOut'] = true;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.drawBase).not.toHaveBeenCalled();
    });

    it(' #onMouseEnter should set #mouseOut property to false ', () => {
        service.onMouseEnter(mouseEvent);
        expect(service['mouseOut']).toEqual(false);
    });
});
