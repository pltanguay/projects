import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '@app/app.module';
import { Tool } from '@app/classes/tool/tool';
import { SelectionComponent } from '@app/components/selection/selection.component';
import { ToolType } from '@app/declarations/tool-declarations';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeService } from '@app/services/resize/resize.service';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
import { Size, WorkspaceService } from '@app/services/workspace/workspace.service';
import { of } from 'rxjs';
import { BaseCanvasComponent } from './base-canvas/base-canvas.component';
import { DrawingSpaceComponent } from './drawing-space.component';
import { GridCanvasComponent } from './grid-canvas/grid-canvas.component';
import { PreviewCanvasComponent } from './preview-canvas/preview-canvas.component';
import { ResizeContainerComponent } from './resize-container/resize-container.component';
import { ResizeIndicatorComponent } from './resize-indicator/resize-indicator.component';

// tslint:disable:max-classes-per-file
// tslint:disable:no-string-literal
// tslint:disable:no-any
class ToolStub extends Tool {
    readonly type: ToolType = ToolType.Line;
}
class EraserToolStub extends Tool {
    readonly type: ToolType = ToolType.Eraser;
}
class RouterStub {
    navigateByUrl(url: string): string {
        return url;
    }
}

// tslint:disable:no-magic-numbers
describe('DrawingComponent', () => {
    let component: DrawingSpaceComponent;
    let fixture: ComponentFixture<DrawingSpaceComponent>;
    let workspaceService: jasmine.SpyObj<WorkspaceService>;
    let resizeService: jasmine.SpyObj<ResizeService>;
    let toolService: jasmine.SpyObj<ToolSelectNotifierService>;

    const CANVAS_SIZE_RATIO = 0.5;
    beforeEach(async(() => {
        workspaceService = jasmine.createSpyObj('WorkspaceService', ['getNewDrawingSize']);
        workspaceService.getNewDrawingSize.and.returnValue(of({ width: 400, height: 500 }));

        resizeService = jasmine.createSpyObj('ResizeService', ['getSize', 'resize']);
        resizeService.getSize.and.returnValue(of({ width: 400, height: 500 }));
        toolService = jasmine.createSpyObj('ToolSelectNotifierService', ['']);
        toolService.currentTool = new ToolStub({} as DrawingService);
        TestBed.configureTestingModule({
            declarations: [
                DrawingSpaceComponent,
                SelectionComponent,
                ResizeIndicatorComponent,
                BaseCanvasComponent,
                PreviewCanvasComponent,
                ResizeContainerComponent,
                GridCanvasComponent,
            ],
            imports: [RouterTestingModule, MatSnackBarModule, AppModule],
            providers: [
                { provide: ToolSelectNotifierService, useValue: toolService },
                { provide: Router, useClass: RouterStub },
                { provide: WorkspaceService, useValue: workspaceService },
                { provide: ResizeService, useValue: resizeService },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingSpaceComponent);
        component = fixture.componentInstance;
        const workspaceContainer = document.createElement('div');
        component.workspace = new ElementRef(workspaceContainer);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should be equal to half of the workspace size', () => {
        // Arrange
        const height = component.containerHeight;
        const width = component.containerWidth;

        // Act

        // Assert
        expect(height).toEqual(Math.round(component.workspaceHeight / 2));
        expect(width).toEqual(Math.round(component.workspaceWidth / 2));
    });

    it('should call #updateContainerSize on init with initial workspace size', () => {
        // Arrange
        component.workspaceWidth = 777;
        component.workspaceHeight = 888;
        const expectedWidth = component.workspaceWidth * CANVAS_SIZE_RATIO;
        const expectedHeight = component.workspaceHeight * CANVAS_SIZE_RATIO;
        spyOn<any>(component, 'updateContainerSize');

        // Act
        component.ngOnInit();
        fixture.detectChanges();

        // Assert
        expect(component['updateContainerSize']).toHaveBeenCalled();
        expect(component['updateContainerSize']).toHaveBeenCalledWith(expectedWidth, expectedHeight);
    });

    it('should call #subscribeNewDrawingSpaceSize on init', () => {
        // Arrange
        spyOn<any>(component, 'subscribeNewDrawingSpaceSize');

        // Act
        component.ngOnInit();

        // Assert
        expect(component['subscribeNewDrawingSpaceSize']).toHaveBeenCalled();
    });

    it('should update the container size when received new one after new drawing event', async(() => {
        // Arrange
        const newSize = { width: 1000, height: 600 } as Size;
        spyOn<any>(component, 'updateContainerSize');

        // Act
        workspaceService.getNewDrawingSize.and.returnValue(of(newSize));
        component['subscribeNewDrawingSpaceSize']();
        fixture.detectChanges();

        // Assert
        expect(component['updateContainerSize']).toHaveBeenCalled();
        expect(component['updateContainerSize']).toHaveBeenCalledWith(newSize.width, newSize.height);
    }));

    it('should update the container size when received new one after resize event', async(() => {
        // Arrange
        const newSize = { width: 1000, height: 600 } as Size;
        spyOn<any>(component, 'updateContainerSize');

        // Act
        resizeService.getSize.and.returnValue(of(newSize));
        component['subscribeNewDrawingSpaceSize']();
        fixture.detectChanges();

        // Assert
        expect(component['updateContainerSize']).toHaveBeenCalled();
        expect(component['updateContainerSize']).toHaveBeenCalledWith(newSize.width, newSize.height);
    }));

    it('#updateContainerSize should update #containerWidth and #containerHeight', () => {
        // Arrange
        const newSize = { width: 1000, height: 600 } as Size;

        // Act
        component['updateContainerSize'](newSize.width, newSize.height);

        // Assert
        expect(component.containerWidth).toBe(Math.round(newSize.width));
        expect(component.containerHeight).toBe(Math.round(newSize.height));
    });

    it('#eraser should be true if current tool is eraser', () => {
        // Act
        toolService.currentTool = new EraserToolStub({} as DrawingService);

        // Arrange
        fixture.detectChanges();

        // Assert
        expect(component.customCursor).toBeTrue();
    });

    it('#eraser should be false if current tool is not eraser', () => {
        // Act

        // Arrange
        fixture.detectChanges();

        // Assert
        expect(component.customCursor).toBeFalse();
    });
});
