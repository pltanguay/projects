import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InitialMemento } from '@app/classes/undo-redo/memento/initial-memento';
import { BrowserRefresh } from '@app/classes/utils/browser-refresh';
import { CanvasLoaderService } from '@app/services/canvas/canvas-loader/canvas-loader.service';
import { CanvasService } from '@app/services/canvas/canvas.service';
import { LocalStorageService } from '@app/services/local-storage/local-storage.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { Size, WorkspaceService } from '@app/services/workspace/workspace.service';
import { of } from 'rxjs';
import { BaseCanvasComponent } from './base-canvas.component';

// tslint:disable:no-string-literal
// tslint:disable:no-any

describe('BaseCanvasComponent', () => {
    let component: BaseCanvasComponent;
    let fixture: ComponentFixture<BaseCanvasComponent>;
    let workspaceService: jasmine.SpyObj<WorkspaceService>;
    let baseCanvasService: jasmine.SpyObj<CanvasService>;
    let snapshotFactoryService: jasmine.SpyObj<SnapshotFactoryService>;
    let localStorageService: jasmine.SpyObj<LocalStorageService>;
    let canvasLoaderService: jasmine.SpyObj<CanvasLoaderService>;
    let browserspy: jasmine.SpyObj<BrowserRefresh>;

    beforeEach(async(() => {
        workspaceService = jasmine.createSpyObj('WorkspaceService', ['getNewDrawingSize']);
        workspaceService.getNewDrawingSize.and.returnValue(of({ width: 600, height: 560 }));

        browserspy = jasmine.createSpyObj('BrowserRefresh', ['hasRefreshed']);
        canvasLoaderService = jasmine.createSpyObj('CanvasLoaderService', ['openDrawing']);
        localStorageService = jasmine.createSpyObj('LocalStorageService', ['save', 'getItem']);
        snapshotFactoryService = jasmine.createSpyObj('SnapshotFactoryService', ['save']);
        baseCanvasService = jasmine.createSpyObj('WorkspaceService', ['setSize', 'setCanvas', 'setBackgroundColorWhite']);

        const momento: InitialMemento = {} as InitialMemento;
        canvasLoaderService.openDrawing.and.returnValue(of(momento));

        TestBed.configureTestingModule({
            declarations: [BaseCanvasComponent],
            providers: [
                { provide: BrowserRefresh, useValue: browserspy },
                { provide: LocalStorageService, useValue: localStorageService },
                { provide: CanvasLoaderService, useValue: canvasLoaderService },
                { provide: WorkspaceService, useValue: workspaceService },
                { provide: CanvasService, useValue: baseCanvasService },
                { provide: SnapshotFactoryService, useValue: snapshotFactoryService },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BaseCanvasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should subscribe to new drawing notification from workspace service after view init', () => {
        // Arrange

        // Act
        component.ngAfterViewInit();

        // Assert
        expect(workspaceService.getNewDrawingSize).toHaveBeenCalled();
    });

    it('should #setSize on new drawing notification', () => {
        // Arrange
        const size: Size = { width: 1000, height: 1000 };
        // Act
        workspaceService.getNewDrawingSize.and.returnValue(of(size));
        component['subscribeNewDrawingSize']();

        // Assert
        expect(baseCanvasService.setSize).toHaveBeenCalled();
        expect(baseCanvasService.setSize).toHaveBeenCalledWith(size.width, size.height);
    });

    it('#openLastDrawing should call #openDrawing and save action', () => {
        // Arrange

        // Act
        component['openLastDrawing']();

        // Assert
        expect(snapshotFactoryService.save).toHaveBeenCalled();
    });

    it('#openLastDrawing must be called if #BrowserRefresh is true', () => {
        // Arrange
        BrowserRefresh.hasRefreshed = true;
        spyOn<any>(component, 'openLastDrawing');
        spyOn<any>(component, 'setNewCanvas');

        // Act
        component.ngAfterViewInit();

        // Assert
        expect(component['openLastDrawing']).toHaveBeenCalled();
        expect(component['setNewCanvas']).not.toHaveBeenCalled();
    });

    it('#setNewCanvas must be called if #BrowserRefresh is false', () => {
        // Arrange
        BrowserRefresh.hasRefreshed = false;
        spyOn<any>(component, 'openLastDrawing');
        spyOn<any>(component, 'setNewCanvas');

        // Act
        component.ngAfterViewInit();

        // Assert
        expect(component['openLastDrawing']).not.toHaveBeenCalled();
        expect(component['setNewCanvas']).toHaveBeenCalled();
    });
});
