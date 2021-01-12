import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Color, ColorAttributes, ColorPalette } from '@app/classes/color/color';
import { ColorService } from '@app/services/tools/color/color.service';
import { Subscription } from 'rxjs';

const HEXCODE_LENGTH = 6;
const SLICE = 2;
const BASE_10 = 10;
const MAX_OPACITY = 1;
const MAX_HUE_RANGE = 360;
const MAX_RGB_LENGTH = 2;
const INITIAL_BLUE_COLOR = 'rgba(62, 118, 169, 1)';
const INITIAL_RED_COLOR = 'rgba(255, 0, 0, 1)';

enum Ascii {
    zero = 48,
    nine = 57,
    capital_a = 65,
    capital_f = 70,
    small_a = 97,
    small_f = 102,
}

enum Index {
    red_index = 0,
    green_index = 1,
    blue_index = 2,
    opacity_first = 3,
    opacity_second = 4,
    primary_index = 0,
    secondary_index = 1,
}

@Component({
    selector: 'app-color-palette',
    templateUrl: './color-palette.component.html',
    styleUrls: ['./color-palette.component.scss'],
})
export class ColorPaletteComponent implements OnInit, OnDestroy {
    @ViewChild('red') redInput: ElementRef;
    @ViewChild('green') greenInput: ElementRef;
    @ViewChild('blue') blueInput: ElementRef;
    @ViewChild('hexCode') hexInput: ElementRef;

    sliderColor: string;
    canvasColor: string;
    hueValue: number;
    openPalette: boolean;
    disableApplyButton: boolean;
    colorsAttribute: ColorAttributes;
    colorsPalette: ColorPalette; // holds all attribute (primary-secondary color, selected color, lastTenColors[])

    private isPrimaryColor: boolean;
    private colorsSubscription: Subscription;
    private colorService: ColorService;
    private currentColor: Color;

    constructor(colorService: ColorService) {
        this.colorService = colorService;
    }

    ngOnInit(): void {
        this.initialiseValues();
        this.colorsSubscription = this.colorService.getColorsObservable().subscribe((colors: ColorPalette) => {
            this.colorsPalette = colors;
            this.openPalette = false;
            this.updatePrimarySecondaryContainer();
        });
    }

    ngOnDestroy(): void {
        this.colorsSubscription.unsubscribe();
    }

    private initialiseValues(): void {
        this.disableApplyButton = false;
        this.colorsAttribute = {
            red: '3e',
            green: '76',
            blue: 'a9',
            opacity: MAX_OPACITY,
            hexCode: '3e76a9',
            hueValue: 209,
        };
        this.colorsPalette = {
            primaryColor: INITIAL_BLUE_COLOR,
            secondaryColor: INITIAL_RED_COLOR,
            lastTenColors: [],
            selectedColor: INITIAL_BLUE_COLOR,
        };
        this.currentColor = new Color(this.colorsAttribute);
    }

    // called when clicked or slided on color canvas
    setCanvasColor(event: Color): void {
        this.currentColor = event;
        this.canvasColor = this.currentColor.hexCodeValue;
        this.updateAttributes();
    }

    setSliderColor(event: Color): void {
        this.currentColor = event;
        this.currentColor.setOpacity(MAX_OPACITY);
        this.updateCanvasSlider(this.currentColor.hexCodeValue, this.currentColor.hexCodeValue);
        this.updateAttributes();
    }

    // called when dragged hue input slider
    setSliderValue(event: number): void {
        this.hueValue = event;
        this.colorsAttribute.hueValue = event;
        this.currentColor = new Color(this.colorsAttribute);
    }

    // listen for events when sliding on opacity input
    opacityChange(opacity: string): void {
        this.colorsAttribute.opacity = parseFloat(opacity);
        this.currentColor = new Color(this.colorsAttribute);
        this.canvasColor = this.currentColor.rgbaValue; // change small preview
    }

