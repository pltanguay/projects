import { Color, ColorAttributes, Index, MAX_BYTE } from '@app/classes/color/color';
import { Vec2 } from '@app/classes/interfaces/vec2';

export const N_COLORS = 4;

export const pickColorsFromCanvas = (mousePosition: Vec2, sw: number, sh: number, ctx: CanvasRenderingContext2D): Color[] => {
    const imageDataToSee: Uint8ClampedArray = ctx.getImageData(mousePosition.x, mousePosition.y, sw, sh).data;
    const colors: Color[] = [];
    for (let i = 0; i < imageDataToSee.length; i += N_COLORS) {
        let color = new Color();
        const newColorAttributes: ColorAttributes = {
            red: color.rgbToHexadecimal(imageDataToSee[i + Index.red]),
            green: color.rgbToHexadecimal(imageDataToSee[i + Index.green]),
            blue: color.rgbToHexadecimal(imageDataToSee[i + Index.blue]),
            opacity: imageDataToSee[i + Index.opacity_first] / MAX_BYTE,
        };
        color = new Color(newColorAttributes);
        colors.push(color);
    }
    return colors;
};
