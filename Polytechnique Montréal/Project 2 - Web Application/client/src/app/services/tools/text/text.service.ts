import { Injectable } from '@angular/core';
import { TextAttribute, TextField } from '@app/classes/text/text-field';
import { Tool } from '@app/classes/tool/tool';
import { Point } from '@app/classes/utils/point';
import { Keyboard, NOT_TEXT_SYMBOLE } from '@app/declarations/keyboard.enum';
import { MouseButton } from '@app/declarations/mouse.enum';
import { ToolType } from '@app/declarations/tool-declarations';
import { DashedShapeService } from '@app/services/dashed-shape/dashed-shape.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Shortcut } from '@app/services/shortcut-handler/shortcut';
import { ShortcutMap } from '@app/services/shortcut-handler/shortcut-map';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { TextUtilsService } from './text-utils.service';
const SIZE_INDICATOR_FACTOR = 1.5;
const HEIGHT_FACTOR = 1.5;

export const BOUNDBOX_FACTOR = 4;

export const POLICE = ['Arial', 'Brush Script MT', 'Courier New', 'Impact', 'Lucida Console', 'Times New Roman'];

const DEFAULT_POLICE = POLICE[0];
const DEFAULT_SIZE = 20;
const DEFAULT_ALIGN = 'left';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    readonly type: ToolType;
    private subject: BehaviorSubject<boolean>;

    textField: TextField;
    textActive: boolean;
    attribute: TextAttribute;

    keyMap: ShortcutMap;

    isWriting: boolean;

    constructor(
        protected drawingService: DrawingService,
        protected snapshotFactory: SnapshotFactoryService,
        protected dashedShapeService: DashedShapeService,
        protected textUtills: TextUtilsService,
    ) {
        super(drawingService);
        this.type = ToolType.Text;
        this.isProcessing = this.textActive = false;
        this.subject = new BehaviorSubject<boolean>(false);

        this.attribute = { size: DEFAULT_SIZE, police: DEFAULT_POLICE, isBold: false, isItalic: false, align: DEFAULT_ALIGN, color: 'black' };

        this.isWriting = false;
        this.keyMap = new ShortcutMap();
        this.registerShortcuts();
    }

    onMouseUp(event: PointerEvent): void {
        if (event.button !== MouseButton.Left) return;
        if (!this.isProcessing) {
            this.isProcessing = this.textActive = true;
            this.mousePosition = this.getPositionFromMouse(event);
            this.textField = new TextField(this.mousePosition, this.attribute);
            this.textUtills.initializeData();
            this.drawPreviewText();
        } else {
            this.stopDrawing();
        }

        this.subject.next(false);
    }

    onKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isProcessing) return;
        this.textField.setProperty(this.drawingService.previewCtx);

        const shortcut: Shortcut = new Shortcut(event.key, event.ctrlKey, event.shiftKey);
        const shortcutCallBack = this.keyMap.get(shortcut);
        if (shortcutCallBack) shortcutCallBack();
        else if (!NOT_TEXT_SYMBOLE.includes(event.key)) {
            this.textUtills.addCharacter(this.textField, event.key);
        }

        if (event.key !== Keyboard.ESC) this.drawPreviewText();
    }

    getEventObservable(): Observable<boolean> {
        return this.subject.asObservable(); // emits
    }

    stopDrawing(): void {
        this.drawingService.cleanPreview();

        if (this.isProcessing === false) return;
        this.isProcessing = this.textActive = false;

        if (this.isTextFieldEmpty()) return;

        this.drawingService.drawBase(this.textField);
        this.snapshotFactory.save(this.cloneTextField());
    }
    drawPreviewText(): void {
        this.drawingService.cleanPreview();
        if (this.isProcessing) this.textField.attribute = this.attribute;
        this.drawingService.drawPreview(this.textField);
        this.drawIndicator(this.drawingService.previewCtx);
        this.drawBoundingBox(this.drawingService.previewCtx);
    }
    private drawIndicator(ctx: CanvasRenderingContext2D): void {
        const indicatorPosition = this.textUtills.getPositionIndicator(ctx, this.textField);

        ctx.fillStyle = 'black';
        ctx.font = this.attribute.size * SIZE_INDICATOR_FACTOR + 'px Courier New';
        ctx.fillText('|', indicatorPosition.x, indicatorPosition.y);
    }
    private drawBoundingBox(ctx: CanvasRenderingContext2D): void {
        const width = this.textField.getWidth(ctx);
        const boundingBox = this.dashedShapeService.getDashedRectangle(this.getUpperLeftPoint(), this.getLowerRightPoint(width));
        this.drawingService.drawPreview(boundingBox);
    }

    private getUpperLeftPoint(): Point {
        return new Point(this.mousePosition.x - this.attribute.size / BOUNDBOX_FACTOR, this.mousePosition.y - this.attribute.size);
    }

    private getLowerRightPoint(width: number): Point {
        return new Point(
            this.mousePosition.x + width + this.attribute.size / BOUNDBOX_FACTOR,
            this.mousePosition.y + this.textField.getHeight() - this.attribute.size / HEIGHT_FACTOR,
        );
    }
    private isTextFieldEmpty(): boolean {
        for (const line of this.textField.text) {
            if (line === '') continue;

            for (const symbole of line) {
                if (symbole !== ' ') return false;
            }
        }
        return true;
    }
    private cancelText(): void {
        this.isProcessing = this.textActive = false;
        this.drawingService.cleanPreview();
    }
    private cloneTextField(): TextField {
        const clone = new TextField(this.textField.startPoint, {
            size: this.attribute.size,
            police: this.attribute.police,
            isBold: this.attribute.isBold,
            isItalic: this.attribute.isItalic,
            align: this.attribute.align,
            color: this.attribute.color,
        });
        clone.text = this.textField.text;
        return clone;
    }

    private registerShortcuts(): void {
        this.keyMap.set(new Shortcut(Keyboard.ESC), () => {
            this.cancelText();
        });
        this.keyMap.set(new Shortcut(Keyboard.BS), () => {
            this.textUtills.deletePreviousCharacter(this.textField);
        });
        this.keyMap.set(new Shortcut(Keyboard.DEL), () => {
            this.textUtills.deleteNextCharacter(this.textField);
        });
        this.keyMap.set(new Shortcut(Keyboard.ENT), () => {
            this.textUtills.changeLine(this.textField);
        });
        this.keyMap.set(new Shortcut(Keyboard.LEFT_ARROW), () => {
            this.subject.next(true);
            this.textUtills.moveLeft(this.textField);
        });
        this.keyMap.set(new Shortcut(Keyboard.RIGHT_ARROW), () => {
            this.subject.next(true);
            this.textUtills.moveRight(this.textField);
        });
        this.keyMap.set(new Shortcut(Keyboard.UP_ARROW), () => {
            this.subject.next(true);
            this.textUtills.moveUp(this.textField);
        });
        this.keyMap.set(new Shortcut(Keyboard.DOWN_ARROW), () => {
            this.subject.next(true);
            this.textUtills.moveDown(this.textField);
        });
    }
}
