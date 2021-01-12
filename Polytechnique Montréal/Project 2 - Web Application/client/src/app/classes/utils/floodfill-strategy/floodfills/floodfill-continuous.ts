import { Color } from '@app/classes/color/color';
import { FloodfillStrategy } from '@app/classes/utils/floodfill-strategy/floodfill';
import { Floodfill } from '@app/classes/utils/floodfill-strategy/floodfill-abs';

export class FloodFillContinuousStrategy extends Floodfill implements FloodfillStrategy {
    constructor(fillColor: Color, oldColor: Color, tolerance: number) {
        super(fillColor, oldColor, tolerance);
    }

    do(imageData: ImageData): ImageData {
        this.initTypedBuffer(imageData);

        for (let i = 0; i < this.imageData.width * this.imageData.height; i++) {
            if (this.hasPassedColorTest(i)) {
                this.fillPoint(i);
            }
        }
        return this.imageData;
    }
}
