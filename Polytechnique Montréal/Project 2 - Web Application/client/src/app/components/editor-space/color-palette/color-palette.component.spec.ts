import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Color, ColorAttributes, ColorPalette } from '@app/classes/color/color';
import { HueSliderComponent } from '@app/components/editor-space/color-palette/hue-slider/hue-slider.component';
import { PaletteComponent } from '@app/components/editor-space/color-palette/palette/palette.component';
import { MaterialModule } from '@app/material.module';
import { ColorService } from '@app/services/tools/color/color.service';
import { ColorPaletteComponent } from './color-palette.component';

// tslint:disable:no-string-literal
// tslint:disable:no-any

const HUE_VALUE = 108;
const OPACITY = 0.3;
const PRIMARY_INDEX = 0;
const SECONDARY_INDEX = 1;
const RED_COLOR = 'rgba(255, 0, 0, 1)';
const GREEN_COLOR = 'rgba(0, 255, 0, 1)';

describe('ColorPaletteComponent', () => {
    let component: ColorPaletteComponent;
    let fixture: ComponentFixture<ColorPaletteComponent>;
    let colorAttributes: ColorAttributes;
    let newColor: Color;
    let colorService: jasmine.SpyObj<ColorService>;
    let palette: ColorPalette;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPaletteComponent, HueSliderComponent, PaletteComponent],
            imports: [NoopAnimationsModule, MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPaletteComponent);
        component = fixture.componentInstance;
        colorService = jasmine.createSpyObj('ColorService', [
            'addColor',
            'swapColors',
            'selectColorFromPrimarySecondary',
            'onLeftClick',
            'onRightClick',
        ]);

        colorAttributes = {
            red: 'ff',
            green: '00',
            blue: '00',
            opacity: 1,
            hexCode: 'ff0000',
            hueValue: 0,
        };

        palette = {
            primaryColor: GREEN_COLOR,
            secondaryColor: RED_COLOR,
            selectedColor: GREEN_COLOR,
            lastTenColors: [],
        };

        newColor = new Color(colorAttributes);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#setCanvasColor should update color values', () => {
        component.setCanvasColor(newColor);
        expect(component['currentColor']).toBe(newColor);
        expect(component.canvasColor).toBe(newColor.hexCodeValue);
    });

    it('#setSliderColor should update color values as well as modify opacity', () => {
        component.setSliderColor(newColor);
        expect(component['currentColor']).toBe(newColor);
        expect(component['currentColor'].opacityValue).toBe(1);
    });

    it('#setSliderValue should update the hue value', () => {
        component.setSliderValue(HUE_VALUE);
        expect(component.hueValue).toBe(HUE_VALUE);
        expect(component.colorsAttribute.hueValue).toBe(HUE_VALUE);
    });

    it('#updateAttributes should assign latest values to colorAttribue variable', () => {
        component['currentColor'] = newColor;
        component['updateAttributes']();
        expect(component.colorsAttribute.red).toBe(colorAttributes.red);
        expect(component.colorsAttribute.green).toBe(colorAttributes.green);
        expect(component.colorsAttribute.blue).toBe(colorAttributes.blue);
        expect(component.colorsAttribute.hexCode).toBe(colorAttributes.hexCode);
        expect(component.colorsAttribute.opacity).toBe(colorAttributes.opacity);
    });

    it('#opacityChange should assign a new opacity to attributes when input opacity has been changed', () => {
        const newOpacity = '0.3';
        colorAttributes.opacity = OPACITY;

        component.opacityChange(newOpacity);
        component['currentColor'] = newColor;
        expect(component['currentColor']).not.toEqual(new Color(colorAttributes));
        expect(component.colorsAttribute.opacity).toBe(OPACITY);
    });

    it('#changeRgba should modify valid rgb values of inputs and attributes', () => {
        component.changeRgba('aw', 0);
        expect(component.colorsAttribute.red).toEqual('a');

        component.changeRgba('p2', 1);
        expect(component.colorsAttribute.green).toEqual('2');

        component.changeRgba('ff', 2);
        expect(component.colorsAttribute.blue).toEqual('ff');
    });

    it('#verifyInputLengthValidation should disable button if either red value, blue value or green value is less than 2', () => {
        component.colorsAttribute.red = 'a';
        component.colorsAttribute.green = 'cc';
        component.colorsAttribute.blue = 'ff';
        component['updateButtonStatus']();
        expect(component.disableApplyButton).toBe(true);
    });

    it('#verifyInputLengthValidation should enable button if all three values of rgb is equal than 2', () => {
        component.colorsAttribute.red = 'a2';
        component.colorsAttribute.green = 'a2';
        component.colorsAttribute.blue = 'd0';
        component['updateButtonStatus']();
        expect(component.disableApplyButton).toBe(false);
    });

    it('#updateColors should set the current color to the latest color attributes', () => {
        component.colorsAttribute = colorAttributes;
        component['updateColors']();
        expect(component['currentColor']).toEqual(newColor);
        expect(component.colorsAttribute.hexCode).toBe(newColor.hexCodeValue.substr(1));
    });

    it('#validateColorCode should return a valid color value between a-f and A-F and 0-9', () => {
        expect(component['validateColorCode']('wr')).toEqual('');
        expect(component['validateColorCode']('a-')).toEqual('a');
        expect(component['validateColorCode']('0m')).toEqual('0');
        expect(component['validateColorCode']('a2a2dk')).toEqual('a2a2d');
        expect(component['validateColorCode']('a2a2d0')).toEqual('a2a2d0');
    });

    it('#changeHexCode should disable save button if hex code value is less than 6', () => {
        component.changeHexCode('00ff0');
        expect(component.disableApplyButton).toBe(true);
    });

    it('#changeHexCode should not modify values if length of hex code value is less than 6', () => {
        component.changeHexCode('00ff0');
        expect(component.colorsAttribute.red).not.toEqual('00');
        expect(component.colorsAttribute.green).not.toEqual('ff');
        expect(component.colorsAttribute.blue).not.toEqual('0');
    });

    it('#changeHexCode should enable save button if hex code value is equal to 6', () => {
        component.changeHexCode('00ff00');
        expect(component.disableApplyButton).toBe(false);
    });

    it('#changeHexCode should update color attributes upon hex value changes', () => {
        component.changeHexCode('#a2a2d0');

        expect(component.colorsAttribute.red).toEqual('a2');
        expect(component.colorsAttribute.green).toEqual('a2');
        expect(component.colorsAttribute.blue).toEqual('d0');
    });

    it('#changeHexCode should remove # if hex code starts with #', () => {
        const hexCode = '#ff00ff';
        component.changeHexCode(hexCode);
        expect(component.colorsAttribute.hexCode).toBe('ff00ff');
    });

    it('#changeHexCode should return same hex code if it does not start with #', () => {
        const hexCode = 'ff00ff';
        component.changeHexCode(hexCode);
        expect(component.colorsAttribute.hexCode).toBe('ff00ff');
    });

    it('#updateAttributesFromHex should separate hexCode into individual RGB values', () => {
        component['updateAttributesFromHex']('ff0022');
        expect(component.colorsAttribute.red).toEqual('ff');
        expect(component.colorsAttribute.green).toEqual('00');
        expect(component.colorsAttribute.blue).toEqual('22');
    });

    it('#updateRgbHexValues should not modify attributes if selected color format is not in rgba format', () => {
        const redColor = 'red';

        component.colorsPalette.selectedColor = redColor;
        component['updateRgbHexValues']();

        expect(component.colorsAttribute.red).not.toEqual('ff');
        expect(component.colorsAttribute.green).not.toEqual('00');
        expect(component.colorsAttribute.blue).not.toEqual('00');
    });

    it('#updateRgbHexValues should divide rgb values into individual hexadecimal values and assign them to attributes', () => {
        const purpleColor = 'rgba(165, 141, 158, 0.3)';
        const purpleHueValue = 318;

        component.colorsPalette.selectedColor = purpleColor;
        component['updateRgbHexValues']();

        expect(component.colorsAttribute.red).toEqual('a5');
        expect(component.colorsAttribute.green).toEqual('8d');
        expect(component.colorsAttribute.blue).toEqual('9e');
        expect(component.colorsAttribute.opacity).toEqual(OPACITY);
        expect(component.colorsAttribute.hueValue).toEqual(purpleHueValue);
        expect(component.hueValue).toEqual(purpleHueValue);
    });

    it('#updateRecentColorsRgbHex should assign new color to attributes', () => {
        component['updateRecentColorsRgbHex'](newColor);
        expect(component.colorsAttribute.red).toBe(colorAttributes.red);
        expect(component.colorsAttribute.green).toBe(colorAttributes.green);
        expect(component.colorsAttribute.blue).toBe(colorAttributes.blue);
        expect(component.colorsAttribute.hueValue).toBe(colorAttributes.hueValue);
    });

    it('#updateCanvasSlider should assign new color to canvas', () => {
        component['updateCanvasSlider'](GREEN_COLOR, RED_COLOR);
        expect(component.sliderColor).toBe(GREEN_COLOR);
        expect(component.canvasColor).toBe(RED_COLOR);
    });

    it('#updateCanvasSliderWithOpacity should assign initial color without opacity to canvas and initial color with opacity to preview', () => {
        const blueColor = 'rgba(0, 255, 255, 0.5)';
        component.colorsPalette.selectedColor = blueColor;
        component['updateCanvasSliderWithOpacity'](blueColor);
        expect(component.sliderColor).toEqual('rgb(0, 255, 255)');
        expect(component.canvasColor).toEqual('rgba(0, 255, 255, 0.5)');
    });

    it('#updateCanvasSliderWithOpacity should not assign new values to variables if rgb color is not well formatted', () => {
        const blueColor = 'blue';
        component['updateCanvasSliderWithOpacity'](blueColor);
        expect(component.sliderColor).not.toEqual('rgb(0, 255, 255)');
        expect(component.canvasColor).not.toEqual('rgba(0, 255, 255, 0.5)');
    });

    it('#saveColor should call addColor from ColorService with the index of secondary container(1)', () => {
        component = new ColorPaletteComponent(colorService);
        component['isPrimaryColor'] = false;
        component.saveColor();

        expect(colorService.addColor).toHaveBeenCalledTimes(1);
        expect(component.openPalette).toBeFalsy();
    });

    it('#saveColor should call addColor from ColorService with the index of secondary container(2)', () => {
        component = new ColorPaletteComponent(colorService);
        component['isPrimaryColor'] = true;
        component.saveColor();

        expect(colorService.addColor).toHaveBeenCalledTimes(1);
        expect(component.openPalette).toBeFalsy();
    });

    it('#swapPrimarySecondary should call swapColors from ColorService', () => {
        component = new ColorPaletteComponent(colorService);

        component.colorsPalette = palette;
        component['currentColor'] = newColor;
        component.colorsAttribute = colorAttributes;
        component.swapPrimarySecondary();

        expect(colorService.swapColors).toHaveBeenCalledTimes(1);
        expect(component.disableApplyButton).toBeFalsy();
    });

    it('#selectColor should set #isPrimaryColor to true if primary index is passed to function', () => {
        component.selectColor(PRIMARY_INDEX);
        expect(component['isPrimaryColor']).toBeTruthy();
    });

    it('#selectColor should set #isPrimaryColor to false if secondary index is passed to function', () => {
        component.selectColor(SECONDARY_INDEX);
        expect(component['isPrimaryColor']).toBeFalsy();
    });

    it('#selectColor should call selectColorFromPrimarySecondary from ColorService', () => {
        component = new ColorPaletteComponent(colorService);

        component.colorsPalette = palette;
        component['currentColor'] = newColor;
        component.colorsAttribute = colorAttributes;
        component.selectColor(PRIMARY_INDEX);
        expect(colorService.selectColorFromPrimarySecondary).toHaveBeenCalledTimes(1);
    });

    it('#recentColorsClicked should call onLeftClick from ColorService', () => {
        component = new ColorPaletteComponent(colorService);

        component.colorsPalette = palette;
        component['currentColor'] = newColor;
        component.colorsAttribute = colorAttributes;
        component.onLeftClick(newColor, SECONDARY_INDEX);
        expect(colorService.onLeftClick).toHaveBeenCalledTimes(1);
    });

    it('#onRightClick should call onRightClick from ColorService', () => {
        component = new ColorPaletteComponent(colorService);

        component.colorsPalette = palette;
        component['currentColor'] = newColor;
        component.colorsAttribute = colorAttributes;
        component.onRightClick(newColor, PRIMARY_INDEX);
        expect(colorService.onRightClick).toHaveBeenCalledTimes(1);
    });

    it('#updateInterface should update values and update canvas', () => {
        spyOn<any>(component, 'updateColors');
        spyOn<any>(component, 'updateCanvasSliderWithOpacity');
        component['updateInterface']();
        expect(component['updateColors']).toHaveBeenCalledTimes(1);
        expect(component['updateCanvasSliderWithOpacity']).toHaveBeenCalledTimes(1);
    });
});
