import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@app/material.module';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { UndoRedoComponent } from './undo-redo.component';

describe('UndoRedoComponent', () => {
    let component: UndoRedoComponent;
    let fixture: ComponentFixture<UndoRedoComponent>;
    let undoRedoService: jasmine.SpyObj<UndoRedoService>;
    let toolSelectService: jasmine.SpyObj<ToolSelectNotifierService>;

    beforeEach(async(() => {
        const tool = {
            ...jasmine.createSpyObj('Tool', ['']),
            isProcessing: true,
        };

        toolSelectService = { ...jasmine.createSpyObj('ToolSelectNotifierService', ['']), currentTool: tool };
        undoRedoService = jasmine.createSpyObj('UndoRedoService', ['canUndo', 'canRedo', 'undo', 'redo']);

        TestBed.configureTestingModule({
            declarations: [UndoRedoComponent],
            imports: [MaterialModule],
            providers: [
                { provide: UndoRedoService, useValue: undoRedoService },
                { provide: ToolSelectNotifierService, useValue: toolSelectService },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UndoRedoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#ngDoCheck should update properties when there is change', () => {
        // Arrange
        component.canRedo = true;
        component.canUndo = true;
        undoRedoService.canUndo.and.returnValue(false);
        undoRedoService.canRedo.and.returnValue(false);

        // Act
        component.ngDoCheck();

        // Assert
        expect(component.canUndo).toBe(false);
        expect(component.canRedo).toBe(false);
    });

    it('#ngDoCheck should not update properties when there is no change', () => {
        // Arrange
        component.canRedo = true;
        component.canUndo = true;
        undoRedoService.canUndo.and.returnValue(true);
        undoRedoService.canRedo.and.returnValue(true);

        // Act
        component.ngDoCheck();

        // Assert
        expect(component.canUndo).toBe(true);
        expect(component.canRedo).toBe(true);
    });

    it('#onUndoClick should call #undo on service', () => {
        // Arrange

        // Act
        component.onUndoClick();

        // Assert
        expect(undoRedoService.undo).toHaveBeenCalled();
    });

    it('#onRedoClick should call #redo on service', () => {
        // Arrange

        // Act
        component.onRedoClick();

        // Assert
        expect(undoRedoService.redo).toHaveBeenCalled();
    });
});
