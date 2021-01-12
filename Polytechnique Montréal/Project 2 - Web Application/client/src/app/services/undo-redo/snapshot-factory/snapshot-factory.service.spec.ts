import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Action } from '@app/classes/undo-redo/action/action';
import { InitialMemento } from '@app/classes/undo-redo/memento/initial-memento';
import { MementoType } from '@app/classes/undo-redo/memento/memento';
import { ResizeMemento } from '@app/classes/undo-redo/memento/resize-memento';
import { CanvasService } from '@app/services/canvas/canvas.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LocalStorageService } from '@app/services/local-storage/local-storage.service';
import { ResizeService } from '@app/services/resize/resize.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Size } from '@app/services/workspace/workspace.service';
import { SnapshotFactoryService } from './snapshot-factory.service';
// tslint:disable: no-string-literal
// tslint:disable: no-any

describe('SnapshotFactoryService', () => {
    let service: SnapshotFactoryService;
    let undoRedoService: jasmine.SpyObj<UndoRedoService>;
    let drawService: jasmine.SpyObj<DrawingService>;
    let resizeService: jasmine.SpyObj<ResizeService>;
    let canvasService: jasmine.SpyObj<CanvasService>;
    let localStorageService: jasmine.SpyObj<LocalStorageService>;
    let action: jasmine.SpyObj<Action>;

    beforeEach(() => {
        undoRedoService = jasmine.createSpyObj('UndoRedoService', ['save', 'saveInitialAction']);
        drawService = jasmine.createSpyObj('DrawingService', ['reDrawBase']);
        resizeService = jasmine.createSpyObj('ResizeService', ['resize']);
        localStorageService = jasmine.createSpyObj('LocalStorageService', ['save']);
        canvasService = jasmine.createSpyObj('CanvasService', ['setBackgroundColorWhite', 'putImageData']);

        TestBed.configureTestingModule({
            providers: [
                { provide: UndoRedoService, useValue: undoRedoService },
                { provide: DrawingService, useValue: drawService },
                { provide: ResizeService, useValue: resizeService },
                { provide: CanvasService, useValue: canvasService },
                { provide: LocalStorageService, useValue: localStorageService },
            ],
            imports: [MatSnackBarModule],
        });
        service = TestBed.inject(SnapshotFactoryService);

        const canvasStub = document.createElement('canvas');
        canvasService.canvas = canvasStub;
        localStorageService.save.and.callThrough();

        action = jasmine.createSpyObj('Action', ['']);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#save a memento with type Initial should #buildInitialAction ', () => {
        // Arrange
        const initialMemento = {
            ...jasmine.createSpyObj('InitialMemento', ['']),
            type: MementoType.Initial,
        };
        spyOn(service, 'buildInitialAction' as any).and.returnValue(action);

        // Act
        service.save(initialMemento);

        // Assert
        expect(service['buildInitialAction']).toHaveBeenCalledWith(initialMemento);
        expect(undoRedoService.saveInitialAction).toHaveBeenCalledWith(action);
    });

    it('#save a memento with type Draw should #buildDrawAction ', () => {
        // Arrange
        const drawMemento = {
            ...jasmine.createSpyObj('DrawableObject', ['']),
            type: MementoType.Draw,
        };

        spyOn(service, 'buildDrawAction' as any).and.returnValue(action);

        // Act
        service.save(drawMemento);

        // Assert
        expect(service['buildDrawAction']).toHaveBeenCalledWith(drawMemento);
        expect(undoRedoService.save).toHaveBeenCalledWith(action);
    });

    it('#save a memento with type Resize should #buildResizeAction ', () => {
        // Arrange
        const resizeMemento = {
            ...jasmine.createSpyObj('ResizeMemento', ['']),
            type: MementoType.Resize,
        };
        spyOn(service, 'buildResizeAction' as any).and.returnValue(action);

        // Act
        service.save(resizeMemento);

        // Assert
        expect(service['buildResizeAction']).toHaveBeenCalledWith(resizeMemento);
        expect(undoRedoService.save).toHaveBeenCalledWith(action);
    });

    it('#buildInitialAction should build Initial action (RESIZE) ', () => {
        // Arrange
        const size: Size = jasmine.createSpyObj('Size', ['']);
        const initialMemento = new InitialMemento(size);

        // Act
        const initialAction = service['buildInitialAction'](initialMemento);
        initialAction.execute();

        // Assert
        expect(canvasService.setBackgroundColorWhite).toHaveBeenCalled();
        expect(resizeService.resize).toHaveBeenCalled();
    });

    it('#buildInitialAction should build Initial action (CAROUSEL IMAGE LOAD) ', () => {
        // Arrange
        const size = jasmine.createSpyObj('Size', ['']);
        const imageData = jasmine.createSpyObj('ImageData', ['']);
        const initialMemento = new InitialMemento(size, imageData);

        // Act
        const initialAction = service['buildInitialAction'](initialMemento);
        initialAction.execute();

        // Assert
        expect(canvasService.putImageData).toHaveBeenCalledWith(imageData);
        expect(resizeService.resize).toHaveBeenCalled();
    });

    it('#buildDrawAction should redraw on base canvas ', () => {
        // Arrange
        const drawable = jasmine.createSpyObj('DrawableObject', ['']);

        // Act
        const drawAction = service['buildDrawAction'](drawable);
        drawAction.execute();

        // Assert
        expect(drawService.reDrawBase).toHaveBeenCalledWith(drawable);
    });

    it('#buildDrawAction should redraw on base canvas ', () => {
        // Arrange
        const width = Math.random();
        const height = Math.random();
        const resizeMemento = new ResizeMemento(width, height);

        // Act
        const resizeAction = service['buildResizeAction'](resizeMemento);
        resizeAction.execute();

        // Assert
        expect(resizeService.resize).toHaveBeenCalled();
        expect(resizeService.width).toBe(width);
        expect(resizeService.height).toBe(height);
    });
});
