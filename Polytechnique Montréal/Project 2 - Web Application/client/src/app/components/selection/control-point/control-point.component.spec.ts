import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { BoundingBoxService } from '@app/services/tools/selection/bounding-box/bounding-box.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
import { ControlPointComponent } from './control-point.component';
// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:no-magic-numbers
describe('ControlPointComponent', () => {
    let component: ControlPointComponent;
    let fixture: ComponentFixture<ControlPointComponent>;
    let boundingBoxService: jasmine.SpyObj<BoundingBoxService>;
    let toolService: jasmine.SpyObj<ToolSelectNotifierService>;
    let selService: jasmine.SpyObj<SelectionService>;

    beforeEach(async(() => {
        boundingBoxService = {
            ...jasmine.createSpyObj('BoundingBoxService', ['applyTranslation']),
            center: { x: 0, y: 0 },
            absDimension: { width: 10, height: 10 },
            dimension: { width: 10, height: 10 },
        };

        selService = jasmine.createSpyObj('SelectionService', ['scale']);

        toolService = { ...jasmine.createSpyObj('ToolSelectNotifierService', ['']), currentTool: selService };
        TestBed.configureTestingModule({
            declarations: [ControlPointComponent],
            imports: [AppModule],
            providers: [
                { provide: BoundingBoxService, useValue: boundingBoxService },
                { provide: ToolSelectNotifierService, useValue: toolService },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ControlPointComponent);
        component = fixture.componentInstance;
        component.updateState();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('scale should scale properly with shift false', () => {
        // Arrange

        // Act
        component['scale']({ mouseX: 5, mouseY: 5, isShift: false }, 0, 1);

        // Assert
        expect(selService.scale).toHaveBeenCalled();
    });

    it('scale should scale properly with shift true', () => {
        // Arrange
        component.updateState();

        // Act
        component['scale']({ mouseX: 5, mouseY: 5, isShift: true }, 0, 1);

        // Assert
        expect(selService.scale).toHaveBeenCalled();
    });

    it('scale should not scale when the height is null', () => {
        // Arrange
        component['state'].dimension.height = 0;
        component['boxHeight'] = 0;
        component['boxWidth'] = 0;

        // Act
        component['scale']({ mouseX: 0, mouseY: 0 }, 0, 1);

        // Assert
        expect(selService.scale).not.toHaveBeenCalled();
    });
});
