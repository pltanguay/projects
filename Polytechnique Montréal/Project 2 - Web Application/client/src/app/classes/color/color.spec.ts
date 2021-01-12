import { TestBed } from '@angular/core/testing';
import { Color, ColorAttributes } from './color';
// tslint:disable:no-string-literal
const OPACITY = 0.7;
enum RgbCode {
    white = 255,
    thirteen = 13,
}

enum RedHsl {
    hue = 0,
    saturation = 1,
    lightness = 0.5,
}

describe('Color', () => {
    let color: Color;
    let colorAttributes: ColorAttributes;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: Color }],
        });
        colorAttributes = {
            red: 'ff',
            green: '00',
            blue: '00',
            opacity: OPACITY,
            hueValue: 0,
            hexCode: '#ff0000',
        };
        color = new Color(colorAttributes);
    });

    it('should be created', () => {
        expect(color).toBeTruthy();
    });

    it('#rgbToHexadecimal should convert rgb value (0-255) to hexadecimal value', () => {
        expect(color.rgbToHexadecimal(RgbCode.white)).toBe('ff');
    });

    it('#rgbToHexadecimal should append a 0 in front if hexadecimal value is single character (length < 2)', () => {
        expect(color.rgbToHexadecimal(RgbCode.thirteen)).not.toBe('d');
        expect(color.rgbToHexadecimal(RgbCode.thirteen)).toBe('0d');
    });

    it('#hexCodeValue should return a combined color in hex code', () => {
        expect(color.hexCodeValue).toEqual('#ff0000');
    });

    it('#getColors should return the actual color attributes', () => {
        expect(color['colors']).toEqual(colorAttributes);
    });

    it('#rgbaValue should convert red rgb value to hexadecimal and return color in rgba format', () => {
        expect(color.rgbaValue).toEqual(`rgba(255, 0, 0, ${OPACITY})`);
    });

    it('#rgbToHsl should return [0, 0, 0] if individual rgb codes are same', () => {
        colorAttributes = {
            red: '0',
            green: '0',
            blue: '0',
            opacity: OPACITY,
            hexCode: '000000',
            hueValue: 0,
        };
        color = new Color(colorAttributes);
        expect(color.rgbToHsl()).toEqual([0, 0, 0]);
    });

    it('#rgbToHsl should return hsl value if individual rgb colors are not same', () => {
        expect(color.rgbToHsl()).toEqual([RedHsl.hue, RedHsl.saturation, RedHsl.lightness]);
    });
});
