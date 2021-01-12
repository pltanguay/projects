import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPalette } from '@app/classes/color/color';
import { MaterialModule } from '@app/material.module';
import { ColorService } from '@app/services/tools/color/color.service';
import { LineService } from '@app/services/tools/line/line.service';
import { of } from 'rxjs';
import { LineAttributesComponent } from './line-attributes.component';

// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('LineAttributesComponent', () => {
    let component: LineAttributesComponent;
    let fixture: ComponentFixture<LineAttributesComponent>;
    const componentTitle = 'Ligne';
    let lineService: jasmine.SpyObj<LineService>;
    let colorService: jasmine.SpyObj<ColorService>;
    let subscribeToColorObservableSpy: jasmine.Spy;

    // tslint:disable:no-magic-numbers
    const colorPaletteStub: ColorPalette = { lastTenColors: [], primaryColor: '', secondaryColor: '', selectedColor: '#ffffff' };
    beforeEach(async(() => {
        lineService = jasmine.createSpyObj('LineService', ['']);
        lineService.radius = 3;
        lineService.width = 10;
        lineService.withJunctions = true;

        colorService = jasmine.createSpyObj('ColorService', ['getColorsObservable']);
        subscribeToColorObservableSpy = colorService.getColorsObservable.and.returnValue(of(colorPaletteStub));

        TestBed.configureTestingModule({
            declarations: [LineAttributesComponent],
            providers: [
                { provide: LineService, useValue: lineService },
                { provide: ColorService, useValue: colorService },
            ],
            imports: [NoopAnimationsModule, MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LineAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have #title as "Ligne"', () => {
        // Arrange
        const title = fixture.nativeElement.querySelector('.title');

        // Act

        // Assert
        expect(title.textContent).toBe(componentTitle);
    });

    it('should set line #lineWidth from line service', () => {
        // Arrange

        // Act
        component['setLineWidth']();

        // Assert
        expect(component.lineWidth).toBe(lineService.width);
    });

    it('should set line #junctionRadius from line service', () => {
        // Arrange

        // Act
        component['setRadius']();

        // Assert
        expect(component.junctionRadius).toBe(lineService.radius);
    });

    it('should set line #isWithJunctions from line service', () => {
        // Arrange

        // Act
        component['setJunctionType']();

        // Assert
        expect(component.isWithJunctions).toBe(lineService.withJunctions);
    });

    it('should set all line attributes after component initialized from line service', () => {
        // Arrange

        // Act
        component.ngOnInit();

        // Assert
        expect(component.lineWidth).toBe(lineService.width);
        expect(component.junctionRadius).toBe(lineService.radius);
        expect(component.isWithJunctions).toBe(lineService.withJunctions);
    });

    it('should subscribe to color service', () => {
        // Arrange

        // Act
        component['subscribeToColor']();

        // Assert
        expect(subscribeToColorObservableSpy).toHaveBeenCalled();
    });

    it('should set line color after subscribing to color service', () => {
        // Arrange

        // Act
        component['subscribeToColor']();

        // Assert
        expect(lineService.color).toBe(colorPaletteStub.selectedColor);
    });

    it('should set line width on #widthChanged', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 40 };

        // Act
        component.widthChanged(event);

        // Assert
        expect(lineService.width).toBe(40);
    });

    it('should update #lineWidth on #widthChanged', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 10 };

        // Act
        component.widthChanged(event);
        // Assert
        expect(component.lineWidth).toBe(10);
    });

    it('should set line withJunctions on #withJunctionsToggled', () => {
        // Arrange
        const toggle: any = {};
        const event = { source: toggle, checked: true };

        // Act
        component.withJunctionsToggled(event);

        // Assert
        expect(lineService.withJunctions).toBe(true);
    });

    it('should update #isWithJunctions on #withJunctionsToggled', () => {
        // Arrange
        const toggle: any = {};
        const event = { source: toggle, checked: false };

        // Act
        component.withJunctionsToggled(event);

        // Assert
        expect(component.isWithJunctions).toBe(false);
    });

    it('should set line radius on #junctionRadiusChanged', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 23 };

        // Act
        component.junctionRadiusChanged(event);
        // Assert
        expect(lineService.radius).toBe(23);
    });

    it('should update #junctionRadius on #junctionRadiusChanged', () => {
        // Arrange
        const slider: any = {};
        const event = { source: slider, value: 12 };

        // Act
        component.junctionRadiusChanged(event);

        // Assert
        expect(component.junctionRadius).toBe(12);
    });

    it('#validateRadius should set radius to the half of the width', () => {
        // Arrange
        const half = Math.round(39 / 2);

        // Act
        component['validateRadius'](39);

        // Assert
        expect(component.junctionRadius).toBe(half);
    });

    // extra front end tests

    it('should call #widthChanged after width slider "input" event ', () => {
        // Arrange
        spyOn(component, 'widthChanged');
        const componentDebug = fixture.debugElement;
        const slider = componentDebug.query(By.css('#widthSlider'));

        // Act
        slider.triggerEventHandler('input', { value: 10 });

        // Assert
        expect(component.widthChanged).toHaveBeenCalledTimes(1);
    });

    it('should call #withJunctionsToggled after width slider "change" event ', () => {
        // Arrange
        spyOn(component, 'withJunctionsToggled');
        const componentDebug = fixture.debugElement;
        const slider = componentDebug.query(By.css('#borderToggle'));

        // Act
        slider.triggerEventHandler('change', { checked: false });

        // Assert
        expect(component.withJunctionsToggled).toHaveBeenCalledTimes(1);
    });

    it('should call #junctionRadiusChanged after width slider "input" event ', () => {
        // Arrange
        spyOn(component, 'junctionRadiusChanged');
        const componentDebug = fixture.debugElement;
        const slider = componentDebug.query(By.css('#radiusSlider'));

        // Act
        slider.triggerEventHandler('input', { value: 10 });

        // Assert
        expect(component.junctionRadiusChanged).toHaveBeenCalledTimes(1);
    });
});
