import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DashedEllipse } from '@app/classes/contour-shape/ellipse/dashed-ellipse';
import { Matrix } from '@app/classes/matrix/matrix';
import { EllipseSelection } from '@app/classes/selection-shape/selection/ellipse-selection/ellipse-selection';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { Keyboard } from '@app/declarations/keyboard.enum';
import { ToolType } from '@app/declarations/tool-declarations';
import { SelectionCopy } from '@app/services/clipboard/clipboard.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MathUtilsService } from '@app/services/mathematic/math-utils.service';
import { SnapToGridService } from '@app/services/snap-to-grid/snap-to-grid.service';
import { BoundingBoxService } from '@app/services/tools/selection/bounding-box/bounding-box.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { TransformationMatrixService } from '@app/services/tools/selection/transformer/transformation-matrix.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { WorkspaceService } from '@app/services/workspace/workspace.service';
import { EllipseSelectionService } from './ellipse-selection.service';
// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:no-max-line
describe('EllipseSelectionService', () => {
    let service: EllipseSelectionService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let snapshotFactory: jasmine.SpyObj<SnapshotFactoryService>;
    let boundingBoxSpy: jasmine.SpyObj<BoundingBoxService>;
    let mathService: jasmine.SpyObj<MathUtilsService>;
    let workspaceService: jasmine.SpyObj<WorkspaceService>;
    let selection: jasmine.SpyObj<EllipseSelection>;
    let transformationMatrix: jasmine.SpyObj<TransformationMatrixService>;
    let snapGrid: jasmine.SpyObj<SnapToGridService>;

    let keyEvent: KeyboardEvent;

    beforeEach(() => {
        mathService = jasmine.createSpyObj('MathUtilsService', ['getRectangleUpperLeft', 'getCenterShape', 'getRadiusEllipse']);
        mathService.getRectangleUpperLeft.and.returnValue({ x: 0, y: 0 });

        snapshotFactory = jasmine.createSpyObj('SnapshotFactoryService', ['save']);

        drawServiceSpy = {
            ...jasmine.createSpyObj('DrawingService', ['cleanPreview', 'drawPreview', 'drawBase']),
            canvasWidth: 0,
            canvasHeight: 0,
        } as jasmine.SpyObj<DrawingService>;

        boundingBoxSpy = jasmine.createSpyObj('BoundingBoxService', ['']);
        boundingBoxSpy.left = boundingBoxSpy.top = 0;
        boundingBoxSpy.dimension = { width: 100, height: 100 };

        workspaceService = jasmine.createSpyObj('WorkspaceService', ['setOverflow']);

        transformationMatrix = jasmine.createSpyObj('TransformationMatrixService', ['rotate', 'translate', 'scale', 'init']);
        snapGrid = jasmine.createSpyObj('SnapToGridService', ['getNearestPointTranslation', 'getArrowTranslationPoint']);
        selection = {
            ...jasmine.createSpyObj('RectangleSelection', ['']),
            selectionCanvas: canvasTestHelper.selectionCanvas,
            upperLeft: { x: 0, y: 0 },
            matrix: new Matrix(),
        };
        TestBed.configureTestingModule({
            imports: [MatSnackBarModule],
        });

        service = new EllipseSelectionService(
            drawServiceSpy,
            snapshotFactory,
            boundingBoxSpy,
            mathService,
            workspaceService,
            transformationMatrix,
            snapGrid,
        );

        keyEvent = { key: Keyboard.RIGHT_ARROW } as KeyboardEvent;
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

    it('#newSelection should update ellipse selection position and call #newSelectionCanvas', () => {
        // Arrange
        const center = { x: 20, y: 20 };
        const radius = { rx: 5, ry: 10 };
        const upperLeft = { x: 0, y: 0 };
        mathService.getCenterShape.and.returnValue(center);
        mathService.getRadiusEllipse.and.returnValue(radius);
        mathService.getRectangleUpperLeft.and.returnValue(upperLeft);
        spyOn<any>(service, 'newSelectionCanvas').and.returnValue({ width: 5, hight: 5 } as any);
        spyOn<any>(service, 'getImageDataFromContext').and.returnValue(({ width: 5, hight: 5 } as unknown) as ImageData);

        // Act
        service['newSelection']();

        // Assert
        expect(service['newSelectionCanvas']).toHaveBeenCalled();
        expect((service['currentSelection'] as EllipseSelection)['center']).toEqual(center);
        expect((service['currentSelection'] as EllipseSelection).upperLeft).toEqual(upperLeft);
    });

    it('#isSelectionSmall should return false if selection size if greater than threshold', () => {
        // Arrange
        spyOn<any>(service, 'newSelection');
        spyOn<any>(service, 'newRectangleSelection');
        service['currentShape'] = new DashedEllipse(1, '', '', false, false);
        (service['currentShape'] as DashedEllipse).radius = { rx: 10000, ry: 10000 };

        // Act
        const ret = service['isSelectionSmall']();

        // Assert
        expect(ret).toBeFalse();
    });

    it('#isSelectionSmall should return true if selection radius is less than threshold', () => {
        // Arrange
        service['currentShape'] = new DashedEllipse(1, '', '', false, false);
        (service['currentShape'] as DashedEllipse).radius = { rx: 0, ry: 0 };

        // Act
        const ret = service['isSelectionSmall']();

        // Assert
        expect(ret).toBeTrue();
    });

    it('#configureShape should set selection preview upperleft and dimension', () => {
        // Arrange
        service['currentShape'] = new DashedEllipse(1, '', '', false, false);
        const center = { x: 10, y: 10 };
        const radius = { rx: 100, ry: 100 };
        mathService.getCenterShape.and.returnValue(center);
        mathService.getRadiusEllipse.and.returnValue(radius);

        // Act
        service['configureShape']();

        // Assert
        expect((service['currentShape'] as DashedEllipse).center).toEqual(center);
        expect((service['currentShape'] as DashedEllipse).radius).toEqual(radius);
    });

    it('#newPaste should create new ellipse selection with old saved selection', () => {
        // Arrange
        const selectionCopy = {
            selection,
            size: { width: 500, height: 400 },
            borderPoints: new Set(),
            matrix: new Matrix(),
            type: ToolType.EllipseSelection,
        } as SelectionCopy;

        spyOn<any>(SelectionService.prototype, 'newPaste');

        // Act
        service['newPaste'](selectionCopy);

        // Assert
        expect(service['currentSelection']).toBeTruthy();
        expect(SelectionService.prototype['newPaste']).toHaveBeenCalled();
    });
});
