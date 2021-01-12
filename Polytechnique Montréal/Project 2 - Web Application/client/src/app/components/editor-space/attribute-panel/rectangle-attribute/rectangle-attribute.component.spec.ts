import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPalette } from '@app/classes/color/color';
import { MaterialModule } from '@app/material.module';
import { ColorService } from '@app/services/tools/color/color.service';
import { RectangleService } from '@app/services/tools/contour-shape/rectangle/rectangle.service';
import { of } from 'rxjs';
import { RectangleAttributeComponent } from './rectangle-attribute.component';

// tslint:disable:no-string-literal
describe('RectangleAttributeComponent', () => {
    let component: RectangleAttributeComponent;
    let fixture: ComponentFixture<RectangleAttributeComponent>;
    const componentTitle = 'Rectangle';
    let rectangleService: jasmine.SpyObj<RectangleService>;
    let colorService: jasmine.SpyObj<ColorService>;
    let subscribeToColorObservableSpy: jasmine.Spy;

    // tslint:disable:no-magic-numbers
    // tslint:disable:no-any
    const colorPaletteStub: ColorPalette = { lastTenColors: [], primaryColor: '#001337', secondaryColor: '#babe00', selectedColor: '' };
    beforeEach(async(() => {
        rectangleService = jasmine.createSpyObj('RectangleService', ['']);
        rectangleService.withBorder = false;
        rectangleService.width = 23;
        rectangleService.withFill = true;

        colorService = jasmine.createSpyObj('ColorService', ['getColorsObservable']);
        subscribeToColorObservableSpy = colorService.getColorsObservable.and.returnValue(of(colorPaletteStub));
        TestBed.configureTestingModule({
            declarations: [RectangleAttributeComponent],
            providers: [
                { provide: RectangleService, useValue: rectangleService },
                { provide: ColorService, useValue: colorService },
            ],
            imports: [NoopAnimationsModule, MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RectangleAttributeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have #title as "Rectangle"', () => {
        // Arrange

        // Act

        // Assert
        expect(component.title).toBe(componentTitle);
    });

    it('should set rectangle #width from rectangle service', () => {
        // Arrange

        // Act
        component['setWidth']();

        // Assert
        expect(component.width).toBe(rectangleService.width);
    });

    it('should set rectangle #isWithBorder from rectangle service', () => {
        // Arrange

        // Act
        component['setIsWithBorder']();

        // Assert
        expect(component.isWithBorder).toBe(rectangleService.withBorder);
    });

    it('should set rectangle #isWithFill from rectangle service', () => {
        // Arrange

        // Act
        component['setIsWithFill']();

        // Assert
        expect(component.isWithFill).toBe(rectangleService.withFill);
    });

    it('should set all rectangle attributes after component initialized from rectangle service', () => {
        // Arrange

        // Act
        component.ngOnInit();

        // Assert
        expect(component.width).toBe(rectangleService.width);
        expect(component.isWithBorder).toBe(rectangleService.withBorder);
        expect(component.isWithFill).toBe(rectangleService.withFill);
    });

    it('should subscribe to color service', () => {
        // Arrange

        // Act
        component['subscribeToColor']();

        // Assert
        expect(subscribeToColorObservableSpy).toHaveBeenCalled();
    });

    it('should set rectangle fill color after subscribing to color service', () => {
        // Arrange

        // Act
        component['subscribeToColor']();

        // Assert
        expect(rectangleService.fillColor).toBe(colorPaletteStub.primaryColor);
    });

    it('should set rectangle stroke color after subscribing to color service', () => {
        // Arrange

        // Act
        component['subscribeToColor']();

        // Assert
        expect(rectangleService.strokeColor).toBe(colorPaletteStub.secondaryColor);
    });

    it('#widthChanged should set rectangle width', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 39 };

        // Act
        component.widthChanged(event);

        // Assert
        expect(rectangleService.width).toBe(39);
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

    it('#withBorderToggled should set rectangle border', () => {
        // Arrange
        const toggle: any = {};
        const event = { source: toggle, checked: true };

        // Act
        component.withBorderToggled(event);
        // Assert
        expect(rectangleService.withBorder).toBe(true);
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

    it('#withFillToggled should set rectangle border', () => {
        // Arrange
        const toggle: any = {};
        const event = { source: toggle, checked: false };

        // Act
        component.withFillToggled(event);
        // Assert
        expect(rectangleService.withFill).toBe(false);
    });

    it('#withFillToggled should set #isWithFill', () => {
        // Arrange
        const toggle: any = {};
        const event = { source: toggle, checked: true };

        // Act
        component.withFillToggled(event);
        // Assert
        expect(component.isWithFill).toBe(true);
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

    it('#withFillToggled should set rectangle withBorder to true if #isWithFill has toggled to false', () => {
        // Arrange
        const toggle: any = {};
        const event = { source: toggle, checked: false };
        component.isWithBorder = false;

        // Act
        component.withFillToggled(event);

        // Assert
        expect(rectangleService.withBorder).toBe(true);
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

    it('#withBorderToggled should set rectangle withFill to true if #isWithBorder has toggled to false', () => {
        // Arrange
        const toggle: any = {};
        const event = { source: toggle, checked: false };
        component.isWithFill = false;

        // Act
        component.withBorderToggled(event);

        // Assert
        expect(rectangleService.withFill).toBe(true);
    });

    // extra front end tests

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
