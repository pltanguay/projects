import { Injectable } from '@angular/core';
import { Action } from '@app/classes/undo-redo/action/action';
import { LocalStorageService } from '@app/services/local-storage/local-storage.service';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    private actionsDone: Action[] = [];
    private actionsUndone: Action[] = [];
    private initialAction: Action;
    isActivated: boolean;

    constructor(private localStorage: LocalStorageService) {
        this.isActivated = true;
    }

    saveInitialAction(action: Action): void {
        this.initialAction = action;
        this.reset();
    }

    save(action: Action): void {
        this.actionsDone.push(action);
        this.actionsUndone = [];
        this.localStorage.save();
    }

    undo(): void {
        if (!this.canUndo()) return;
        this.actionsUndone.push(this.actionsDone.pop() as Action);
        this.refresh();
    }

    redo(): void {
        if (!this.canRedo()) return;
        this.actionsDone.push(this.actionsUndone.pop() as Action);
        this.refresh();
    }

    canUndo(): boolean {
        if (!this.isActivated) return false;
        return this.actionsDone.length > 0;
    }

    canRedo(): boolean {
        if (!this.isActivated) return false;
        return this.actionsUndone.length > 0;
    }

    reset(): void {
        this.actionsDone = [];
        this.actionsUndone = [];
    }

    private refresh(): void {
        this.initialAction.execute();
        this.actionsDone.forEach((action) => {
            action.execute();
        });
        this.localStorage.save();
    }
}
