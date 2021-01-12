import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { Matrix } from '@app/classes/matrix/matrix';
import { Selection } from '@app/classes/selection-shape/selection/selection';
import { ToolType } from '@app/declarations/tool-declarations';
import { AlertService } from '@app/services/alert/alert.service';
import { BoundingBoxService } from '@app/services/tools/selection/bounding-box/bounding-box.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { TransformationMatrixService } from '@app/services/tools/selection/transformer/transformation-matrix.service';

export const ERROR_COPY_MESSAGE = "Ne peut pas coller une selection d'un autre type !";
export interface SelectionCopy {
    selection: Selection;
    borderPoints: Set<Vec2>;
    matrix: Matrix;
    type: ToolType;
}
@Injectable({
    providedIn: 'root',
})
export class ClipboardService {
    private clipboard: SelectionCopy[];
    selectionService: SelectionService;

    constructor(public boundingBox: BoundingBoxService, private trans: TransformationMatrixService, public alert: AlertService) {
        this.clipboard = [];
    }

    cut(): void {
        if (this.disabled) return;
        this.saveSelection();
        this.selectionService.delete();
    }

    copy(): void {
        if (this.disabled) return;
        this.saveSelection();
    }

    paste(): void {
        if (this.selectionService.type !== this.savedSelection.type) {
            this.alert.showSnackBarAlert(ERROR_COPY_MESSAGE);
            return;
        }
        this.selectionService.paste(this.savedSelection);
    }

    delete(): void {
        if (this.disabled) return;
        this.selectionService.delete();
    }

    private saveSelection(): void {
        this.clear();
        this.clipboard.push({
            selection: this.selectionService.currentSelection,
            borderPoints: new Set(this.boundingBox.borderPoints),
            matrix: this.getTranslatedMatrix(),
            type: this.selectionService.type,
        });
    }

    private getTranslatedMatrix(): Matrix {
        const matrix = this.trans.matrix.clone();
        const clipBoardTrans = new Matrix([
            [1, 0, -this.boundingBox.left],
            [0, 1, -this.boundingBox.top],
            [0, 0, 1],
        ]);
        const m = clipBoardTrans.multiply(matrix);
        return m;
    }

    private clear(): void {
        this.clipboard = [];
    }

    get disabled(): boolean {
        return !this.selectionService.selectionActive;
    }

    get empty(): boolean {
        return this.clipboard.length === 0;
    }

    get savedSelection(): SelectionCopy {
        return this.clipboard[0];
    }
}
