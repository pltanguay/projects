import { TestBed } from '@angular/core/testing';
import { Action } from '@app/classes/undo-redo/action/action';
import { LocalStorageService } from '@app/services/local-storage/local-storage.service';
import { UndoRedoService } from './undo-redo.service';
// tslint:disable: no-string-literal
// tslint:disable: no-any

describe('UndoRedoService', () => {
    let service: UndoRedoService;
    let action: jasmine.SpyObj<Action>;
    let localStorageService: jasmine.SpyObj<LocalStorageService>;

    beforeEach(() => {
        action = jasmine.createSpyObj<Action>('Action', ['execute']);
        localStorageService = jasmine.createSpyObj('LocalStorageService', ['save']);

        TestBed.configureTestingModule({
            providers: [{ provide: LocalStorageService, useValue: localStorageService }],
        });

        service = TestBed.inject(UndoRedoService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#saveInitialAction should set #initialAction', () => {
        // Arrange

        // Act
        service.saveInitialAction(action);

        // Assert
        expect(service['initialAction']).toBe(action);
    });

    it('#save should push the action to be saved in actionsDone', () => {
        // Arrange

        // Act
        service.save(action);

        // Assert
        expect(service['actionsDone'].pop()).toBe(action);
    });

    it('#canUndo checks if there are actions done', () => {
        // Arrange
        service['actionsDone'].push(action);

        // Act
        const result: boolean = service.canUndo();

        // Assert
        expect(result).toBe(true);
    });

    it('#canRedo checks if there are actions undone', () => {
        // Arrange
        service['actionsUndone'].push(action);

        // Act
        const result: boolean = service.canRedo();

        // Assert
        expect(result).toBe(true);
    });

    it('#undo should return when #canUndo return false', () => {
        // Arrange
        spyOn(service, 'refresh' as any);

        // Act
        service.undo();

        // Assert
        expect(service['refresh']).not.toHaveBeenCalled();
    });

    it('#undo should #refresh when #canUndo return true', () => {
        // Arrange
        spyOn(service, 'refresh' as any);
        service['actionsDone'].push(action);

        // Act
        service.undo();

        // Assert
        expect(service['refresh']).toHaveBeenCalled();
    });

    it('#redo should return when #canRedo return false', () => {
        // Arrange
        spyOn(service, 'refresh' as any);

        // Act
        service.redo();

        // Assert
        expect(service['refresh']).not.toHaveBeenCalled();
    });

    it('#redo should #refresh when #canRedo return true', () => {
        // Arrange
        spyOn(service, 'refresh' as any);
        service['actionsUndone'].push(action);

        // Act
        service.redo();

        // Assert
        expect(service['refresh']).toHaveBeenCalled();
    });

    it('#redo should #refresh when #canRedo return true', () => {
        // Arrange
        spyOn(service, 'refresh' as any);
        service['actionsUndone'].push(action);

        // Act
        service.redo();

        // Assert
        expect(service['refresh']).toHaveBeenCalled();
    });

    it('#reset should reset actionsDone and actionsUndone', () => {
        // Arrange
        service['actionsUndone'].push(action);
        service['actionsDone'].push(action);

        // Act
        service.reset();

        // Assert
        expect(service['actionsUndone'].length).toBe(0);
        expect(service['actionsDone'].length).toBe(0);
    });

    it('#refresh should call the initial action and the actions done ', () => {
        // Arrange
        const actionDone = jasmine.createSpyObj<Action>('Action', ['execute']);
        service['actionsDone'].push(actionDone);
        service['initialAction'] = action;

        // Act
        service['refresh']();

        // Assert
        expect(action.execute).toHaveBeenCalled();
        expect(actionDone.execute).toHaveBeenCalled();
    });
});
