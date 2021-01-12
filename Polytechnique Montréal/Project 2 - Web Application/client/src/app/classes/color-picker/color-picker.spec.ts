import { ElementRef } from '@angular/core';
import { ColorPicker } from '@app/classes/color-picker/color-picker';
import { Color, ColorAttributes } from '@app/classes/color/color';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { pickColorsFromCanvas } from '@app/classes/utils/canvas-helper';

const PICKER_LENGTH = 225;
const width = 500;
const height = 500;

// tslint:disable:no-string-literal

describe('Color-Picker', () => {
    let colorPicker: ColorPicker;
    let mousePosition: Vec2;
    let canvasStub;
    let canvasElement: ElementRef<HTMLCanvasElement>;
    let canvas: CanvasRenderingContext2D;
    let colorAttributes: ColorAttributes;

    beforeEach(() => {
        colorPicker = new ColorPicker();
        canvasStub = document.createElement('canvas');
        canvasElement = new ElementRef<HTMLCanvasElement>(canvasStub);
        canvas = canvasElement.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        mousePosition = {
            x: 100,
            y: 100,
        };
        colorAttributes = {
            red: 'ff',
            blue: 'ff',
            green: 'ff',
            opacity: 1,
            hexCode: '#ffffff',
        };
    });

    it('should be created', () => {
        expect(colorPicker).toBeTruthy();
    });

    it('#calculateSurroundingPixels should push the data of surrounding pixels of total length of 225', () => {
        // Arrange

        // Act
        colorPicker.calculateSurroundingPixels(mousePosition, canvas);

        // Assert
        expect(colorPicker['pixelPicker'].surroundingPixels.length).toBe(PICKER_LENGTH);
    });

    it('#pickColorFromCanvas should return a color based upon mouse position', () => {
        // Arrange
        canvas.fillStyle = '#ffffff';
        canvas.fillRect(0, 0, width, height);

        // Act
        const color: Color = pickColorsFromCanvas(mousePosition, 1, 1, canvas)[0];

        // Assert
        expect(color.rgbaValue).toEqual('rgba(255, 255, 255, 1)');
    });

    it('#updatePixelAttribute should update #pixelPicker to latest attributes depending on mouse position', () => {
        // Arrange
        const colors = colorPicker['currentColors'];
        colorPicker['currentColors'][Math.floor(colors.length / 2)] = new Color(colorAttributes);

        // Act
        colorPicker['updatePixelAttribute']();

        // Arrange
        expect(colorPicker['pixelPicker'].middlePixel).toEqual('#ffffff');
        expect(colorPicker['pixelPicker'].surroundingPixels).not.toEqual([]);
    });

    it('#setPickerAvailability should update #shouldPickerBeAvailable', () => {
        colorPicker.pickerAvailability = true;
        expect(colorPicker['pixelPicker'].shouldPickerBeAvailable).toBe(true);

        colorPicker.pickerAvailability = false;
        expect(colorPicker['pixelPicker'].shouldPickerBeAvailable).toBe(false);
    });

    it('#getSurroundingPixels should return the #surroundingPixels', () => {
        // Arrange
        let initialPixels: string[] = [];
        colorPicker['pixelPicker'].surroundingPixels = ['red'];

        // Act
        initialPixels = colorPicker.pixelPicker.surroundingPixels;

        // Assert
        expect(initialPixels).toEqual(['red']);
    });

    it('#getMiddlePixel should return the #middlePixel', () => {
        // Arrange
        let middlePixel: string;
        colorPicker['pixelPicker'].middlePixel = 'red';

        // Act
        middlePixel = colorPicker.pixelPicker.middlePixel;

        // Assert
        expect(middlePixel).toEqual('red');
    });
});
