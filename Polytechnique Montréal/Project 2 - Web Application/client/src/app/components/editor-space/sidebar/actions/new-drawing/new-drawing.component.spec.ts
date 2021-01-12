import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '@app/material.module';
import { CanvasService } from '@app/services/canvas/canvas.service';
import { ShortcutHandlerService } from '@app/services/shortcut-handler/shortcut-handler.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { WorkspaceService } from '@app/services/workspace/workspace.service';
import { of } from 'rxjs';
import { NewDrawingComponent } from './new-drawing.component';

// tslint:disable:no-any

describe('NewDrawingComponent', () => {
    let component: NewDrawingComponent;
    let fixture: ComponentFixture<NewDrawingComponent>;
    let canvasService: jasmine.SpyObj<CanvasService>;
    let workspaceService: jasmine.SpyObj<WorkspaceService>;
    let confirmationDialog: jasmine.SpyObj<MatDialog>;
    let shortcutHandler: jasmine.SpyObj<ShortcutHandlerService>;
    let spyDialogRef: any;
    let snapshotFactoryService: jasmine.SpyObj<SnapshotFactoryService>;

    beforeEach(async(() => {
        spyDialogRef = jasmine.createSpy();
        spyDialogRef.afterClosed = () => of(true);

        canvasService = jasmine.createSpyObj('CanvasService', ['']);
        snapshotFactoryService = jasmine.createSpyObj('SnapshotFactoryService', ['save']);
        workspaceService = jasmine.createSpyObj('WorkspaceService', ['updateDrawingSpaceSize']);
        confirmationDialog = { ...jasmine.createSpyObj('MatDialog', ['open', 'closeAll']), openDialogs: { length: 2 } } as jasmine.SpyObj<MatDialog>;
        confirmationDialog.open.and.returnValue(spyDialogRef);

        shortcutHandler = jasmine.createSpyObj('ShortcutHandlerService', ['register']);

        TestBed.configureTestingModule({
            declarations: [NewDrawingComponent],
            providers: [
                { provide: MatDialog, useValue: confirmationDialog },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: CanvasService, useValue: canvasService },
                { provide: WorkspaceService, useValue: workspaceService },
                { provide: ShortcutHandlerService, useValue: shortcutHandler },
                { provide: SnapshotFactoryService, useValue: snapshotFactoryService },
            ],
            imports: [MatDialogModule, MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#onClickAction should open confirmation dialog if the drawing is NOT new', () => {
        // Arrange
        Object.defineProperty(canvasService, 'isEmpty', { value: false });

        // Act
        component.onClickAction();

        // Assert
        expect(confirmationDialog.open).toHaveBeenCalled();
    });

    it('#onClickAction should NOT open confirmation dialog if the drawing is new', () => {
        // Arrange
        Object.defineProperty(canvasService, 'isEmpty', { value: true });

        // Act
        component.onClickAction();

        // Assert
        expect(confirmationDialog.open).not.toHaveBeenCalled();
    });

    it('#onConfirmationClick should close confirmation dialog', () => {
        // Arrange

        // Act
        component.onConfirmationClick();

        // Assert
        expect(confirmationDialog.closeAll).toHaveBeenCalled();
    });

    it('#onConfirmationClick should call #newDrawing', () => {
        // Arrange
        spyOn(component, 'newDrawing');

        // Act
        component.onConfirmationClick();

        // Assert
        expect(component.newDrawing).toHaveBeenCalled();
    });

    it('should call workspace service on #newDrawing to update drawing size', () => {
        // Arrange

        // Act
        component.newDrawing();

        // Assert
        expect(workspaceService.updateDrawingSpaceSize).toHaveBeenCalled();
    });

    it('should NOT trigger action (new drawing) when invalid shortcut is pressed', () => {
        // Arrange
        spyOn(component, 'onClickAction');
        const keyEvent: KeyboardEvent = new KeyboardEvent('keydown', { ctrlKey: false, key: 'o' });

        // Act
        document.dispatchEvent(keyEvent);
        fixture.detectChanges();

        // Assert
        expect(component.onClickAction).not.toHaveBeenCalled();
    });

    it('#newDrawingAction should call #onClickAction if openDialog length is above 0', () => {
        // Arrange
        spyOn<any>(component, 'onClickAction');

        // Act
        component.newDrawingAction();

        // Assert
        expect(component.onClickAction).not.toHaveBeenCalled();
    });

    it('#newDrawingAction should call #onClickAction if openDialog length is less or equal 0', () => {
        // Arrange
        const spy = spyOn<any>(component, 'onClickAction');
        spyOn<any>(confirmationDialog, 'openDialogs').and.returnValue({ length: 0 });

        // Act
        component.newDrawingAction();

        // Assert
        expect(spy).toHaveBeenCalled();
    });
});
