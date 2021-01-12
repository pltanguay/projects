import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPalette } from '@app/classes/color/color';
import { MaterialModule } from '@app/material.module';
import { ColorService } from '@app/services/tools/color/color.service';
import { PolygoneService } from '@app/services/tools/contour-shape/polygone/polygone.service';
import { of } from 'rxjs';
import { PolygoneAttributeComponent } from './polygone-attribute.component';

// tslint:disable:no-string-literal
describe('PolygoneAttributeComponent', () => {
    let component: PolygoneAttributeComponent;
    let fixture: ComponentFixture<PolygoneAttributeComponent>;
    const componentTitle = 'Polygone';
    let polygoneService: jasmine.SpyObj<PolygoneService>;
    let colorService: jasmine.SpyObj<ColorService>;
    let subscribeToColorObservableSpy: jasmine.Spy;

    // tslint:disable:no-magic-numbers
    // tslint:disable:no-any
    const colorPaletteStub: ColorPalette = { lastTenColors: [], primaryColor: '#00dead', secondaryColor: '#beef00', selectedColor: '' };

    beforeEach(async(() => {
        polygoneService = jasmine.createSpyObj('PolygoneService', ['']);
        polygoneService.withBorder = true;
        polygoneService.width = 10;
        polygoneService.withFill = false;
        polygoneService.numberOfSides = 3;

        colorService = jasmine.createSpyObj('ColorService', ['getColorsObservable']);
        subscribeToColorObservableSpy = colorService.getColorsObservable.and.returnValue(of(colorPaletteStub));

        TestBed.configureTestingModule({
            declarations: [PolygoneAttributeComponent],
            providers: [
                { provide: PolygoneService, useValue: polygoneService },
                { provide: ColorService, useValue: colorService },
            ],
            imports: [NoopAnimationsModule, MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PolygoneAttributeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have #title as "Polygone"', () => {
        // Arrange

        // Act

        // Assert
        expect(component.title).toBe(componentTitle);
    });

    it('should set polygone #width from polygone service', () => {
        // Arrange

        // Act
        component['setWidth']();

        // Assert
        expect(component.width).toBe(polygoneService.width);
    });

    it('should set polygone #isWithBorder from polygone service', () => {
        // Arrange

        // Act
        component['setIsWithBorder']();

        // Assert
        expect(component.isWithBorder).toBe(polygoneService.withBorder);
    });

    it('should set polygone #isWithFill from polygone service', () => {
        // Arrange

        // Act
        component['setIsWithFill']();

        // Assert
        expect(component.isWithFill).toBe(polygoneService.withFill);
    });

    it('should set all polygone attributes after component initialized from polygone service', () => {
        // Arrange

        // Act
        component.ngOnInit();

        // Assert
        expect(component.width).toBe(polygoneService.width);
        expect(component.isWithBorder).toBe(polygoneService.withBorder);
        expect(component.isWithFill).toBe(polygoneService.withFill);
        expect(component.numberOfSides).toBe(polygoneService.numberOfSides);
    });

    it('should subscribe to color service', () => {
        // Arrange

        // Act
        component['subscribeToColor']();

        // Assert
        expect(subscribeToColorObservableSpy).toHaveBeenCalled();
    });

    it('should set polygone fill color after subscribing to color service', () => {
        // Arrange

        // Act
        component['subscribeToColor']();

        // Assert
        expect(polygoneService.fillColor).toBe(colorPaletteStub.primaryColor);
    });

    it('should set polygone stroke color after subscribing to color service', () => {
        // Arrange

        // Act
        component['subscribeToColor']();

        // Assert
        expect(polygoneService.strokeColor).toBe(colorPaletteStub.secondaryColor);
    });

    it('#widthChanged should set polygone width', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 39 };

        // Act
        component.widthChanged(event);

        // Assert
        expect(polygoneService.width).toBe(39);
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

    it('#numberOfSidesChanged should set polygone numberOfSides', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 7 };

        // Act
        component.numberOfSidesChanged(event);

        // Assert
        expect(polygoneService.numberOfSides).toBe(7);
    });

    it('#numberOfSidesChanged should set #numberOfSides', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 8 };

        // Act
        component.numberOfSidesChanged(event);

        // Assert
        expect(component.numberOfSides).toBe(8);
    });

    it('#withBorderToggled should set polygone border', () => {
        // Arrange
        const toggle: any = {};
        const event = { source: toggle, checked: true };

        // Act
        component.withBorderToggled(event);
        // Assert
        expect(polygoneService.withBorder).toBe(true);
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

    it('#withFillToggled should set polygone border', () => {
        // Arrange
        const toggle: any = {};
        const event = { source: toggle, checked: false };

        // Act
        component.withFillToggled(event);
        // Assert
        expect(polygoneService.withFill).toBe(false);
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

    it('#withFillToggled should set polygone withBorder to true if #isWithFill has toggled to false', () => {
        // Arrange
        const toggle: any = {};
        const event = { source: toggle, checked: false };
        component.isWithBorder = false;

        // Act
        component.withFillToggled(event);

        // Assert
        expect(polygoneService.withBorder).toBe(true);
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

    it('#withBorderToggled should set polygone withFill to true if #isWithBorder has toggled to false', () => {
        // Arrange
        const toggle: any = {};
        const event = { source: toggle, checked: false };
        component.isWithFill = false;

        // Act
        component.withBorderToggled(event);

        // Assert
        expect(polygoneService.withFill).toBe(true);
    });

    // extra front end test

    it('should call #withFillToggled on fill toggle change event', () => {
        // Arrange
        spyOn(component, 'withFillToggled');

        const event = {
            checked: false,
        } as MatSlideToggleChange;

        // Act
        component.withBorderToggled(event);

        // Assert
        expect(component.isWithFill).toBe(true);
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

    it('should call #numberOfSidesChanged on width slider input event', () => {
        // Arrange
        spyOn(component, 'numberOfSidesChanged');
        const componentDebug = fixture.debugElement;
        const slider = componentDebug.query(By.css('#numberOfSidesSlider'));

        // Act
        slider.triggerEventHandler('input', { value: 5 });

        // Assert
        expect(component.numberOfSidesChanged).toHaveBeenCalled();
    });
});