    // detect from hex code input and apply color to canvas
    changeHexCode(hexCode: string): void {
        const correctValue: string = this.validateColorCode(hexCode);

        this.hexInput.nativeElement.value = correctValue;
        this.colorsAttribute.opacity = MAX_OPACITY;

        // check if input's length is 6
        if (correctValue.length !== HEXCODE_LENGTH) {
            this.disableApplyButton = true;
            return;
        }

        this.disableApplyButton = false;

        // remove # from hexcode if code contains #
        if (hexCode.slice(0, 1) === '#') {
            hexCode = hexCode.substr(1);
        }

        this.updateAttributesFromHex(hexCode);
        this.updateColors();
        this.updateCanvasSlider(this.currentColor.hexCodeValue, this.currentColor.hexCodeValue);
    }

    // detect changes from individual rgb inputs and modify colors
    changeRgba(value: string, position: number): void {
        const correctValue: string = this.validateColorCode(value);
        this.colorsAttribute.opacity = MAX_OPACITY;

        this.updateInputs(position, correctValue);
        this.updateButtonStatus();
        this.updateColors();
        this.updateCanvasSlider(this.currentColor.hexCodeValue, this.currentColor.hexCodeValue);
    }

    saveColor(): void {
        let position: number;
        this.isPrimaryColor ? (position = Index.primary_index) : (position = Index.secondary_index);

        this.colorService.addColor(this.currentColor, position);
        this.openPalette = false;
    }

    // inverse primary and secondary color
    swapPrimarySecondary(): void {
        this.disableApplyButton = false;
        this.colorService.swapColors();
        this.updateRgbHexValues();
    }

    // choosing from primary or secondary color when clicked upon
    selectColor(index: number): void {
        index === Index.primary_index ? (this.isPrimaryColor = true) : (this.isPrimaryColor = false);

        // modify array
        this.colorService.selectColorFromPrimarySecondary(index);

        // update canvas
        this.updateRgbHexValues();
        this.openPalette = true;
        this.disableApplyButton = false;
    }

    // when left clicked on individual recent colors
    onLeftClick(spanColor: Color, index: number): void {
        this.colorService.onLeftClick(index);
        this.updateRecentColorsRgbHex(spanColor);
        this.disableApplyButton = false;
    }

    // when right clicked on individual recent colors
    // return false to disable UI pop up
    onRightClick(colors: Color, index: number): boolean {
        this.colorService.onRightClick(index);
        this.updateRecentColorsRgbHex(colors);

        return false;
    }

    private updateInputs(position: number, correctValue: string): void {
        switch (position) {
            case Index.red_index:
                this.redInput.nativeElement.value = correctValue;
                this.colorsAttribute.red = correctValue;
                break;
            case Index.green_index:
                this.greenInput.nativeElement.value = correctValue;
                this.colorsAttribute.green = correctValue;
                break;
            case Index.blue_index:
                this.blueInput.nativeElement.value = correctValue;
                this.colorsAttribute.blue = correctValue;
                break;
        }
    }

    // change rgb codes from hex code of length 6
    private updateAttributesFromHex(hexCode: string): void {
        let slice = 0;

        this.colorsAttribute.red = hexCode.slice(slice, (slice += SLICE)); // 0, 1
        this.colorsAttribute.green = hexCode.slice(slice, (slice += SLICE)); // 2, 3
        this.colorsAttribute.blue = hexCode.slice(slice, (slice += SLICE)); // 4, 5
    }

    private updateAttributes(): void {
        this.colorsAttribute.red = this.currentColor.redValueString;
        this.colorsAttribute.green = this.currentColor.greenValueString;
        this.colorsAttribute.blue = this.currentColor.blueValueString;
        this.colorsAttribute.opacity = MAX_OPACITY;
        this.colorsAttribute.hexCode = this.currentColor.hexCodeValue.substr(1); // remove #
        this.disableApplyButton = false;
    }

