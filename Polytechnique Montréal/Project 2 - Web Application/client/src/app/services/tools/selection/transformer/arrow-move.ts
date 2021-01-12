import { Vec2 } from '@app/classes/interfaces/vec2';
import { Point } from '@app/classes/utils/point';
import { SnapToGridService } from '@app/services/snap-to-grid/snap-to-grid.service';
import { BoundingBoxService } from '@app/services/tools/selection/bounding-box/bounding-box.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { ARROW_KEYS, CONTINUOUS_MOVE_DELAY, MOVE_WAIT_DELAY } from './constants';
import { TransformationMatrixService } from './transformation-matrix.service';

export class ArrowMove {
    // Injections
    private selection: SelectionService;
    private transformationMatrix: TransformationMatrixService;
    private boundingBox: BoundingBoxService;
    private snapToGridService: SnapToGridService;

    private time: number = 0;
    private delta: number = 0;
    private checkDelay: boolean = true;
    private continuousMove: boolean = false;
    private arrowTranslation: Point;

    pressedArrowKeys: Set<string>;

    constructor(
        selection: SelectionService,
        transformationMatrix: TransformationMatrixService,
        boundingBox: BoundingBoxService,
        snapToGridService: SnapToGridService,
    ) {
        this.selection = selection;
        this.boundingBox = boundingBox;
        this.transformationMatrix = transformationMatrix;
        this.snapToGridService = snapToGridService;
        this.arrowTranslation = { x: 0, y: 0 };
        this.pressedArrowKeys = new Set();
    }

    keyUp(event: KeyboardEvent): void {
        this.pressedArrowKeys.delete(event.key);
        this.arrowTranslation = { x: 0, y: 0 };
    }

    keyDown(event: KeyboardEvent): void {
        if (!this.arrowPressed(event.key)) return;

        if (this.pressedArrowKeys.size === 0) {
            this.pressedArrowKeys.add(event.key);
            this.time = event.timeStamp;
            this.translate();
        }

        this.delta = event.timeStamp - this.time;
        this.continuousMove = this.continuousMove || this.delta > MOVE_WAIT_DELAY;

        this.continuousTranslate(event);
    }

    private continuousTranslate(event: KeyboardEvent): void {
        if (this.continuousMove) {
            this.pressedArrowKeys.add(event.key);
            if (this.checkDelay) {
                this.time = event.timeStamp;
                this.checkDelay = false;
            }
            this.delta = event.timeStamp - this.time;

            if (this.delta >= CONTINUOUS_MOVE_DELAY) {
                this.checkDelay = true;
                this.translate();
            }
        }
    }

    private translate(): void {
        this.pressedArrowKeys.forEach((key: string) => {
            this.arrowTranslation = ARROW_KEYS.get(key) as Point;
            let translation = this.arrowTranslation;

            if (this.snapToGridService.active) {
                translation = this.snapToGridService.getNearestPointTranslation(this.snapToGridService.snapPoint, translation);
                translation = this.snapToGridService.getArrowTranslationPoint(this.arrowTranslation, translation);
            }
            this.translateSelectionPixel(translation);
        });
    }

    arrowPressed(key: string): boolean {
        return ARROW_KEYS.has(key);
    }

    private translateSelectionPixel(offset: Vec2): void {
        this.translateBoundingBox(offset);
        this.transformationMatrix.translate(offset.x, offset.y);
        this.selection.currentSelection.matrix = this.transformationMatrix.matrix;
    }

    private translateBoundingBox(offset: Vec2): void {
        this.boundingBox.applyTranslation(offset);
    }
}
