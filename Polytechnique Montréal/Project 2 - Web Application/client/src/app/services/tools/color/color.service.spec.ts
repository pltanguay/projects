import { TestBed } from '@angular/core/testing';
import { Color, ColorAttributes, ColorPalette } from '@app/classes/color/color';
import { ColorService } from './color.service';
// tslint:disable:no-string-literal

const PRIMARY_INDEX = 0;
const SECONDARY_INDEX = 1;

enum Colors {
    white_color = 'rgba(255, 255, 255, 1)',
    green_color = 'rgba(0, 255, 0, 1)',
    black_color = 'rgba(0, 0, 0, 0.3)',
}

enum Index {
    zero = 0,
    one = 1,
    two = 2,
    three = 3,
    four = 4,
    five = 5,
    six = 6,
    seven = 7,
    eight = 8,
    nine = 9,
    ten = 10,
}

describe('ColorService', () => {
    let service: ColorService;
    let colorAttributes: ColorAttributes;
    let servicePalette: ColorPalette;
    let serviceColor: Color;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = new ColorService();

        servicePalette = {
            primaryColor: Colors.white_color,
            secondaryColor: Colors.green_color,
            selectedColor: Colors.white_color,
            lastTenColors: [],
        };

        // [0] black
        colorAttributes = {
            red: '00',
            green: '00',
            blue: '00',
            opacity: 0.3,
            hexCode: '000000',
            hueValue: 0,
        };
        servicePalette.lastTenColors.push(new Color(colorAttributes)); // pushed black

        // [1] blue
        colorAttributes = {
            red: '00',
            green: '00',
            blue: 'ff',
            opacity: 1,
            hexCode: '0000ff',
            hueValue: 240,
        };
        servicePalette.lastTenColors.push(new Color(colorAttributes)); // pushed blue

        // [2] green
        colorAttributes = {
            red: '00',
            green: 'ff',
            blue: '00',
            opacity: 1,
            hexCode: '00ff00',
            hueValue: 120,
        };
        servicePalette.lastTenColors.push(new Color(colorAttributes)); // pushed green

        serviceColor = new Color(colorAttributes);
        service.setColorsPalette(servicePalette);
        service.setCurrentColor(serviceColor);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#getColorsObservable should update #colorPalette variable to correct color automatically', () => {
        service.addColor(serviceColor, SECONDARY_INDEX); // adding green as secondary color

        service.getColorsObservable().subscribe((colors) => {
            expect(colors.primaryColor).not.toBe(Colors.green_color);
            expect(colors.selectedColor).toBe(Colors.green_color);
            expect(colors.secondaryColor).toBe(Colors.green_color);
        });
    });

    it('#updateLatestColors should set #colorsPalette.selectedColor to the latest chosen color among primary and secondary', () => {
        service.updateLatestColors(PRIMARY_INDEX);
        expect(service.getColorsPalette().selectedColor).toEqual(Colors.green_color);

        service.updateLatestColors(SECONDARY_INDEX);
        expect(service.getColorsPalette().selectedColor).toEqual(Colors.green_color);
    });

    it('#swapColors should inverse #colorsPalette.primaryColor and #colorsPalette.secondaryColor', () => {
        service.swapColors();

        expect(service.getColorsPalette().primaryColor).toEqual(Colors.green_color);
        expect(service.getColorsPalette().secondaryColor).toEqual(Colors.white_color);
    });

    it('#swapColors should be toggled to be updated to the latest color which has changed', () => {
        servicePalette = {
            primaryColor: Colors.white_color,
            secondaryColor: Colors.green_color,
            selectedColor: Colors.white_color,
            lastTenColors: [],
        };
        service.setColorsPalette(servicePalette);
        service.swapColors();
        expect(service.getColorsPalette().selectedColor).toEqual(Colors.green_color);

        servicePalette = {
            primaryColor: Colors.white_color,
            secondaryColor: Colors.green_color,
            selectedColor: Colors.green_color,
            lastTenColors: [],
        };
        service.setColorsPalette(servicePalette);
        service.swapColors();
        expect(service.getColorsPalette().selectedColor).toEqual(Colors.white_color);
    });

    it('#selectColorFromPrimarySecondary should set #colorsPalette.selectedColor to the primary color when clicked on primary container', () => {
        service.selectColorFromPrimarySecondary(PRIMARY_INDEX);
        expect(service.getColorsPalette().selectedColor).toEqual(service.getColorsPalette().primaryColor);
    });

    it('#selectColorFromPrimarySecondary should set #colorsPalette.selectedColor to the secondary color when clicked on secondary container', () => {
        service.selectColorFromPrimarySecondary(SECONDARY_INDEX);
        expect(service.getColorsPalette().selectedColor).toEqual(service.getColorsPalette().secondaryColor);
    });

    it('#onLeftClick should update #colorsPalette.primaryColor and #colorsPalette.selectedColor to the correct index color', () => {
        service.onLeftClick(Index.zero);
        expect(service.getColorsPalette().primaryColor).toEqual(Colors.black_color);
        expect(service.getColorsPalette().secondaryColor).not.toEqual(Colors.black_color);
        expect(service.getColorsPalette().selectedColor).toEqual(Colors.black_color);
    });

    it('#onRightClick should update #colorsPalette.secondaryColor and #colorsPalette.selectedColor to the correct index color', () => {
        service.onRightClick(Index.two);
        expect(service.getColorsPalette().primaryColor).not.toEqual(Colors.green_color);
        expect(service.getColorsPalette().secondaryColor).toEqual(Colors.green_color);
        expect(service.getColorsPalette().selectedColor).toEqual(Colors.green_color);
    });

    it('#addColor should add a new color as primary to #colorsPalette', () => {
        // initial array length is 3

        // before adding
        expect(service.getColorsPalette().lastTenColors.length).toBe(Index.three);

        // [3] yellow
        colorAttributes = {
            red: 'ff',
            green: 'ff',
            blue: '00',
            opacity: 1,
            hexCode: 'FFFF00',
            hueValue: 60,
        };

        // after adding
        service.addColor(new Color(colorAttributes), PRIMARY_INDEX);
        expect(service.getColorsPalette().lastTenColors.length).toBe(Index.four);
    });

    it('#addColor should detect and modify an existing color if its opacity has changed instead of adding a new color', () => {
        // initial array length is 3

        const newOpacity = 0.9;

        // [0] black already exists but changing opacity
        colorAttributes = {
            red: '00',
            green: '00',
            blue: '00',
            opacity: newOpacity,
            hexCode: '000000',
            hueValue: 0,
        };

        service.addColor(new Color(colorAttributes), SECONDARY_INDEX);
        expect(service.getColorsPalette().lastTenColors.length).toBe(Index.three);
        expect(service.getColorsPalette().lastTenColors[Index.zero].opacityValue).toBe(newOpacity);
    });

    it('#addColor should not add the same color twice or more if it already exists', () => {
        // initial array length is 3

        // blue color which already exists at position [1]
        colorAttributes = {
            red: '00',
            green: '00',
            blue: 'ff',
            opacity: 1,
            hexCode: '0000ff',
            hueValue: 240,
        };
        service.addColor(new Color(colorAttributes), SECONDARY_INDEX);
        expect(service.getColorsPalette().lastTenColors.length).toBe(Index.three);
    });

    it('#addColor should remove the first element if the length of #colorsPalette.lastTenColors is bigger than 10', () => {
        // [4] purple
        colorAttributes = {
            red: 'a2',
            green: 'a2',
            blue: 'd0',
            opacity: 1,
            hexCode: 'a2a2d0',
            hueValue: 240,
        };
        service.addColor(new Color(colorAttributes), PRIMARY_INDEX);

        // [5] yellow
        colorAttributes = {
            red: 'ff',
            green: 'ff',
            blue: '00',
            opacity: 1,
            hexCode: 'FFFF00',
            hueValue: 60,
        };
        service.addColor(new Color(colorAttributes), SECONDARY_INDEX);

        // [6] violet
        colorAttributes = {
            red: 'd7',
            green: '88',
            blue: 'ec',
            opacity: 1,
            hexCode: 'd788ec',
            hueValue: 287,
        };
        service.addColor(new Color(colorAttributes), SECONDARY_INDEX);

        // [7] orange
        colorAttributes = {
            red: 'ff',
            green: 'a5',
            blue: '00',
            opacity: 1,
            hexCode: 'ffa400',
            hueValue: 39,
        };
        service.addColor(new Color(colorAttributes), PRIMARY_INDEX);

        // [8] pink
        colorAttributes = {
            red: 'ff',
            green: 'c0',
            blue: 'cb',
            opacity: 1,
            hexCode: 'ffc0cb',
            hueValue: 350,
        };
        service.addColor(new Color(colorAttributes), SECONDARY_INDEX);

        // [9] gold
        colorAttributes = {
            red: 'ff',
            green: 'd7',
            blue: '00',
            opacity: 1,
            hexCode: 'ffd700',
            hueValue: 51,
        };
        service.addColor(new Color(colorAttributes), PRIMARY_INDEX);
        expect(service.getColorsPalette().lastTenColors.length).toBe(Index.nine);

        // [10] brown
        colorAttributes = {
            red: 'd2',
            green: '69',
            blue: '1e',
            opacity: 1,
            hexCode: 'd2691e',
            hueValue: 25,
        };
        service.addColor(new Color(colorAttributes), SECONDARY_INDEX);
        expect(service.getColorsPalette().lastTenColors.length).toBe(Index.ten);

        // [11] grey but array should have been modified to a length of 10
        colorAttributes = {
            red: 'd3',
            green: 'd3',
            blue: 'd3',
            opacity: 1,
            hexCode: 'd3d3d3',
            hueValue: 0,
        };
        service.addColor(new Color(colorAttributes), PRIMARY_INDEX);
        expect(service.getColorsPalette().lastTenColors.length).toBe(Index.ten);
    });

    it('#setPrimaryColor should update primary color and #isLeftContainer to true', () => {
        service['colorsPalette'].isLeftContainer = false;
        service.setPrimaryColor(Colors.green_color);
        expect(service['colorsPalette'].primaryColor).toEqual(Colors.green_color);
        expect(service['colorsPalette'].selectedColor).toEqual(Colors.green_color);
        expect(service['colorsPalette'].isLeftContainer).toBe(true);
    });

    it('#setSecondaryColor should update secondary color and #isLeftContainer to false', () => {
        service['colorsPalette'].isLeftContainer = true;
        service.setSecondaryColor(Colors.black_color);
        expect(service['colorsPalette'].selectedColor).toEqual(Colors.black_color);
        expect(service['colorsPalette'].selectedColor).toEqual(Colors.black_color);
        expect(service['colorsPalette'].isLeftContainer).toBe(false);
    });
});
