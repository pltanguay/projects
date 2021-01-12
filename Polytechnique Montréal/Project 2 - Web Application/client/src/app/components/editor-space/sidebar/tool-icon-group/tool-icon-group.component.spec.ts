import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppModule } from '@app/app.module';
import { Tool } from '@app/classes/tool/tool';
import { ToolType } from '@app/declarations/tool-declarations';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
import { ToolIconGroupComponent } from './tool-icon-group.component';

class ToolStub extends Tool {
    readonly type: ToolType = ToolType.Line;
}
describe('ToolIconGroupComponent', () => {
    let component: ToolIconGroupComponent;
    let fixture: ComponentFixture<ToolIconGroupComponent>;
    let toolService: jasmine.SpyObj<ToolSelectNotifierService>;

    beforeEach(async(() => {
        toolService = jasmine.createSpyObj('ToolSelectNotifierService', ['selectTool']);
        toolService.currentTool = new ToolStub({} as DrawingService);

        TestBed.configureTestingModule({
            declarations: [ToolIconGroupComponent],
            providers: [{ provide: ToolSelectNotifierService, useValue: toolService }],
            imports: [AppModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolIconGroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have the current selected tool type from tool service', () => {
        // Arrange

        // Act
        fixture.detectChanges();

        // Assert
        expect(component.currentSelectedTool).toBe(toolService.currentTool.type);
    });

    it('#onClickIcon should call tool service to select tool', () => {
        // Arrange
        const type = ToolType.Pencil;

        // Act
        component.onClickIcon(type);

        // Assert
        expect(toolService.selectTool).toHaveBeenCalled();
    });

    it('#onClickIcon should call tool service with the correct selected type', () => {
        // Arrange
        const type = ToolType.Ellipse;

        // Act
        component.onClickIcon(type);

        // Assert
        expect(toolService.selectTool).toHaveBeenCalledWith(type);
    });

    // extra front end tests

    it('should call #onClickIcon when received event from clicked icon', () => {
        // Arrange
        spyOn(component, 'onClickIcon');
        const type = ToolType.Eraser;
        const componentDebug = fixture.debugElement;
        const iconComp = componentDebug.query(By.css('app-tool-icon'));

        // Act
        iconComp.triggerEventHandler('clickIcon', type);

        // Assert
        expect(component.onClickIcon).toHaveBeenCalledWith(type);
    });
});
