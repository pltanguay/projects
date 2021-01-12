import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DashedRectangle } from '@app/classes/contour-shape/rectangle/dashed-rectangle';
import { Matrix } from '@app/classes/matrix/matrix';
import { RectangleSelection } from '@app/classes/selection-shape/selection/rectangle-selection/rectangle-selection';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { Keyboard } from '@app/declarations/keyboard.enum';
import { ToolType } from '@app/declarations/tool-declarations';
import { SelectionCopy } from '@app/services/clipboard/clipboard.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MathUtilsService } from '@app/services/mathematic/math-utils.service';
import { SnapToGridService } from '@app/services/snap-to-grid/snap-to-grid.service';
import { TransformationMatrixService } from '@app/services/tools/selection//transformer/transformation-matrix.service';
import { BoundingBoxService } from '@app/services/tools/selection/bounding-box/bounding-box.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { WorkspaceService } from '@app/services/workspace/workspace.service';
import { RectangleSelectionService } from './rectangle-selection.service';

// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:no-max-line
describe('RectangleSelectionService', () => {
    let service: RectangleSelectionService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let snapshotFactory: jasmine.SpyObj<SnapshotFactoryService>;
    let boundingBoxSpy: jasmine.SpyObj<BoundingBoxService>;
    let mathService: jasmine.SpyObj<MathUtilsService>;
    let workspaceService: jasmine.SpyObj<WorkspaceService>;
    let transformationMatrix: jasmine.SpyObj<TransformationMatrixService>;
    let selection: jasmine.SpyObj<RectangleSelection>;
    let keyEvent: KeyboardEvent;
    let snapGrid: jasmine.SpyObj<SnapToGridService>;

    mathService = jasmine.createSpyObj('MathUtilsService', ['getRectangleUpperLeft', 'getRectangleDimension']);
    mathService.getRectangleUpperLeft.and.returnValue({ x: 0, y: 0 });

    snapshotFactory = jasmine.createSpyObj('SnapshotFactoryService', ['save']);

    drawServiceSpy = {
        ...jasmine.createSpyObj('DrawingService', ['cleanPreview', 'drawPreview', 'drawBase']),
        canvasWidth: 0,
        canvasHeight: 0,
    } as jasmine.SpyObj<DrawingService>;

    boundingBoxSpy = jasmine.createSpyObj('BoundingBoxService', ['']);

    workspaceService = jasmine.createSpyObj('WorkspaceService', ['setOverflow']);

    transformationMatrix = jasmine.createSpyObj('TransformationMatrixService', ['rotate', 'translate', 'scale', 'setMatrix']);
    snapGrid = jasmine.createSpyObj('SnapToGridService', ['getNearestPointTranslation', 'getArrowTranslationPoint']);
    selection = {
        ...jasmine.createSpyObj('RectangleSelection', ['']),
        selectionCanvas: canvasTestHelper.selectionCanvas,
        upperLeft: { x: 0, y: 0 },
        matrix: new Matrix(),
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatSnackBarModule],
        });

        service = new RectangleSelectionService(
            drawServiceSpy,
            snapshotFactory,
            boundingBoxSpy,
            mathService,
            workspaceService,
            transformationMatrix,
            snapGrid,
        );

        keyEvent = { key: Keyboard.LEFT_ARROW } as KeyboardEvent;
        service['currentSelection'] = selection;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onKeyDown should do translate selection if it is not active and arrow key not pressed', () => {
        // Arrange
        keyEvent = { key: Keyboard.A } as KeyboardEvent;
        service.selectionActive = false;
        spyOn<any>(service.moveTransformer, 'keyDown');

        // Act
        service.onKeyDown(keyEvent);

        // Assert
        expect(service.moveTransformer.keyDown).not.toHaveBeenCalled();
    });

    it('#onKeyDown should translate current active selection when arrow key is pressed', () => {
        // Arrange
        spyOn(service.moveTransformer, 'keyDown');
        service.selectionActive = true;

        // Act
        service.onKeyDown(keyEvent);

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(service.moveTransformer.keyDown).toHaveBeenCalled();
        expect(service['selectionTransformed']).toBeTrue();
        expect(drawServiceSpy.drawPreview).toHaveBeenCalled();
    });

    it('#newSelection should call super newRectangleSelection', () => {
        // Arrange
        spyOn<any>(service, 'newRectangleSelection');

        // Act
        service['newSelection']();

        // Assert
        expect(service['newRectangleSelection']).toHaveBeenCalled();
    });

    it('#isSelectionSmall should return false if selection size if greater than threshold', () => {
        // Arrange
        spyOn<any>(service, 'newSelection');
        spyOn<any>(service, 'newRectangleSelection');
        service['currentShape'] = new DashedRectangle(1, '', '', false, false);
        (service['currentShape'] as DashedRectangle).dimension = { width: 100, height: 100 };

        // Act
        const ret = service['isSelectionSmall']();

        // Assert
        expect(ret).toBeFalse();
    });

    it('#isSelectionSmall should return true if selection size if smaller than threshold', () => {
        // Arrange
        spyOn<any>(service, 'newSelection');
        spyOn<any>(service, 'newRectangleSelection');
        service['currentShape'] = new DashedRectangle(1, '', '', false, false);
        (service['currentShape'] as DashedRectangle).dimension = { width: 0, height: 1 };

        // Act
        const ret = service['isSelectionSmall']();

        // Assert
        expect(ret).toBeTrue();
    });

    it('#configureShape should set selection preview upperleft and dimension', () => {
        // Arrange
        service['currentShape'] = new DashedRectangle(1, '', '', false, false);
        const upperLeft = { x: 10, y: 10 };
        const dimension = { width: 100, height: 100 };
        mathService.getRectangleUpperLeft.and.returnValue(upperLeft);
        mathService.getRectangleDimension.and.returnValue(dimension);

        // Act
        service['configureShape']();

        // Assert
        expect((service['currentShape'] as DashedRectangle).upperLeft).toEqual(upperLeft);
        expect((service['currentShape'] as DashedRectangle).dimension).toEqual(dimension);
    });

    it('#newPaste should create new rectangle selection with old saved selection', () => {
        // Arrange
        const selectionCopy = {
            selection,
            size: { width: 500, height: 300 },
            borderPoints: new Set(),
            matrix: new Matrix(),
            type: ToolType.RectangleSelection,
        } as SelectionCopy;
        spyOn<any>(SelectionService.prototype, 'newPaste');

        // Act
        service['newPaste'](selectionCopy);

        // Assert
        expect(service['currentSelection']).toBeTruthy();
        expect(SelectionService.prototype['newPaste']).toHaveBeenCalled();
    });
});
