import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Color, ColorAttributes } from '@app/classes/color/color';

const MAX_SLIDER_RANGE = 360;
const MAX_UINT8 = 255;

@Component({
    selector: 'app-hue-slider',
    templateUrl: './hue-slider.component.html',
    styleUrls: ['./hue-slider.component.scss'],
})
export class HueSliderComponent implements OnChanges {
    @Input()
    latestHueValue: number;

    @Output()
    hueColor: EventEmitter<Color> = new EventEmitter();

    @Output()
    hueValue: EventEmitter<number> = new EventEmitter();

    newHueValue: number;
    private color: Color;

    constructor() {
        this.color = new Color();
    }

    // set new color upon sliding on hue value input
    onHueChange(hueValueSlider: number): void {
        const colorData: number[] = this.hslToRgb(hueValueSlider / MAX_SLIDER_RANGE);
        const newColor: ColorAttributes = this.getNewColorAttributes(colorData, hueValueSlider);

        this.color = new Color(newColor);
        this.hueColor.emit(this.color);
        this.hueValue.emit(hueValueSlider);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.latestHueValue) {
            this.newHueValue = changes.latestHueValue.currentValue;
        }
    }

    private getNewColorAttributes(colorData: number[], hueValueSlider: number): ColorAttributes {
        return {
            red: this.color.rgbToHexadecimal(colorData[0]),
            green: this.color.rgbToHexadecimal(colorData[1]),
            blue: this.color.rgbToHexadecimal(colorData[2]),
            opacity: 1,
            hueValue: hueValueSlider,
            hexCode: `#${this.color.rgbToHexadecimal(colorData[0])}${this.color.rgbToHexadecimal(colorData[1])}${this.color.rgbToHexadecimal(
                colorData[2],
            )}`,
        };
    }

    // Disabling no magic numbers because of mathematical formula found on stackoverflow
    // tslint:disable:no-magic-numbers
    // https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
    /*
    Equipe 201:
    Bonjour,
    On a pris cette partie d'internet et on a cité la référence.
    Nikolay a été d'accord pour ça !
    Cordialement
  */
    private hueToRgb(p: number, q: number, t: number): number {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

        return p;
    }

    private hslToRgb(h: number): number[] {
        let red: number;
        let green: number;
        let yellow: number;
        const lightness = 0.5;
        const saturation = 1;

        const q = lightness + saturation - lightness * saturation;
        const p = 2 * lightness - saturation;
        red = this.hueToRgb(p, q, h + 1 / 3);
        green = this.hueToRgb(p, q, h);
        yellow = this.hueToRgb(p, q, h - 1 / 3);

        return [Math.round(red * MAX_UINT8), Math.round(green * MAX_UINT8), Math.round(yellow * MAX_UINT8)];
    }

    // tslint:enable:no-magic-numbers
}
