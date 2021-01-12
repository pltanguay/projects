import { TestBed } from '@angular/core/testing';
import { Matrix } from '@app/classes/matrix/matrix';
import { EllipseSelection } from '@app/classes/selection-shape/selection/ellipse-selection/ellipse-selection';
import { Selection } from '@app/classes/selection-shape/selection/selection';
import { MementoType } from '@app/classes/undo-redo/memento/memento';
import { ToolType } from '@app/declarations/tool-declarations';
import { AlertService } from '@app/services/alert/alert.service';
import { SelectionCopy } from '@app/services/clipboard/clipboard.service';
import { BoundingBoxService } from '@app/services/tools/selection/bounding-box/bounding-box.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { TransformationMatrixService } from '@app/services/tools/selection/transformer/transformation-matrix.service';
import { ClipboardService } from './clipboard.service';

// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('ClipboardService', () => {
    let service: ClipboardService;
    let boundingBox: jasmine.SpyObj<BoundingBoxService>;
    let selService: jasmine.SpyObj<SelectionService>;
    let selection: jasmine.SpyObj<EllipseSelection>;
    let transformationMatrixS: jasmine.SpyObj<TransformationMatrixService>;
    let alert: jasmine.SpyObj<AlertService>;

    beforeEach(() => {
        boundingBox = jasmine.createSpyObj('BoundingBoxService', ['']);
        transformationMatrixS = { ...jasmine.createSpyObj('TransformationMatrixService', ['']), matrix: new Matrix() };
        selection = { ...jasmine.createSpyObj('EllipseSelection', ['']), matrix: new Matrix(), type: MementoType.Draw };
        selService = {
            ...jasmine.createSpyObj('SelectionService', ['paste', 'delete']),
            currentSelection: selection,
            selectionActive: true,
            type: ToolType.EllipseSelection,
        };
        alert = { ...jasmine.createSpyObj('AlertService', ['showSnackBarAlert']) };

        TestBed.configureTestingModule({});

        service = new ClipboardService(boundingBox, transformationMatrixS, alert);
        service.selectionService = selService;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#cut should do nothing if selection is disabled', () => {
        // Arrange
        spyOn<any>(service, 'clear');
        service.selectionService.selectionActive = false;

        // Act
        service.cut();

        // Assert
        expect(service.selectionService.delete).not.toHaveBeenCalled();
    });

    it('#copy should do nothing if selection is disabled', () => {
        // Arrange
        spyOn<any>(service, 'clear');
        service.selectionService.selectionActive = false;

        // Act
        service.copy();

        // Assert
        expect(service['clear']).not.toHaveBeenCalled();
    });

    it('#delete should do nothing if selection is disabled', () => {
        // Arrange
        service.selectionService.selectionActive = false;

        // Act
        service.delete();

        // Assert
        expect(service.selectionService.delete).not.toHaveBeenCalled();
    });

    it('#paste should show alert if current selection tool type is different than saved selection type', () => {
        // Arrange
        service['clipboard'].push({
            selection: {} as Selection,
            borderPoints: new Set(),
            matrix: {} as Matrix,
            type: ToolType.RectangleSelection,
        });

        // Act
        service.paste();

        // Assert
        expect(service.selectionService.paste).not.toHaveBeenCalled();
        expect(alert.showSnackBarAlert).toHaveBeenCalled();
    });

    it('#clear should clear clipboard array', () => {
        // Arrange
        service['clipboard'] = [{} as SelectionCopy];

        // Act
        service['clear']();

        // Assert
        expect(service['clipboard'].length).toEqual(0);
    });

    it('#cut should call clear and selection delete and push a selection to clipboard array', () => {
        // Arrange
        spyOn<any>(service, 'clear');
        spyOn<any>(service['clipboard'], 'push');

        // Act
        service.cut();

        // Assert
        expect(service['clipboard'].push).toHaveBeenCalled();
        expect(service['clear']).toHaveBeenCalled();
        expect(service.selectionService.delete).toHaveBeenCalled();
    });

    it('#copy should call clear and push a selection to clipboard array', () => {
        // Arrange
        spyOn<any>(service, 'clear');
        spyOn<any>(service['clipboard'], 'push');

        // Act
        service.copy();

        // Assert
        expect(service['clipboard'].push).toHaveBeenCalled();
        expect(service['clear']).toHaveBeenCalled();
    });

    it('#paste should call selection paste', () => {
        // Arrange
        service['clipboard'].push({
            selection: {} as Selection,
            borderPoints: new Set(),
            matrix: {} as Matrix,
            type: ToolType.EllipseSelection,
        });
        service.selectionService.selectionActive = true;

        // Act
        service.paste();

        // Assert
        expect(service.selectionService.paste).toHaveBeenCalled();
    });

    it('#delete should call selection delete', () => {
        // Arrange

        // Act
        service.delete();

        // Assert
        expect(service.selectionService.delete).toHaveBeenCalled();
    });

    it('#empty should return true if clipboard array is empty', () => {
        // Arrange
        service['clipboard'] = [];

        // Act
        const empty = service.empty;

        // Assert
        expect(empty).toBeTrue();
    });
});
