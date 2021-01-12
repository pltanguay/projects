import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppModule } from '@app/app.module';
import { InitialMemento } from '@app/classes/undo-redo/memento/initial-memento';
import { CanvasLoaderService } from '@app/services/canvas/canvas-loader/canvas-loader.service';
import { ShortcutHandlerService } from '@app/services/shortcut-handler/shortcut-handler.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { of } from 'rxjs';
import { EntryPointComponent } from './entry-point.component';

// tslint:disable:no-string-literal
// tslint:disable:no-any

describe('EntryPointComponent', () => {
    let component: EntryPointComponent;
    let fixture: ComponentFixture<EntryPointComponent>;
    let matDialog: jasmine.SpyObj<MatDialog>;
    let spyDialogRef: any;
    let snapshotFactoryService: jasmine.SpyObj<SnapshotFactoryService>;
    let canvasLoader: jasmine.SpyObj<CanvasLoaderService>;
    let shortcutHandler: jasmine.SpyObj<ShortcutHandlerService>;

    beforeEach(async(() => {
        spyDialogRef = jasmine.createSpy();
        spyDialogRef.afterClosed = () => of(true);

        matDialog = { ...jasmine.createSpyObj('MatDialog', ['open']), openDialogs: { length: 2 } } as jasmine.SpyObj<MatDialog>;
        matDialog.open.and.returnValue(spyDialogRef);

        snapshotFactoryService = jasmine.createSpyObj('SnapshotFactoryService', ['save']);
        canvasLoader = jasmine.createSpyObj('CanvasLoaderService', ['openDrawing']);
        shortcutHandler = jasmine.createSpyObj('ShortcutHandlerService', ['register']);

        TestBed.configureTestingModule({
            declarations: [EntryPointComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialog, useValue: matDialog },
                { provide: SnapshotFactoryService, useValue: snapshotFactoryService },
                { provide: CanvasLoaderService, useValue: canvasLoader },
                { provide: ShortcutHandlerService, useValue: shortcutHandler },
            ],
            imports: [AppModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EntryPointComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#openUserGuideDialog should open user guide dialog', () => {
        // Arrange

        // Act
        component.openUserGuideDialog();

        // Assert
        expect(matDialog.open).toHaveBeenCalled();
    });

    it('#openCarouselDialog should open carousel dialog', () => {
        // Arrange

        // Act
        component.openCarouselDialog();

        // Assert
        expect(matDialog.open).toHaveBeenCalled();
    });

    it('#openCarouselAction should call #onClickAction if openDialog length is above 0', () => {
        // Arrange
        spyOn<any>(component, 'openCarouselDialog');

        // Act
        component['openCarouselAction']();

        // Assert
        expect(component.openCarouselDialog).not.toHaveBeenCalled();
    });

    it('#openCarouselAction should call #onClickAction if openDialog length is less or equal 0', () => {
        // Arrange
        const spy = spyOn<any>(component, 'openCarouselDialog');
        spyOn<any>(matDialog, 'openDialogs').and.returnValue({ length: 0 });

        // Act
        component['openCarouselAction']();

        // Assert
        expect(spy).toHaveBeenCalled();
    });

    it('#openLastDrawing should call #openDrawing and save action', fakeAsync(() => {
        // Arrange
        const momento: InitialMemento = {} as InitialMemento;
        canvasLoader.openDrawing.and.returnValue(of(momento));
        component.storageData = 'Test';

        // Act
        component.openLastDrawing();
        tick();

        // Assert
        expect(snapshotFactoryService.save).toHaveBeenCalled();
    }));
});
