import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPalette } from '@app/classes/color/color';
import { MaterialModule } from '@app/material.module';
import { ColorService } from '@app/services/tools/color/color.service';
import { EllipseService } from '@app/services/tools/contour-shape/ellipse/ellipse.service';
import { of } from 'rxjs';
import { EllipseAttributeComponent } from './ellipse-attribute.component';

describe('EllipseAttributeComponent', () => {
    let component: EllipseAttributeComponent;
    let fixture: ComponentFixture<EllipseAttributeComponent>;
    const componentTitle = 'Ellipse';
    let ellipseService: jasmine.SpyObj<EllipseService>;
    let colorService: jasmine.SpyObj<ColorService>;
    let subscribeToColorObservableSpy: jasmine.Spy;

    // tslint:disable:no-magic-numbers
    // tslint:disable:no-any
    // tslint:disable:no-string-literal
    const colorPaletteStub: ColorPalette = { lastTenColors: [], primaryColor: '#00dead', secondaryColor: '#beef00', selectedColor: '' };

    beforeEach(async(() => {
        ellipseService = jasmine.createSpyObj('EllipseService', ['']);
        ellipseService.withBorder = true;
        ellipseService.width = 10;
        ellipseService.withFill = false;

        colorService = jasmine.createSpyObj('ColorService', ['getColorsObservable']);
        subscribeToColorObservableSpy = colorService.getColorsObservable.and.returnValue(of(colorPaletteStub));

        TestBed.configureTestingModule({
            declarations: [EllipseAttributeComponent],
            providers: [
                { provide: EllipseService, useValue: ellipseService },
                { provide: ColorService, useValue: colorService },
            ],
            imports: [NoopAnimationsModule, MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EllipseAttributeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have #title as "Ellipse"', () => {
        // Arrange

        // Act

        // Assert
        expect(component.title).toBe(componentTitle);
    });

    it('should set ellipse #width from ellipse service', () => {
        // Arrange

        // Act
        component['setWidth']();

        // Assert
        expect(component.width).toBe(ellipseService.width);
    });

    it('should set ellipse #isWithBorder from ellipse service', () => {
        // Arrange

        // Act
        component['setIsWithBorder']();

        // Assert
        expect(component.isWithBorder).toBe(ellipseService.withBorder);
    });

    it('should set ellipse #isWithFill from ellipse service', () => {
        // Arrange

        // Act
        component['setIsWithFill']();

        // Assert
        expect(component.isWithFill).toBe(ellipseService.withFill);
    });

    it('should get all ellipse attributes after component initialized from ellipse service', () => {
        // Arrange

        // Act
        component.ngOnInit();

        // Assert
        expect(component.width).toBe(ellipseService.width);
        expect(component.isWithBorder).toBe(ellipseService.withBorder);
        expect(component.isWithFill).toBe(ellipseService.withFill);
    });

    it('should subscribe to color service', () => {
        // Arrange

        // Act
        component['subscribeToColors']();

        // Assert
        expect(subscribeToColorObservableSpy).toHaveBeenCalled();
    });

    it('should set ellipse fill color after subscribing to color service', () => {
        // Arrange

        // Act
        component['subscribeToColors']();

        // Assert
        expect(ellipseService.fillColor).toBe(colorPaletteStub.primaryColor);
    });

    it('should set ellipse stroke color after subscribing to color service', () => {
        // Arrange

        // Act
        component['subscribeToColors']();

        // Assert
        expect(ellipseService.strokeColor).toBe(colorPaletteStub.secondaryColor);
    });

    it('#widthChanged should set ellipse width', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 39 };

        // Act
        component.widthChanged(event);

        // Assert
        expect(ellipseService.width).toBe(39);
    });

    it('#widthChanged should set #width', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 66 };

        // Act
        component.widthChanged(event);

        // Assert
        expect(component.width).toBe(66);
    });

    it('#withBorderToggled should set ellipse border', () => {
        // Arrange
        const toggle: any = {};
        const event = { source: toggle, checked: true };

        // Act
        component.withBorderToggled(event);
        // Assert
        expect(ellipseService.withBorder).toBe(true);
    });

    it('#withBorderToggled should set #isWithBorder', () => {
        // Arrange
        const toggle: any = {};
        const event = { source: toggle, checked: false };

        // Act
        component.withBorderToggled(event);
        // Assert
        expect(component.isWithBorder).toBe(false);
    });

    it('#withFillToggled should set ellipse border', () => {
        // Arrange
        const toggle: any = {};
        const event = { source: toggle, checked: false };

        // Act
        component.withFillToggled(event);
        // Assert
        expect(ellipseService.withFill).toBe(false);
    });

    it('#withFillToggled should set #isWithFill', () => {
        // Arrange
        const toggle: any = {};
        const event = { source: toggle, checked: true };

        // Act
        component.withFillToggled(event);
        // Assert
        expect(component.isWithBorder).toBe(true);
    });

    it('#withFillToggled should set #isWithBorder to true if #isWithFill has toggled to false', () => {
        // Arrange
        const toggle: any = {};
        const event = { source: toggle, checked: false };
        component.isWithBorder = false;

        // Act
        component.withFillToggled(event);
        // Assert
        expect(component.isWithBorder).toBe(true);
    });

    it('#withFillToggled should set ellipse withBorder to true if #isWithFill has toggled to false', () => {
        // Arrange
        const toggle: any = {};
        const event = { source: toggle, checked: false };
        component.isWithBorder = false;

        // Act
        component.withFillToggled(event);

        // Assert
        expect(ellipseService.withBorder).toBe(true);
    });

    it('#withBorderToggled should set #isWithFill to true if #isWithBorder has toggled to false', () => {
        // Arrange
        const toggle: any = {};
        const event = { source: toggle, checked: false };
        component.isWithFill = false;

        // Act
        component.withBorderToggled(event);
        // Assert
        expect(component.isWithFill).toBe(true);
    });

    it('#withBorderToggled should set ellipse withFill to true if #isWithBorder has toggled to false', () => {
        // Arrange
        const toggle: any = {};
        const event = { source: toggle, checked: false };
        component.isWithFill = false;

        // Act
        component.withBorderToggled(event);

        // Assert
        expect(ellipseService.withFill).toBe(true);
    });

    // extra front end test

    it('should call #withFillToggled on fill toggle change event', () => {
        // Arrange
        spyOn(component, 'withFillToggled');
        const componentDebug = fixture.debugElement;
        const sliderToggle = componentDebug.query(By.css('#fillToggle'));

        // Act
        sliderToggle.triggerEventHandler('change', { checked: true });

        // Assert
        expect(component.withFillToggled).toHaveBeenCalled();
    });

    it('should call #withBorderToggled on border toggle change event', () => {
        // Arrange
        spyOn(component, 'withBorderToggled');
        const componentDebug = fixture.debugElement;
        const sliderToggle = componentDebug.query(By.css('#borderToggle'));

        // Act
        sliderToggle.triggerEventHandler('change', { checked: true });

        // Assert
        expect(component.withBorderToggled).toHaveBeenCalled();
    });

    it('should call #widthChanged on width slider input event', () => {
        // Arrange
        spyOn(component, 'widthChanged');
        const componentDebug = fixture.debugElement;
        const slider = componentDebug.query(By.css('#widthSlider'));

        // Act
        slider.triggerEventHandler('input', { value: 40 });

        // Assert
        expect(component.widthChanged).toHaveBeenCalled();
    });
});
