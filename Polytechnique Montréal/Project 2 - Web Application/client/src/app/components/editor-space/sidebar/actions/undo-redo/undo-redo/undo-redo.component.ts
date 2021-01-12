import { Component, DoCheck } from '@angular/core';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Component({
    selector: 'app-undo-redo',
    templateUrl: './undo-redo.component.html',
    styleUrls: ['./undo-redo.component.scss'],
})
export class UndoRedoComponent implements DoCheck {
    canUndo: boolean = true;
    canRedo: boolean = true;
    toolProcessing: boolean = false;

    constructor(private undoRedoService: UndoRedoService, private toolNotifierService: ToolSelectNotifierService) {}

    ngDoCheck(): void {
        this.toolProcessing = this.toolNotifierService.currentTool.isProcessing;
        this.undoRedoService.isActivated = !this.toolProcessing;

        const canUndo = this.undoRedoService.canUndo();
        const canRedo = this.undoRedoService.canRedo();
        if (canUndo !== this.canUndo) {
            this.canUndo = canUndo;
        }
        if (canRedo !== this.canRedo) {
            this.canRedo = canRedo;
        }
    }

    onUndoClick(): void {
        this.undoRedoService.undo();
    }

    onRedoClick(): void {
        this.undoRedoService.redo();
    }
}
