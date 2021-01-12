export const BASE_10 = 10;
export const MAX_BYTE = 255;
export const N_BITS_IN_BYTE = 8;

export enum Index {
    red = 0,
    green = 1,
    blue = 2,
    opacity_first = 3,
    opacity_second = 4,
    primary = 0,
    secondary = 1,
}

export interface ColorPalette {
    lastTenColors: Color[];
    primaryColor: string;
    secondaryColor: string;
    selectedColor: string;
    isLeftContainer?: boolean;
}

export interface ColorAttributes {
    red: string;
    green: string;
    blue: string;
    opacity: number;
    hexCode?: string;
    hueValue?: number;
}

export class Color {
    private colors: ColorAttributes;
    private rgbaInteger: number;
    redValueNumber: number;
    greenValueNumber: number;
    blueValueNumber: number;
    constructor(colors?: ColorAttributes) {
        if (colors) {
            this.colors = colors;
            this.initializeValues();
            this.toUint32();
        }
    }

    setOpacity(newOpacity: number): void {
        this.colors.opacity = newOpacity;
    }

    // rgb value to hexadecimal
    rgbToHexadecimal(code: number): string {
        let hexCode = code.toString(N_BITS_IN_BYTE * 2);
        if (hexCode.length < 2) hexCode = `0${hexCode}`;
        return hexCode;
    }

    // returns number from 0-255 range
    hexadecimalToRgb(hexCode: string): number {
        return parseInt(hexCode, N_BITS_IN_BYTE * 2);
    }

    private toUint32(): void {
        let offset = 0;

        this.rgbaInteger = this.redValueNumber;
        this.rgbaInteger += this.greenValueNumber * Math.pow(2, N_BITS_IN_BYTE * ++offset);
        this.rgbaInteger += this.blueValueNumber * Math.pow(2, N_BITS_IN_BYTE * ++offset);
        this.rgbaInteger += Math.floor(this.opacityValue * MAX_BYTE) * Math.pow(2, N_BITS_IN_BYTE * ++offset);
    }

    private initializeValues(): void {
        this.redValueNumber = parseInt(this.colors.red, N_BITS_IN_BYTE * 2);
        this.greenValueNumber = parseInt(this.colors.green, N_BITS_IN_BYTE * 2);
        this.blueValueNumber = parseInt(this.colors.blue, N_BITS_IN_BYTE * 2);
    }

    get uint32(): number {
        return this.rgbaInteger;
    }

    get redValueString(): string {
        return this.colors.red;
    }

    get greenValueString(): string {
        return this.colors.green;
    }

    get blueValueString(): string {
        return this.colors.blue;
    }

    get opacityValue(): number {
        return this.colors.opacity;
    }

    get hueValue(): number | undefined {
        return this.colors.hueValue;
    }

    get hexCodeValue(): string {
        return `#${this.colors.red}${this.colors.green}${this.colors.blue}`;
    }

    get rgbaValue(): string {
        return `rgba(${this.hexadecimalToRgb(this.colors.red)}, ${this.hexadecimalToRgb(this.colors.green)}, ${this.hexadecimalToRgb(
            this.colors.blue,
        )}, ${this.colors.opacity})`;
    }

    rgbaToColorAttributes(selectedColor: string): ColorAttributes {
        const rgbValues = selectedColor.match(/\d+/g) as RegExpMatchArray;

        this.colors = {
            red: this.rgbToHexadecimal(parseInt(rgbValues[Index.red], BASE_10)),
            green: this.rgbToHexadecimal(parseInt(rgbValues[Index.green], BASE_10)),
            blue: this.rgbToHexadecimal(parseInt(rgbValues[Index.blue], BASE_10)),
            opacity: parseFloat(`${rgbValues[Index.opacity_first]}.${rgbValues[Index.opacity_second]}`),
        };
        return this.colors;
    }

    rgbToHsl(): number[] {
        const red = this.hexadecimalToRgb(this.colors.red) / MAX_BYTE;
        const green = this.hexadecimalToRgb(this.colors.green) / MAX_BYTE;
        const blue = this.hexadecimalToRgb(this.colors.blue) / MAX_BYTE;

        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);
        let h = 0;
        let s: number;
        const l: number = (max + min) / 2;
        const maxOffset = 6;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 1 / 2 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case red:
                    h = (green - blue) / d + (green < blue ? maxOffset : 0);
                    break;
                case green:
                    h = (blue - red) / d + 2;
                    break;
                case blue:
                    h = (red - green) / d + 2 * 2;
                    break;
            }
            h /= maxOffset;
        }

        return [h, s, l];
    }
}
