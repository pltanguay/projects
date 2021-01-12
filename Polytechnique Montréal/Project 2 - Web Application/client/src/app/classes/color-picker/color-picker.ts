import { Color } from '@app/classes/color/color';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { pickColorsFromCanvas } from '@app/classes/utils/canvas-helper';

const POSITION_OFFSET = 7;
const NO_COLOR = 'rgba(0, 0, 0, 0)';

export interface PixelPicker {
    surroundingPixels: string[];
    middlePixel: string;
    shouldPickerBeAvailable: boolean;
}

export class ColorPicker {
    pixelPicker: PixelPicker;
    private currentColors: Color[];

    constructor() {
        this.initialiseValues();
    }

    private initialiseValues(): void {
        this.currentColors = [];
        this.pixelPicker = {
            middlePixel: '',
            surroundingPixels: [],
            shouldPickerBeAvailable: false,
        };
    }

    calculateSurroundingPixels(mousePosition: Vec2, canvas: CanvasRenderingContext2D): void {
        this.getSuroundingColors(mousePosition, canvas);
        this.updatePixelAttribute();
    }

    private getSuroundingColors(mousePosition: Vec2, context: CanvasRenderingContext2D): void {
        const upperLeft: Vec2 = { x: mousePosition.x - POSITION_OFFSET, y: mousePosition.y - POSITION_OFFSET };
        this.currentColors = pickColorsFromCanvas(upperLeft, POSITION_OFFSET * 2 + 1, POSITION_OFFSET * 2 + 1, context);
    }

    private updatePixelAttribute(): void {
        this.pixelPicker.middlePixel = this.currentColor.hexCodeValue; // update middle color
        this.pixelPicker.surroundingPixels = []; // clear array
        this.currentColor.rgbaValue === NO_COLOR
            ? (this.pixelPicker.shouldPickerBeAvailable = false)
            : (this.pixelPicker.shouldPickerBeAvailable = true);

        this.currentColors.forEach((color: Color) => {
            this.pixelPicker.surroundingPixels.push(color.rgbaValue);
        });
    }

    get currentColor(): Color {
        return this.currentColors[Math.floor(this.currentColors.length / 2)];
    }

    set pickerAvailability(shouldBeAvailable: boolean) {
        this.pixelPicker.shouldPickerBeAvailable = shouldBeAvailable;
    }
}
