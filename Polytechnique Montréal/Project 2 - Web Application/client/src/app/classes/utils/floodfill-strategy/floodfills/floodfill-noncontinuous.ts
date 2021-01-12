import { Color } from '@app/classes/color/color';
import { FloodfillStrategy } from '@app/classes/utils/floodfill-strategy/floodfill';
import { Floodfill } from '@app/classes/utils/floodfill-strategy/floodfill-abs';
import { IndexWithSurroundings } from '@app/classes/utils/floodfill-strategy/index-surroundings/index-surroundings';
import { Queue } from '@app/classes/utils/queue';

export class FloodFillNonContinuousStrategy extends Floodfill implements FloodfillStrategy {
    private queue: Queue<IndexWithSurroundings>;
    mouseDownIndex: number;

    constructor(public fillColor: Color, public oldColor: Color, tolerance: number, mouseDownIndex: number) {
        super(fillColor, oldColor, tolerance);
        this.queue = new Queue<IndexWithSurroundings>();
        this.mouseDownIndex = mouseDownIndex;
    }

    do(imageData: ImageData): ImageData {
        this.initTypedBuffer(imageData);

        const indexWithSurroundings = new IndexWithSurroundings(this.mouseDownIndex, imageData.width);

        this.queue.push(indexWithSurroundings);
        while (!this.queue.isEmpty()) {
            const p = this.queue.pop() as IndexWithSurroundings;

            this.processNeighbour(p.west);
            this.processNeighbour(p.east);
            this.processNeighbour(p.north);
            this.processNeighbour(p.south);
        }

        return this.imageData;
    }

    private processNeighbour(neighbour: IndexWithSurroundings): void {
        if (this.isInsideCanvas(neighbour.center) && this.hasPassedColorTest(neighbour.center)) {
            this.queue.push(neighbour);
            this.fillPoint(neighbour.center);
        }
    }
}
