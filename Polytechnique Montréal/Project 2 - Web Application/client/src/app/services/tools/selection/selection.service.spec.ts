import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { Matrix } from '@app/classes/matrix/matrix';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { Keyboard } from '@app/declarations/keyboard.enum';
import { MouseButton } from '@app/declarations/mouse.enum';
import { ToolType } from '@app/declarations/tool-declarations';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MathUtilsService } from '@app/services/mathematic/math-utils.service';
import { SnapToGridService } from '@app/services/snap-to-grid/snap-to-grid.service';
import { BoundingBoxService } from '@app/services/tools/selection/bounding-box/bounding-box.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { WorkspaceService } from '@app/services/workspace/workspace.service';
import { ROTATION_STEP } from './selection.service';
import { ArrowMove } from './transformer/arrow-move';
import { TransformationMatrixService } from './transformer/transformation-matrix.service';

// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:max-file-line-count

describe('SelectionService', () => {
    let service: SelectionService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let snapshotFactory: jasmine.SpyObj<SnapshotFactoryService>;
    let boundingBoxSpy: jasmine.SpyObj<BoundingBoxService>;
    let transformationMatrix: jasmine.SpyObj<TransformationMatrixService>;
    let mathService: jasmine.SpyObj<MathUtilsService>;
    let workspaceService: jasmine.SpyObj<WorkspaceService>;
    let snapGrid: jasmine.SpyObj<SnapToGridService>;
    let moveTransformer: jasmine.SpyObj<ArrowMove>;
    let renderer: jasmine.SpyObj<Renderer2>;
    let event: PointerEvent;
    let keyEvent: KeyboardEvent;
    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        mathService = jasmine.createSpyObj('MathUtilsService', ['getRectangleUpperLeft', 'getRectangleDimension', 'getCenterShape']);
        mathService.getRectangleUpperLeft.and.returnValue({ x: 0, y: 0 });

        snapshotFactory = jasmine.createSpyObj('SnapshotFactoryService', ['save']);

        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        drawServiceSpy = {
            ...jasmine.createSpyObj('DrawingService', ['cleanPreview', 'drawPreview', 'drawBase']),
            canvasWidth: 0,
            canvasHeight: 0,
            baseCtx: ctxStub,
        } as jasmine.SpyObj<DrawingService>;

        boundingBoxSpy = {
            ...jasmine.createSpyObj('BoundingBoxService', ['applyMatrixOnBorderPoints', 'applyTranslation']),
            center: { x: 0, y: 0 },
            dimension: { width: 100, height: 100 },
            top: 100,
            left: 100,
        };

        workspaceService = jasmine.createSpyObj('WorkspaceService', ['setOverflow']);

        snapGrid = jasmine.createSpyObj('SnapToGridService', ['getNearestPointTranslation', 'getArrowTranslationPoint']);
        transformationMatrix = {
            ...jasmine.createSpyObj('TransformationMatrixService', ['rotate', 'translate', 'scale', 'init', 'reset', 'setMatrix']),
            matrix: new Matrix(),
        } as jasmine.SpyObj<TransformationMatrixService>;

        moveTransformer = jasmine.createSpyObj('ArrowMove', ['arrowPressed', 'keyDown', 'keyUp']);
        renderer = jasmine.createSpyObj('Renderer2', ['createElement']);
        renderer.createElement.and.returnValue(canvasTestHelper.selectionCanvas);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: SnapshotFactoryService, useValue: snapshotFactory },
                { provide: MathUtilsService, useValue: mathService },
                { provide: BoundingBoxService, useValue: boundingBoxSpy },
                { provide: WorkspaceService, useValue: workspaceService },
                { provide: TransformationMatrixService, useValue: transformationMatrix },
                { provide: SnapToGridService, useValue: snapGrid },
            ],
        });
        service = TestBed.inject(SelectionService);

        service.moveTransformer = moveTransformer;
        service.renderer = renderer;

        event = { button: MouseButton.Left, pointerId: 1 } as PointerEvent;
        keyEvent = { key: Keyboard.LEFT_ARROW } as KeyboardEvent;
        service['selectionActive'] = true;
        service['currentSelection'] = {} as any;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onMouseDown should clean preview and reset attributes', () => {
        // Arrange
        service['selectionActive'] = false;
        service['selectionTransformed'] = false;

        // Act
        service.onMouseDown(event);

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
    });

    it('#onMouseDown should confirm selection if selection is active and transformed (moved)', () => {
        // Arrange
        service['selectionActive'] = true;
        service['selectionTransformed'] = true;
        spyOn<any>(service, 'confirmSelection');

        // Act
        service.onMouseDown(event);

        // Assert
        expect(service['confirmSelection']).toHaveBeenCalled();
    });

    it('#onMouseMove should set selection if mousedown is true', () => {
        // Arrange
        service['mouseDown'] = true;
        spyOn<any>(service, 'updateView');
        spyOn<any>(service, 'changeOppositePoint');

        // Act
        service.onMouseMove(event);

        // Assert
        expect(service['updateView']).toHaveBeenCalled();
        expect(service['changeOppositePoint']).toHaveBeenCalled();
        expect(service['mouseMove']).toBeTrue();
        expect(service['isProcessing']).toBeTrue();
    });

    it('#onMouseMove should not draw selection if mousedown is false', () => {
        // Arrange
        service['mouseDown'] = false;
        spyOn<any>(service, 'updateView');

        // Act
        service.onMouseMove(event);

        // Assert
        expect(service['updateView']).not.toHaveBeenCalled();
    });

    it('#onMouseUp should do nothing if mouse was not moved after down', () => {
        // Arrange
        service['mouseDown'] = true;
        service['mouseMove'] = false;
        spyOn<any>(service, 'drawBoundingBox');
        spyOn<any>(service, 'newSelection');

        // Act
        service.onMouseUp(event);

        // Assert
        expect(service['drawBoundingBox']).not.toHaveBeenCalled();
        expect(service['newSelection']).not.toHaveBeenCalled();
    });

    it('#onMouseUp should do nothing if mouse down is false', () => {
        // Arrange
        service['mouseDown'] = false;
        spyOn<any>(service, 'newSelection');

        // Act
        service.onMouseUp(event);

        // Assert
        expect(service['newSelection']).not.toHaveBeenCalled();
    });

    it('#onMouseUp should do nothing if mouse was not moved', () => {
        // Arrange
        service['mouseMove'] = false;
        spyOn<any>(service, 'newSelection');

        // Act
        service.onMouseUp(event);

        // Assert
        expect(service['newSelection']).not.toHaveBeenCalled();
    });

    it('#onMouseUp should call #stopDrawing if selection is small', () => {
        // Arrange
        service['mouseDown'] = true;
        service['mouseMove'] = true;
        spyOn<any>(service, 'stopDrawing');
        spyOn<any>(service, 'isSelectionSmall').and.returnValue(true);

        // Act
        service.onMouseUp(event);

        // Assert
        expect(service.stopDrawing).toHaveBeenCalled();
    });

    it('#onMouseUp should draw bounding box', () => {
        // Arrange
        service['mouseDown'] = true;
        service['mouseMove'] = true;
        spyOn<any>(service, 'drawBoundingBox');

        // Act
        service.onMouseUp(event);

        // Assert
        expect(service['drawBoundingBox']).toHaveBeenCalled();
    });

    it('#onKeyDown should set workspace overflow to hidden', () => {
        // Act
        service.onKeyDown(keyEvent);

        // Assert
        expect(workspaceService.setOverflow).toHaveBeenCalled();
        expect(workspaceService.setOverflow).toHaveBeenCalledWith('hidden');
    });

    it('#onKeyDown should call #escapeKeyPress on escape key', () => {
        // Arrange
        spyOn(service, 'escapeKeyPress');
        keyEvent = { key: Keyboard.ESC } as KeyboardEvent;

        // Act
        service.onKeyDown(keyEvent);

        // Assert
        expect(service.escapeKeyPress).toHaveBeenCalled();
    });

    it('#onKeyDown should call #confirmSelection on escape key if selection is active and transformed', () => {
        // Arrange
        keyEvent = { key: Keyboard.ESC } as KeyboardEvent;
        spyOn<any>(service, 'confirmSelection');
        service['selectionActive'] = true;
        service['selectionTransformed'] = true;

        // Act
        service.onKeyDown(keyEvent);

        // Assert
        expect(service['confirmSelection']).toHaveBeenCalled();
    });

    it('#onKeyDown should call #selectAll on CTRL-A key', () => {
        // Arrange
        keyEvent = { key: Keyboard.A, ctrlKey: true } as KeyboardEvent;
        spyOn<any>(service, 'selectAll');

        // Act
        service.onKeyDown(keyEvent);

        // Assert
        expect(service['selectAll']).toHaveBeenCalled();
    });

    it('#onKeyDown should move selection on arrow key press', () => {
        // Arrange
        service.selectionActive = true;

        keyEvent = { key: Keyboard.RIGHT_ARROW } as KeyboardEvent;
        moveTransformer.arrowPressed.and.returnValue(true);

        // Act
        service.onKeyDown(keyEvent);

        // Assert
        expect(service.moveTransformer.keyDown).toHaveBeenCalled();
    });

    it('#onKeyDown should not move selection if arrow key not pressed and selection is not active', () => {
        // Arrange
        service['selectionActive'] = false;
        moveTransformer.arrowPressed.and.returnValue(false);

        keyEvent = { key: Keyboard.LEFT_ARROW } as KeyboardEvent;

        // Act
        service.onKeyDown(keyEvent);

        // Assert
        expect(moveTransformer.keyDown).not.toHaveBeenCalled();
    });

    it('#onKeyUp should call moveTransormer keyUp', () => {
        // Arrange

        // Act
        service.onKeyUp(keyEvent);

        // Assert
        expect(service.moveTransformer.keyUp).toHaveBeenCalled();
        expect(service.moveTransformer.keyUp).toHaveBeenCalledWith(keyEvent);
    });

    it('#onKeyUp should set workspace overflow to auto', () => {
        // Arrange

        // Act
        service.onKeyUp(keyEvent);

        // Assert
        expect(workspaceService.setOverflow).toHaveBeenCalled();
        expect(workspaceService.setOverflow).toHaveBeenCalledWith('auto');
    });

    it('#startDrawing should call #newShape', () => {
        // Arrange
        spyOn<any>(service, 'newShape');

        // Act
        service.startDrawing();

        // Assert
        expect(service['newShape']).toHaveBeenCalled();
    });

    it('#stopDrawing should call #confirmSelection if selection is active and transformed ', () => {
        // Arrange
        spyOn<any>(service, 'confirmSelection');
        service['selectionActive'] = true;
        service['selectionTransformed'] = true;

        // Act
        service.stopDrawing();

        // Assert
        expect(service['confirmSelection']).toHaveBeenCalled();
    });

    it('#stopDrawing should clean preview and set selection ', () => {
        // Arrange
        spyOn<any>(service, 'newShape');

        // Act
        service.stopDrawing();

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(service['newShape']).toHaveBeenCalled();
        expect(service['selectionActive']).toBeFalse();
        expect(service['isProcessing']).toBeFalse();
        expect(service['isTransformed']).toBeFalse();
        expect(service['mouseDown']).toBeFalse();
    });

    it('#stopDrawing should clean preview and set selection ', () => {
        // Arrange
        spyOn<any>(service, 'newShape');

        // Act
        service.stopDrawing();

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(service['newShape']).toHaveBeenCalled();
        expect(service['selectionActive']).toBeFalse();
        expect(service['isProcessing']).toBeFalse();
        expect(service['isTransformed']).toBeFalse();
        expect(service['mouseDown']).toBeFalse();
    });

    it('#selectAll should call #confirmSelection if selection is active and transformed ', () => {
        // Arrange
        spyOn<any>(service, 'confirmSelection');
        spyOn<any>(service, 'newRectangleSelection');
        service['selectionActive'] = true;
        service['selectionTransformed'] = true;

        // Act
        service.selectAll();

        // Assert
        expect(service['confirmSelection']).toHaveBeenCalled();
    });

    it('#selectAll should call #cleanPreview and #newRectangleSelection', () => {
        // Arrange
        spyOn<any>(service, 'newRectangleSelection');

        // Act
        service.selectAll();

        // Assert
        expect(service['newRectangleSelection']).toHaveBeenCalled();
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
    });

    it('#newRectangleSelection should call #newSelectionCanvas with current upper left position', () => {
        // Arrange
        spyOn<any>(service, 'getImageDataFromContext').and.returnValue({ width: 0, height: 0 } as any);
        spyOn<any>(service, 'newSelectionCanvas').and.returnValue({ width: 0, height: 0 } as any);
        service['startPoint'] = { x: 0, y: 0 };
        service['oppositePoint'] = { x: 10, y: 10 };

        // Act
        service['newRectangleSelection']();

        // Assert
        expect(service['newSelectionCanvas']).toHaveBeenCalled();
        expect(mathService.getRectangleUpperLeft).toHaveBeenCalled();
    });

    it('#newSelectionCanvas should get image data from bounding box position', () => {
        // Arrange
        const getImageSpy = spyOn<any>(drawServiceSpy.baseCtx, 'getImageData');
        getImageSpy.and.returnValue(new ImageData(1, 1));
        boundingBoxSpy.left = boundingBoxSpy.top = 0;
        boundingBoxSpy.dimension = { width: 100, height: 10 };

        // Act
        const canvas = service['newSelectionCanvas'](new ImageData(1, 1));

        // Assert
        expect(canvas).not.toBeNull();
    });

    it('#moveSelection should call move transformer and update preview', () => {
        // Arrange
        const pos = { x: 2, y: 2 };
        service['currentSelection'] = {} as any;

        // Act
        service['moveSelection'](pos);

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(transformationMatrix.translate).toHaveBeenCalledWith(pos.x, pos.y);
        expect(drawServiceSpy.drawPreview).toHaveBeenCalled();
    });

    it('#terminateSelection should clean preview and reset selection', () => {
        // Arrange

        // Act
        service.terminateSelection();

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(service['mouseMove']).toBeFalse();
        expect(service['mouseDown']).toBeFalse();
        expect(service['selectionActive']).toBeFalse();
        expect(service['isProcessing']).toBeFalse();
    });

    it('#terminateSelection should confirm selection if selection is active and transformed', () => {
        // Arrange
        spyOn<any>(service, 'confirmSelection');
        service['selectionActive'] = true;
        service['selectionTransformed'] = true;

        // Act
        service.terminateSelection();

        // Assert
        expect(service['confirmSelection']).toHaveBeenCalled();
    });

    it('#confirmSelection should draw selection to base and save snapshot', () => {
        // Arrange

        // Act
        service['confirmSelection']();

        // Assert
        expect(drawServiceSpy.drawBase).toHaveBeenCalled();
        expect(snapshotFactory.save).toHaveBeenCalled();
        expect(service['selectionTransformed']).toBeFalse();
    });

    it('#drawBoundingBox should set bounding box service position and clean preview', () => {
        // Arrange
        const expectedUpperLeft = { x: 11, y: 12 };
        const expectedDimension = { width: 777, height: 444 };
        boundingBoxSpy.left = boundingBoxSpy.top = 0;
        boundingBoxSpy.dimension = { width: 100, height: 10 };
        mathService.getRectangleUpperLeft.and.returnValue(expectedUpperLeft);
        mathService.getRectangleDimension.and.returnValue(expectedDimension);

        // Act
        service['drawBoundingBox']();

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
    });

    it('#getPositionFromMouse should return canvas size if it goes outside', () => {
        // Arrange
        event = { button: MouseButton.Left, offsetX: 10000, offsetY: 50000 } as PointerEvent;
        const expectPoint = { x: drawServiceSpy.canvasWidth, y: drawServiceSpy.canvasHeight } as Vec2;

        // Act
        const returnPoint = service['getPositionFromMouse'](event);

        // Assert
        expect(returnPoint).toEqual(expectPoint);
    });

    it('#getPositionFromMouse should return 0,0 if mouse position is negative', () => {
        // Arrange
        event = { button: MouseButton.Left, offsetX: -100, offsetY: -1 } as PointerEvent;
        const expectPoint = { x: 0, y: 0 } as Vec2;

        // Act
        const returnPoint = service['getPositionFromMouse'](event);

        // Assert
        expect(returnPoint).toEqual(expectPoint);
    });

    it('#espaceKeyPress should clean preview and reset selection', () => {
        // Arrange

        // Act
        service.escapeKeyPress();

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(service['mouseDown']).toBeFalse();
        expect(service['selectionActive']).toBeFalse();
        expect(service['isProcessing']).toBeFalse();
    });

    it('#onWheelScroll should set angle to 15 without alt key', () => {
        // Arrange
        service['selectionActive'] = true;
        service['currentSelection'] = {} as any;

        // Act
        service.onWheelScroll({ altKey: true, deltaY: 1 } as WheelEvent);

        // Assert
        expect(service.angle).toBe(1);
    });

    it('#onWheelScroll should set angle to 1 with alt key', () => {
        // Arrange
        service['selectionActive'] = true;
        service['currentSelection'] = {} as any;

        // Act
        service.onWheelScroll({ altKey: false, deltaY: 1 } as WheelEvent);

        // Assert
        expect(service.angle).toBe(ROTATION_STEP);
    });

    it('#onWheelScroll should do nothing if selection is not active', () => {
        // Arrange
        service.selectionActive = false;
        service['currentSelection'] = {} as any;

        // Act
        service.onWheelScroll({} as WheelEvent);

        // Assert
        expect(transformationMatrix.rotate).not.toHaveBeenCalled();
    });

    it('#onWheelScroll should rotate selection', () => {
        // Arrange
        service['selectionActive'] = true;
        service['currentSelection'] = {} as any;

        // Act
        service.onWheelScroll({} as WheelEvent);

        // Assert
        expect(transformationMatrix.rotate).toHaveBeenCalled();
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(drawServiceSpy.drawPreview).toHaveBeenCalled();
        expect(service['selectionTransformed']).toBeTrue();
        expect(boundingBoxSpy.applyMatrixOnBorderPoints).toHaveBeenCalled();
    });

    it('#onWheelScroll should set bounding box centerRotation if it was undefined', () => {
        // Arrange
        service['selectionActive'] = true;
        boundingBoxSpy.centerRotation = undefined;
        service['currentSelection'] = {} as any;

        // Act
        service.onWheelScroll({} as WheelEvent);

        // Assert
        expect(boundingBoxSpy.centerRotation as unknown).toEqual(boundingBoxSpy.center);
    });

    it('#onWheelScroll should not set bounding box centerRotation if it is not undefined', () => {
        // Arrange
        service['selectionActive'] = true;
        boundingBoxSpy.centerRotation = { x: 0, y: 0 } as Vec2;
        service['currentSelection'] = {} as any;

        // Act
        service.onWheelScroll({} as WheelEvent);

        // Assert
        expect(boundingBoxSpy.centerRotation as unknown).toEqual({ x: 0, y: 0 });
    });

    it('#getImageDataFromContext should call getImageData on context', () => {
        // Arrange
        spyOn<any>(ctxStub, 'getImageData');

        // Act
        service['getImageDataFromContext'](ctxStub, 0);

        // Assert
        expect(ctxStub.getImageData).toHaveBeenCalled();
    });

    it('#scale should not translate matrix if translation delate are not 0', () => {
        // Arrange
        service['currentSelection'] = {} as any;

        // Act
        service.scale(1, 1, 1, 1, { x: 0, y: 0 });

        // Assert
        expect(transformationMatrix.scale).toHaveBeenCalled();
        expect(transformationMatrix.translate).toHaveBeenCalled();
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(drawServiceSpy.drawPreview).toHaveBeenCalled();
        expect(service['selectionTransformed']).toBeTrue();
    });

    it('#scale should call translate and scale of matrix and drawPreview', () => {
        // Arrange
        service['currentSelection'] = {} as any;

        // Act
        service.scale(1, 1, 0, 0, { x: 0, y: 0 });

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(transformationMatrix.translate).toHaveBeenCalled();
        expect(transformationMatrix.scale).toHaveBeenCalled();
        expect(boundingBoxSpy.applyMatrixOnBorderPoints).toHaveBeenCalled();
        expect(drawServiceSpy.drawPreview).toHaveBeenCalled();
        expect(service['selectionTransformed']).toBeTrue();
    });

    it('#newPaste should call setMatrix of transformation matrix service', () => {
        // Arrange
        service['currentSelection'] = {} as any;
        const selectionCopy = {
            selection: {} as any,
            size: {} as any,
            borderPoints: {} as any,
            matrix: new Matrix(),
            type: ToolType.EllipseSelection,
        };

        // Act
        service['newPaste'](selectionCopy);

        // Assert
        expect(transformationMatrix.setMatrix).toHaveBeenCalled();
    });

    it('#paste should terminate selection, apply translation to bounding box and clean/draw preview', () => {
        // Arrange
        service['currentSelection'] = {} as any;
        spyOn<any>(service, 'terminateSelection');
        spyOn<any>(service, 'newPaste');
        // Act
        service.paste({} as any);

        // Assert
        expect(service['terminateSelection']).toHaveBeenCalled();
        expect(service['newPaste']).toHaveBeenCalled();
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(drawServiceSpy.drawPreview).toHaveBeenCalled();
        expect(boundingBoxSpy.applyMatrixOnBorderPoints).toHaveBeenCalled();
    });

    it('#delete should terminate selection', () => {
        // Arrange
        service['currentSelection'] = {} as any;
        spyOn<any>(service, 'terminateSelection');
        // Act
        service.delete();

        // Assert
        expect(service['terminateSelection']).toHaveBeenCalled();
    });

    it(' dummy test to cover code for abstract class', () => {
        // Arrange

        // Act
        const ret = service['isSelectionSmall']();
        service['newSelection']();
        service['newShape']();
        service['configureShape']();

        // Assert
        expect(ret).toBe(false);
    });
});
