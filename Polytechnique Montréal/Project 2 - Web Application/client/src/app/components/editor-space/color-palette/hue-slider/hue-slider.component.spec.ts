import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Color, ColorAttributes } from '@app/classes/color/color';
import { MaterialModule } from '@app/material.module';
import { HueSliderComponent } from './hue-slider.component';

// tslint:disable:no-string-literal

const MAX_HUE_RANGE = 360;
const MAX_RGB_RANGE = 255;

enum HueValues {
    red = 0,
    yellow = 60,
    green = 120,
    blue = 240,
    purple = 300,
}

// green
const colorAttributes: ColorAttributes = {
    red: '00',
    green: 'ff',
    blue: '00',
    opacity: 1,
    hueValue: HueValues.green,
    hexCode: '#00ff00',
};

describe('HueSliderComponent', () => {
    let component: HueSliderComponent;
    let fixture: ComponentFixture<HueSliderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HueSliderComponent],
            imports: [NoopAnimationsModule, MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HueSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#hueChange should update color depending on hue value', () => {
        component.onHueChange(HueValues.green);
        expect(component['color']).toEqual(new Color(colorAttributes));
    });

    it('#hueChange should emit color upon hue value changed', () => {
        let updatedColor: Color = new Color();

        component.hueColor.subscribe((color: Color) => {
            updatedColor = color;
        });

        component.onHueChange(HueValues.green);
        expect(updatedColor).toEqual(new Color(colorAttributes));
    });

    it('#hueChange should emit hue value upon hue value changed', () => {
        let newHueValue = 0;

        component.hueValue.subscribe((hue: number) => {
            newHueValue = hue;
        });

        component.onHueChange(HueValues.green);
        expect(newHueValue).toBe(HueValues.green);
    });

    it('#getNewColorAttributes should return a color based on hue value', () => {
        const colorData = [0, MAX_RGB_RANGE, 0]; // green data

        const greenColor = component['getNewColorAttributes'](colorData, HueValues.green);
        expect(greenColor).toEqual(colorAttributes);
    });

    it('#ngOnChanges should modify hue value when detecting a change on hue value', () => {
        component.latestHueValue = MAX_HUE_RANGE;
        const changes = {
            latestHueValue: new SimpleChange(null, component.latestHueValue, false),
        };

        component.ngOnChanges(changes);
        fixture.detectChanges();

        expect(component.newHueValue).toBe(component.latestHueValue);
    });

    it('#ngOnChanges should not modify hue value if #latestHueValue has not been changed', () => {
        component.latestHueValue = MAX_HUE_RANGE;
        const changes = {
            nullAttribute: new SimpleChange(null, component.latestHueValue, false),
        };

        component.ngOnChanges(changes);
        fixture.detectChanges();

        expect(component.newHueValue).not.toBe(component.latestHueValue);
    });

    it('#hslToRgb should convert hsl value to rgb values', () => {
        const redHsl: number = HueValues.red;
        const yellowHsl: number = HueValues.yellow / MAX_HUE_RANGE;
        const greenHsl: number = HueValues.green / MAX_HUE_RANGE;
        const blueHsl: number = HueValues.blue / MAX_HUE_RANGE;
        const purpleHsl: number = HueValues.purple / MAX_HUE_RANGE;

        expect(component['hslToRgb'](redHsl)).toEqual([MAX_RGB_RANGE, 0, 0]);
        expect(component['hslToRgb'](greenHsl)).toEqual([0, MAX_RGB_RANGE, 0]);
        expect(component['hslToRgb'](blueHsl)).toEqual([0, 0, MAX_RGB_RANGE]);
        expect(component['hslToRgb'](yellowHsl)).toEqual([MAX_RGB_RANGE, MAX_RGB_RANGE, 0]);
        expect(component['hslToRgb'](purpleHsl)).toEqual([MAX_RGB_RANGE, 0, MAX_RGB_RANGE]);
    });
});
