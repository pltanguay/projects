import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarouselComponent } from '@app/components/carousel/carousel.component';
import { Keyboard } from '@app/declarations/keyboard.enum';
import { ToolType } from '@app/declarations/tool-declarations';
import { CarouselService } from '@app/services/carousel/carousel.service';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { SnapToGridService } from '@app/services/snap-to-grid/snap-to-grid.service';
import { GridService } from '@app/services/tools/grid-service/grid.service';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Callback, Shortcut } from './shortcut';
import { ShortcutMap } from './shortcut-map';

export const FIRST_OPEN_DIALOG = 0;
@Injectable({
    providedIn: 'root',
})
export class ShortcutHandlerService {
    private shortcuts: ShortcutMap;

    constructor(
        public toolService: ToolSelectNotifierService,
        public undoRedoService: UndoRedoService,
        public carouselService: CarouselService,
        public dialogs: MatDialog,
        public clipboard: ClipboardService,
        public snapToGridService: SnapToGridService,
        public gridService: GridService,
    ) {
        this.shortcuts = new ShortcutMap();
        this.registerShortcuts();
    }

    dispatch(event: KeyboardEvent): void {
        if (event.repeat && event.key !== Keyboard.MINUS && event.key !== Keyboard.PLUS) return;

        if (this.toolService.isWritingInTextTool()) return;
        if (event.ctrlKey || event.shiftKey) event.preventDefault();
        if (this.dialogs.openDialogs.length > 0 && this.dialogKeyPressed(event.key)) return;

        const shortcut: Shortcut = new Shortcut(event.key, event.ctrlKey, event.shiftKey);

        const shortcutCallBack = this.shortcuts.get(shortcut);

        if (shortcutCallBack) shortcutCallBack();
    }

    register(shortcut: Shortcut, callback: Callback): void {
        this.shortcuts.set(shortcut, callback);
    }

    private registerShortcuts(): void {
        this.shortcuts.set(new Shortcut(Keyboard.C), () => {
            this.toolService.selectTool(ToolType.Pencil);
        });
        this.shortcuts.set(new Shortcut(Keyboard.W), () => {
            this.toolService.selectTool(ToolType.Brush);
        });
        this.shortcuts.set(new Shortcut(Keyboard.E), () => {
            this.toolService.selectTool(ToolType.Eraser);
        });
        this.shortcuts.set(new Shortcut(Keyboard.D), () => {
            this.toolService.selectTool(ToolType.Stamp);
        });
        this.shortcuts.set(new Shortcut(Keyboard.A), () => {
            this.toolService.selectTool(ToolType.Spray);
        });
        this.shortcuts.set(new Shortcut(Keyboard.Digit_1), () => {
            this.toolService.selectTool(ToolType.Rectangle);
        });
        this.shortcuts.set(new Shortcut(Keyboard.T), () => {
            this.toolService.selectTool(ToolType.Text);
        });
        this.shortcuts.set(new Shortcut(Keyboard.Digit_2), () => {
            this.toolService.selectTool(ToolType.Ellipse);
        });
        this.shortcuts.set(new Shortcut(Keyboard.Digit_3), () => {
            this.toolService.selectTool(ToolType.Polygone);
        });
        this.shortcuts.set(new Shortcut(Keyboard.L), () => {
            this.toolService.selectTool(ToolType.Line);
        });
        this.shortcuts.set(new Shortcut(Keyboard.R), () => {
            this.toolService.selectTool(ToolType.RectangleSelection);
        });
        this.shortcuts.set(new Shortcut(Keyboard.S), () => {
            this.toolService.selectTool(ToolType.EllipseSelection);
        });
        this.shortcuts.set(new Shortcut(Keyboard.V), () => {
            this.toolService.selectTool(ToolType.MagicWandSelection);
        });
        this.shortcuts.set(new Shortcut(Keyboard.P), () => {
            this.toolService.selectTool(ToolType.FeatherPen);
        });
        this.shortcuts.set(new Shortcut(Keyboard.B), () => {
            this.toolService.selectTool(ToolType.Bucket);
        });
        this.shortcuts.set(new Shortcut(Keyboard.I), () => {
            this.toolService.selectTool(ToolType.ColorPicker);
        });
        this.shortcuts.set(new Shortcut(Keyboard.G), () => {
            this.gridService.isActive = !this.gridService.isActive;
            this.gridService.drawGrid();
        });
        this.shortcuts.set(new Shortcut(Keyboard.PLUS), () => {
            this.gridService.increaseSquareSize();
        });
        this.shortcuts.set(new Shortcut(Keyboard.MINUS), () => {
            this.gridService.decreaseSquareSize();
        });
        this.shortcuts.set(new Shortcut(Keyboard.Z, true), () => {
            this.undoRedoService.undo();
        });
        this.shortcuts.set(new Shortcut(Keyboard.Z, true, true), () => {
            this.undoRedoService.redo();
        });
        this.shortcuts.set(new Shortcut(Keyboard.LEFT_ARROW), () => {
            if (!(this.dialogs.openDialogs[FIRST_OPEN_DIALOG]?.componentInstance as CarouselComponent)) return;
            this.carouselService.previous();
        });
        this.shortcuts.set(new Shortcut(Keyboard.RIGHT_ARROW), () => {
            if (!(this.dialogs.openDialogs[FIRST_OPEN_DIALOG]?.componentInstance as CarouselComponent)) return;
            this.carouselService.next();
        });
        this.shortcuts.set(new Shortcut(Keyboard.C, true, false), () => {
            if (!this.isSelectionTool(this.toolService.currentTool.type)) return;
            this.clipboard.copy();
        });
        this.shortcuts.set(new Shortcut(Keyboard.V, true, false), () => {
            if (!this.isSelectionTool(this.toolService.currentTool.type)) return;
            this.clipboard.paste();
        });
        this.shortcuts.set(new Shortcut(Keyboard.X, true, false), () => {
            if (!this.isSelectionTool(this.toolService.currentTool.type)) return;
            this.clipboard.cut();
        });
        this.shortcuts.set(new Shortcut(Keyboard.DEL), () => {
            if (!this.isSelectionTool(this.toolService.currentTool.type)) return;
            this.clipboard.delete();
        });
        this.shortcuts.set(new Shortcut(Keyboard.M), () => {
            this.snapToGridService.toggle();
        });
    }

    private dialogKeyPressed(key: string): boolean {
        return key !== Keyboard.ESC && key !== Keyboard.LEFT_ARROW && key !== Keyboard.RIGHT_ARROW;
    }

    private isSelectionTool(type: ToolType): boolean {
        return type === ToolType.EllipseSelection || type === ToolType.RectangleSelection || type === ToolType.MagicWandSelection;
    }
}