    // check if RGB inputs are of length 2 to enable or disable button
    private updateButtonStatus(): void {
        if (
            this.colorsAttribute.red.length === MAX_RGB_LENGTH &&
            this.colorsAttribute.green.length === MAX_RGB_LENGTH &&
            this.colorsAttribute.blue.length === MAX_RGB_LENGTH
        ) {
            this.disableApplyButton = false;
        } else {
            this.disableApplyButton = true;
        }
    }

    private updateColors(): void {
        this.currentColor = new Color(this.colorsAttribute);
        this.colorsAttribute.hexCode = this.currentColor.hexCodeValue.substr(1); // remove #
    }

    /**
     *
     * rgb validation: comparing Ascii codes
     *  a-f, A-F, 0-9
     */
    private validateColorCode(code: string): string {
        let validCode = '';

        for (let i = 0; i < code.length; i++) {
            const char = code.charCodeAt(i);
            if (
                (char >= Ascii.zero && char <= Ascii.nine) ||
                (char >= Ascii.capital_a && char <= Ascii.capital_f) ||
                (char >= Ascii.small_a && char <= Ascii.small_f)
            ) {
                validCode += code[i];
            }
        }

        return validCode;
    }

    // update rgb and hex values
    private updateRgbHexValues(): void {
        const rgbValues = this.colorsPalette.selectedColor.match(/\d+/g);
        if (rgbValues !== null) {
            this.updateSelectedColorAttributes(rgbValues);
            this.updateInterface();
        }
    }

    private updateSelectedColorAttributes(rgbValues: RegExpMatchArray): void {
        this.colorsAttribute = {
            red: this.currentColor.rgbToHexadecimal(parseInt(rgbValues[Index.red_index], BASE_10)),
            green: this.currentColor.rgbToHexadecimal(parseInt(rgbValues[Index.green_index], BASE_10)),
            blue: this.currentColor.rgbToHexadecimal(parseInt(rgbValues[Index.blue_index], BASE_10)),
            opacity: parseFloat(`${rgbValues[Index.opacity_first]}.${rgbValues[Index.opacity_second]}`),
        };
    }

    private updateRecentColorsRgbHex(spanColor: Color): void {
        this.colorsAttribute = {
            red: spanColor.redValueString,
            green: spanColor.greenValueString,
            blue: spanColor.blueValueString,
            opacity: spanColor.opacityValue,
        };
        this.updateInterface();
    }

    private updateInterface(): void {
        this.updateColors();
        this.colorsAttribute.hueValue = Math.ceil(this.currentColor.rgbToHsl()[0] * MAX_HUE_RANGE);
        this.hueValue = this.colorsAttribute.hueValue;
        this.updateCanvasSliderWithOpacity(this.currentColor.rgbaValue);
    }

    // change active containers
    private updatePrimarySecondaryContainer(): void {
        const containers: NodeListOf<Element> = document.querySelectorAll('.primary-secondary-container');

        // remove for every element
        containers.forEach((container) => {
            container.classList.remove('active-primary-secondary');
        });

        // apply to current element based on index
        this.colorsPalette.isLeftContainer
            ? containers[Index.primary_index].classList.add('active-primary-secondary')
            : containers[Index.secondary_index].classList.add('active-primary-secondary');
    }

    private updateCanvasSlider(newSliderColor: string, newCanvasColor: string): void {
        this.sliderColor = newSliderColor; // change main gradient canvas
        this.canvasColor = newCanvasColor; // change small preview
    }

    private updateCanvasSliderWithOpacity(newColor: string): void {
        let rgbCode = '';
        const rgbValues = newColor.match(/\d+/g);

        if (rgbValues !== null) {
            rgbCode = `rgb(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]})`;
            this.sliderColor = rgbCode;
            this.canvasColor = this.colorsPalette.selectedColor;
        }
    }
}
