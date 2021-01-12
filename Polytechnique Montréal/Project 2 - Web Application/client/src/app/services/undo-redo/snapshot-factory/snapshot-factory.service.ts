import { Injectable } from '@angular/core';
import { DrawableObject } from '@app/classes/drawable/drawable';
import { Action } from '@app/classes/undo-redo/action/action';
import { actionCallback, ConcreteAction } from '@app/classes/undo-redo/action/concrete-action';
import { InitialMemento } from '@app/classes/undo-redo/memento/initial-memento';
import { Memento, MementoType } from '@app/classes/undo-redo/memento/memento';
import { ResizeMemento } from '@app/classes/undo-redo/memento/resize-memento';
import { CanvasService } from '@app/services/canvas/canvas.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LocalStorageService } from '@app/services/local-storage/local-storage.service';
import { ResizeService } from '@app/services/resize/resize.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

export type resizeCallback = (width: number, height: number) => void;

@Injectable({
    providedIn: 'root',
})
export class SnapshotFactoryService {
    constructor(
        private undoredoService: UndoRedoService,
        private drawingService: DrawingService,
        private resizeService: ResizeService,
        private canvasService: CanvasService,
        private localStorage: LocalStorageService,
    ) {}

    save(memento: Memento): void {
        this.localStorage.save();

        switch (memento.type) {
            case MementoType.Initial:
                this.undoredoService.saveInitialAction(this.buildInitialAction(memento as InitialMemento));
                break;
            case MementoType.Draw:
                this.undoredoService.save(this.buildDrawAction(memento as DrawableObject));
                break;
            case MementoType.Resize:
                this.undoredoService.save(this.buildResizeAction(memento as ResizeMemento));
                break;
        }
    }

    private buildInitialAction(initialMemento: InitialMemento): Action {
        let callback: actionCallback = (memento: InitialMemento) => {
            this.createResizeCallback()(memento.size.width, memento.size.height);
            this.canvasService.setBackgroundColorWhite();
            this.canvasService.isEmpty = true;
        };

        // this means no carousel image is loaded. We need just to resize.
        if (!initialMemento.image) return new ConcreteAction(initialMemento, callback);

        callback = (memento: InitialMemento) => {
            this.createResizeCallback()(memento.size.width, memento.size.height);
            this.canvasService.putImageData(memento.image as ImageData);
            this.canvasService.isEmpty = false;
        };
        return new ConcreteAction(initialMemento, callback);
    }

    private buildDrawAction(drawable: DrawableObject): Action {
        const callback: actionCallback = (drawableM: DrawableObject) => {
            this.drawingService.reDrawBase(drawableM);
        };
        return new ConcreteAction(drawable, callback);
    }

    private buildResizeAction(resizeMemento: ResizeMemento): Action {
        const callback: actionCallback = (memento: ResizeMemento) => {
            this.createResizeCallback()(memento.width, memento.height);
        };
        return new ConcreteAction(resizeMemento, callback);
    }

    private createResizeCallback(): resizeCallback {
        return (width: number, height: number) => {
            this.resizeService.width = width;
            this.resizeService.height = height;
            this.resizeService.resize();
        };
    }
}
