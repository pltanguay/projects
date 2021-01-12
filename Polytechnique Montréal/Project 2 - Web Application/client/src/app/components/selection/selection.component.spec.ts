import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { Tool } from '@app/classes/tool/tool';
import { ToolType } from '@app/declarations/tool-declarations';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BoundingBoxService } from '@app/services/tools/selection/bounding-box/bounding-box.service';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse-selection/ellipse-selection.service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle-selection/rectangle-selection.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
import { SelectionComponent } from './selection.component';

// tslint:disable:no-empty
class ToolStub extends Tool {
    readonly type: ToolType = ToolType.RectangleSelection;

    moveSelection(): void {
        return;
    }

    terminateSelection(): void {
        return;
    }
}
describe('SelectionComponent', () => {
    let component: SelectionComponent;
    let fixture: ComponentFixture<SelectionComponent>;
    let toolService: jasmine.SpyObj<ToolSelectNotifierService>;
    let recService: jasmine.SpyObj<RectangleSelectionService>;
    let ellipseService: jasmine.SpyObj<EllipseSelectionService>;
    let boundingBox: jasmine.SpyObj<BoundingBoxService>;

    beforeEach(async(() => {
        toolService = jasmine.createSpyObj('ToolSelectNotifierService', ['']);
        toolService.currentTool = new ToolStub({} as DrawingService);

        recService = jasmine.createSpyObj('RectangleSelectionService', ['']);
        ellipseService = jasmine.createSpyObj('EllipseSelectionService', ['']);

        boundingBox = { ...jasmine.createSpyObj('BoundingBoxService', ['']), absDimension: { width: 0, height: 0 } };
        boundingBox.left = boundingBox.top = 0;

        TestBed.configureTestingModule({
            declarations: [SelectionComponent],
            providers: [
                { provide: ToolSelectNotifierService, useValue: toolService },
                { provide: RectangleSelectionService, useValue: recService },
                { provide: EllipseSelectionService, useValue: ellipseService },
                { provide: BoundingBoxService, useValue: boundingBox },
            ],
            imports: [AppModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('if mouse down outside selection should terminate it if selection is active', () => {
        // Arrange
        const event = new PointerEvent('pointerdown');
        spyOn(toolService.currentTool as SelectionService, 'terminateSelection');
        Object.defineProperty(component, 'selectionActive', { value: true });

        // Act
        document.dispatchEvent(event);
        fixture.detectChanges();

        // Assert
        expect((toolService.currentTool as SelectionService).terminateSelection).toHaveBeenCalled();
    });

    it('if mouse down on selection should not terminate it if selection is not active', () => {
        // Arrange
        const event = new PointerEvent('pointerdown');
        spyOn(toolService.currentTool as SelectionService, 'terminateSelection');
        Object.defineProperty(component, 'selectionActive', { value: false });

        // Act
        document.dispatchEvent(event);
        fixture.detectChanges();

        // Assert
        expect((toolService.currentTool as SelectionService).terminateSelection).not.toHaveBeenCalled();
    });

    it('#ignore context menu should call event prevent default', () => {
        // Arrange
        const event = { preventDefault: () => {} } as MouseEvent;

        spyOn(event, 'preventDefault');

        // Act
        component.ignoreContextMenu(event);

        // Assert
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('wheel event should call current tool onWheelScroll', () => {
        // Arrange
        const event = new WheelEvent('wheel');
        spyOn(toolService.currentTool, 'onWheelScroll');

        // Act
        component.elem.nativeElement.dispatchEvent(event);
        fixture.detectChanges();

        // Assert
        expect(toolService.currentTool.onWheelScroll).toHaveBeenCalled();
    });
});
