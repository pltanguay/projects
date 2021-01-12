import { Injectable } from '@angular/core';
import { Color, ColorAttributes, ColorPalette } from '@app/classes/color/color';
import { BehaviorSubject, Observable } from 'rxjs';

const MAX_COLOR_LENGTH = 10;
const INITIAL_BLUE_COLOR = 'rgba(62, 118, 169, 1)';
const INITIAL_RED_COLOR = 'rgba(255, 0, 0, 1)';

enum Index {
    primary_index = 0,
    secondary_index = 1,
}

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    private currentColor: Color;
    private colorsPalette: ColorPalette;
    private colorAttributes: ColorAttributes;
    private updatedColorsArray: BehaviorSubject<ColorPalette>;

    constructor() {
        this.initialiseValues();
        this.updatedColorsArray = new BehaviorSubject<ColorPalette>(this.colorsPalette);
    }

    initialiseValues(): void {
        this.currentColor = new Color();
        this.colorsPalette = {
            primaryColor: INITIAL_BLUE_COLOR,
            secondaryColor: INITIAL_RED_COLOR,
            lastTenColors: [],
            selectedColor: INITIAL_BLUE_COLOR,
            isLeftContainer: true,
        };
    }

    getColorsObservable(): Observable<ColorPalette> {
        return this.updatedColorsArray.asObservable(); // emits
    }

    /* position value
     * 0: primary color
     * 1: secondary color
     */
    addColor(newColor: Color, position: number): void {
        this.currentColor = newColor;
        this.colorAttributes = {
            red: this.currentColor.redValueString,
            green: this.currentColor.greenValueString,
            blue: this.currentColor.blueValueString,
            opacity: this.currentColor.opacityValue,
            hexCode: this.currentColor.hexCodeValue,
            hueValue: this.currentColor.hueValue,
        };

        for (const [index, color] of this.colorsPalette.lastTenColors.entries()) {
            // check if colors already exists and compare opacity
            if (color.hexCodeValue === this.currentColor.hexCodeValue) {
                // compare opacity
                if (color.opacityValue !== this.currentColor.opacityValue) {
                    this.colorAttributes.opacity = this.currentColor.opacityValue;
                    this.colorsPalette.lastTenColors[index] = new Color(this.colorAttributes);
                }
                this.updateLatestColors(position);

                // exit to prevent adding same color twice
                return;
            }
        }

        if (this.colorsPalette.lastTenColors.length >= MAX_COLOR_LENGTH) this.colorsPalette.lastTenColors.shift(); // removes first color
        this.colorsPalette.lastTenColors.push(new Color(this.colorAttributes));
        this.updateLatestColors(position);
    }

    updateLatestColors(position: number): void {
        position === Index.primary_index
            ? (this.colorsPalette.primaryColor = this.currentColor.rgbaValue)
            : (this.colorsPalette.secondaryColor = this.currentColor.rgbaValue);

        this.colorsPalette.selectedColor = this.currentColor.rgbaValue;
        this.updatedColorsArray.next(this.colorsPalette);
    }

    swapColors(): void {
        let temporaryColor: string;
        const isPrimary: boolean = this.colorsPalette.selectedColor === this.colorsPalette.primaryColor;

        temporaryColor = this.colorsPalette.primaryColor;
        this.colorsPalette.primaryColor = this.colorsPalette.secondaryColor;
        this.colorsPalette.secondaryColor = temporaryColor;

        if (isPrimary) {
            this.colorsPalette.selectedColor = this.colorsPalette.primaryColor;
        } else {
            this.colorsPalette.selectedColor = this.colorsPalette.secondaryColor;
        }

        this.updatedColorsArray.next(this.colorsPalette);
    }

    selectColorFromPrimarySecondary(position: number): void {
        if (position === Index.primary_index) {
            this.colorsPalette.selectedColor = this.colorsPalette.primaryColor;
            this.colorsPalette.isLeftContainer = true;
        } else {
            this.colorsPalette.selectedColor = this.colorsPalette.secondaryColor;
            this.colorsPalette.isLeftContainer = false;
        }

        this.updatedColorsArray.next(this.colorsPalette);
    }

    onLeftClick(index: number): void {
        this.colorsPalette.primaryColor = this.colorsPalette.lastTenColors[index].rgbaValue;
        this.colorsPalette.selectedColor = this.colorsPalette.primaryColor;
        this.colorsPalette.isLeftContainer = true;
        this.updatedColorsArray.next(this.colorsPalette);
    }

    onRightClick(index: number): void {
        this.colorsPalette.secondaryColor = this.colorsPalette.lastTenColors[index].rgbaValue;
        this.colorsPalette.selectedColor = this.colorsPalette.secondaryColor;
        this.colorsPalette.isLeftContainer = false;
        this.updatedColorsArray.next(this.colorsPalette);
    }

    setCurrentColor(newColor: Color): void {
        this.currentColor = newColor;
    }

    getColorsPalette(): ColorPalette {
        return this.colorsPalette;
    }

    setColorsPalette(newPalette: ColorPalette): void {
        this.colorsPalette = newPalette;
    }

    setPrimaryColor(newColor: string): void {
        this.colorsPalette.primaryColor = newColor;
        this.colorsPalette.selectedColor = newColor;
        this.colorsPalette.isLeftContainer = true;
        this.updatedColorsArray.next(this.colorsPalette);
    }

    setSecondaryColor(newColor: string): void {
        this.colorsPalette.secondaryColor = newColor;
        this.colorsPalette.selectedColor = newColor;
        this.colorsPalette.isLeftContainer = false;
        this.updatedColorsArray.next(this.colorsPalette);
    }
}
