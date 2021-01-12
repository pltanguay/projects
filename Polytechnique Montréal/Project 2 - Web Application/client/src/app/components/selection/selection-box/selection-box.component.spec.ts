import { Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { MouseButton } from '@app/declarations/mouse.enum';
import { SnapToGridService } from '@app/services/snap-to-grid/snap-to-grid.service';
import { BoundingBoxService } from '@app/services/tools/selection/bounding-box/bounding-box.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
import { WorkspaceService } from '@app/services/workspace/workspace.service';
import { SelectionBoxComponent } from './selection-box.component';

// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('SelectionBoxComponent', () => {
    let component: SelectionBoxComponent;
    let fixture: ComponentFixture<SelectionBoxComponent>;
    let workspaceService: jasmine.SpyObj<WorkspaceService>;
    let boundingBoxService: jasmine.SpyObj<BoundingBoxService>;
    let toolService: jasmine.SpyObj<ToolSelectNotifierService>;
    let selService: jasmine.SpyObj<SelectionService>;
    let snapGridService: jasmine.SpyObj<SnapToGridService>;
    let renderer: jasmine.SpyObj<Renderer2>;

    beforeEach(async(() => {
        workspaceService = jasmine.createSpyObj('WorkspaceService', ['setOverflow']);

        boundingBoxService = jasmine.createSpyObj('BoundingBoxService', ['applyTranslation']);

        selService = jasmine.createSpyObj('SelectionService', ['moveSelection']);

        toolService = { ...jasmine.createSpyObj('ToolSelectNotifierService', ['']), currentTool: selService };
        snapGridService = { ...jasmine.createSpyObj('SnapToGridService', ['getNearestPointTranslation']), active: true, snapPoint: { x: 10, y: 10 } };
        snapGridService.getNearestPointTranslation.and.returnValue({ x: 10, y: 10 });
        renderer = jasmine.createSpyObj('Renderer2', ['listen']);

        TestBed.configureTestingModule({
            declarations: [SelectionBoxComponent],
            imports: [AppModule],
            providers: [
                { provide: WorkspaceService, useValue: workspaceService },
                { provide: BoundingBoxService, useValue: boundingBoxService },
                { provide: ToolSelectNotifierService, useValue: toolService },
                { provide: SnapToGridService, useValue: snapGridService },
                { provide: Renderer2, useValue: renderer },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectionBoxComponent);
        component = fixture.componentInstance;
        component['last'] = { x: 0, y: 0 };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should do nothing when mouse left is not pressed on pointerdown event ', () => {
        // Arrange
        const event = new PointerEvent('pointerdown', { pointerId: 1, button: MouseButton.Right, clientX: 0, clientY: 0 });

        // Act
        component.selectionBox.nativeElement.dispatchEvent(event);

        // Assert
        expect(workspaceService.setOverflow).not.toHaveBeenCalled();
    });

    it('should set #mouseDown to true and set overflow to hidden for workspace on pointerdown event', () => {
        // Arrange
        const event = new PointerEvent('pointerdown', { pointerId: 1, clientX: 0, clientY: 0 });

        // Act
        component.selectionBox.nativeElement.dispatchEvent(event);

        // Assert
        expect(workspaceService.setOverflow).toHaveBeenCalledWith('hidden');
        expect(component['mouseDown']).toBeTrue();
    });

    it('should set #mouseDown to false and set overflow to auto for workspace on pointerup event', () => {
        // Arrange
        const event = new PointerEvent('pointerup', { pointerId: 1 });

        // Act
        component.selectionBox.nativeElement.dispatchEvent(event);

        // Assert
        expect(workspaceService.setOverflow).toHaveBeenCalledWith('auto');
        expect(component['mouseDown']).toBeFalse();
    });

    it('should emit moved position on pointermove when mouse is down', () => {
        // Arrange
        const event = new PointerEvent('pointermove', { pointerId: 1, clientX: 0, clientY: 0 });
        component['last'] = { x: 0, y: 0 };
        component['mouseDown'] = true;
        snapGridService.active = false;

        // Act
        component.selectionBox.nativeElement.dispatchEvent(event);

        // Assert
        expect(boundingBoxService.applyTranslation).toHaveBeenCalled();
    });

    it('should not emit move position on pointermove when mouse is not down', () => {
        // Arrange
        const event = new PointerEvent('pointermove', { pointerId: 1, clientX: 0, clientY: 0 });
        component['mouseDown'] = false;

        // Act
        component.selectionBox.nativeElement.dispatchEvent(event);

        // Assert
        expect(boundingBoxService.applyTranslation).not.toHaveBeenCalled();
    });
    it('pointermove should call snap to grid service if active', () => {
        // Arrange
        const event = new PointerEvent('pointermove', { pointerId: 1, clientX: 0, clientY: 0 });
        component['last'] = { x: 0, y: 0 };
        component['mouseDown'] = true;

        // Act
        component.selectionBox.nativeElement.dispatchEvent(event);

        // Assert
        expect(snapGridService.getNearestPointTranslation).toHaveBeenCalled();
    });
});
