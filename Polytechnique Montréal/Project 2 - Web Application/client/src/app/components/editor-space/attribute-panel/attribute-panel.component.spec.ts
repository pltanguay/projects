import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPaletteComponent } from '@app/components/editor-space/color-palette/color-palette.component';
import { HueSliderComponent } from '@app/components/editor-space/color-palette/hue-slider/hue-slider.component';
import { PaletteComponent } from '@app/components/editor-space/color-palette/palette/palette.component';
import { MaterialModule } from '@app/material.module';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
import { of } from 'rxjs';
import { AttributePanelComponent } from './attribute-panel.component';
import { BrushAttributesComponent } from './brush-attributes/brush-attributes.component';
import { LineAttributesComponent } from './line-attributes/line-attributes.component';
import { PencilAttributesComponent } from './pencil-attributes/pencil-attributes.component';

// tslint:disable:no-any
describe('AttributePannelComponent', () => {
    let component: AttributePanelComponent;
    let fixture: ComponentFixture<AttributePanelComponent>;

    let toolService: jasmine.SpyObj<ToolSelectNotifierService>;

    beforeEach(async(() => {
        toolService = jasmine.createSpyObj('ToolSelectNotifierService', ['getToolPanel', 'getInitialToolPanel']);
        toolService.getInitialToolPanel.and.returnValue(PencilAttributesComponent);
        toolService.getToolPanel.and.returnValue(of(LineAttributesComponent));

        TestBed.configureTestingModule({
            declarations: [AttributePanelComponent, ColorPaletteComponent, HueSliderComponent, PaletteComponent],
            providers: [{ provide: ToolSelectNotifierService, useValue: toolService }],
            imports: [NoopAnimationsModule, MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributePanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#togglePanel should toggle #isPanelOpen from false to true', () => {
        // Arrange
        component.isPanelOpen = false;

        // Act
        component.togglePanel();

        // Assert
        expect(component.isPanelOpen).toBeTruthy();
    });

    it('#togglePanel should toggle #isPanelOpen from true to false', () => {
        // Arrange
        component.isPanelOpen = true;

        // Act
        component.togglePanel();

        // Assert
        expect(component.isPanelOpen).toBeFalsy();
    });

    it('should have a closed panel initially', () => {
        // Arrange

        // Act

        // Assert
        expect(component.isPanelOpen).toBe(true, 'at first');
    });

    it('should load selected tool attribute panel component', () => {
        // Arrange
        toolService.getToolPanel.and.returnValue(of(LineAttributesComponent));

        // Act
        fixture.detectChanges();
        const elLoaded = fixture.debugElement.query(By.directive(LineAttributesComponent));
        const otherEl = fixture.debugElement.query(By.directive(PencilAttributesComponent));

        // Assert
        expect(elLoaded).toBeTruthy();
        expect(otherEl).toBeNull();
    });

    it(' #ngOnInit should call #togglePanel if same tool is clicked', () => {
        // Arrange
        toolService.getToolPanel.and.returnValue(of(BrushAttributesComponent));
        component.selectedPanel = BrushAttributesComponent;
        const spyToggle = spyOn<any>(component, 'togglePanel');
        // Act
        component.ngOnInit();

        // Assert
        expect(spyToggle).toHaveBeenCalled();
    });

    it(' #ngOnInit should open panel if it is closed and a different one is clicked', () => {
        // Arrange
        toolService.getToolPanel.and.returnValue(of(BrushAttributesComponent));
        component.selectedPanel = LineAttributesComponent;
        component.isPanelOpen = false;
        const spyToggle = spyOn<any>(component, 'togglePanel');

        // Act
        component.ngOnInit();

        // Assert
        expect(spyToggle).toHaveBeenCalled();
    });

    it('#isPanelOpen should be true when selecting tool from the sidebar', () => {
        // Arrange
        toolService.getToolPanel.and.returnValue(of(BrushAttributesComponent));

        // Act
        component.ngOnInit();

        // Assert
        expect(component.isPanelOpen).toBe(true);
    });

    it('#isPanelOpen should be true when clicking another tool icon from the sidebar', () => {
        // Arrange
        component.selectedPanel = BrushAttributesComponent;
        toolService.getToolPanel.and.returnValue(of(LineAttributesComponent));

        // Act
        component.ngOnInit();

        // Assert
        expect(component.isPanelOpen).toBe(true, 'after clicking the same tool');
    });
});
