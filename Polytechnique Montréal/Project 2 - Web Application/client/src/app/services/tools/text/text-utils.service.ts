import { Injectable } from '@angular/core';
import { TextField } from '@app/classes/text/text-field';
import { Point } from '@app/classes/utils/point';

const OFFSET_INDICATEUR = 0.45;

@Injectable({
    providedIn: 'root',
})
export class TextUtilsService {
    position: number;
    currentLine: number;

    constructor() {
        this.initializeData();
    }

    initializeData(): void {
        this.position = 0;
        this.currentLine = 0;
    }

    changeLine(textField: TextField): void {
        const textBeforePosition = this.getTextBeforePosition(textField);
        const textAfterPosition = this.getTextAfterPosition(textField);

        textField.text[this.currentLine] = textBeforePosition;

        this.currentLine++;
        for (let i = textField.text.length; i > this.currentLine; i--) {
            textField.text[i] = textField.text[i - 1];
        }
        textField.text[this.currentLine] = textAfterPosition;

        this.position = 0;
    }

    addCharacter(textField: TextField, character: string): void {
        textField.text[this.currentLine] = this.getTextBeforePosition(textField) + character + this.getTextAfterPosition(textField);
        this.position++;
    }

    deletePreviousCharacter(textField: TextField): void {
        if (this.isFirstPosition()) {
            if (this.isFirstLine()) return;

            this.currentLine--;
            this.position = this.getLastPosition(textField);
            this.setNewArray(textField);

            return;
        }

        const textAfter = this.getTextAfterPosition(textField);
        this.position--;
        const textBefore = this.getTextBeforePosition(textField);
        textField.text[this.currentLine] = textBefore + textAfter;
    }

    deleteNextCharacter(textField: TextField): void {
        if (this.isLastPosition(textField)) {
            if (this.isLastLine(textField)) return;

            this.setNewArray(textField);

            return;
        }

        const textBefore = this.getTextBeforePosition(textField);
        this.position++;
        const textAfter = this.getTextAfterPosition(textField);
        textField.text[this.currentLine] = textBefore + textAfter;
        this.position--;
    }

    moveLeft(textField: TextField): void {
        if (!this.isFirstPosition()) this.position--;
        else if (!this.isFirstLine()) {
            this.currentLine--;
            this.position = this.getLastPosition(textField);
        }
    }

    moveRight(textField: TextField): void {
        if (!this.isLastPosition(textField)) this.position++;
        else if (!this.isLastLine(textField)) {
            this.currentLine++;
            this.position = 0;
        }
    }

    moveUp(textField: TextField): void {
        if (this.isFirstLine()) return;

        this.currentLine--;
        if (this.position > this.getLastPosition(textField)) this.position = this.getLastPosition(textField);
    }

    moveDown(textField: TextField): void {
        if (this.isLastLine(textField)) return;

        this.currentLine++;
        if (this.position > this.getLastPosition(textField)) this.position = this.getLastPosition(textField);
    }

    getPositionIndicator(ctx: CanvasRenderingContext2D, textField: TextField): Point {
        let positionX = 0;
        const offSetIndicator = textField.attribute.size * OFFSET_INDICATEUR;
        textField.setProperty(ctx);
        switch (textField.attribute.align) {
            case 'left':
                positionX = textField.startPoint.x + ctx.measureText(this.getTextBeforePosition(textField)).width - offSetIndicator;
                break;
            case 'center':
                positionX =
                    textField.startPoint.x -
                    ctx.measureText(textField.text[this.currentLine]).width / 2 +
                    ctx.measureText(this.getTextBeforePosition(textField)).width +
                    textField.alignFactor;
                break;
            case 'right':
                positionX =
                    textField.startPoint.x - ctx.measureText(this.getTextAfterPosition(textField)).width + offSetIndicator + textField.alignFactor;
                break;
        }
        const positionY = textField.startPoint.y + textField.attribute.size * this.currentLine;
        return new Point(positionX, positionY);
    }

    private isFirstLine(): boolean {
        return this.currentLine === 0;
    }
    private isLastLine(textField: TextField): boolean {
        return this.currentLine === this.getLastLineIndex(textField);
    }
    private isFirstPosition(): boolean {
        return this.position === 0;
    }
    private isLastPosition(textField: TextField): boolean {
        return this.position === this.getLastPosition(textField);
    }

    private getLastPosition(textField: TextField): number {
        return textField.text[this.currentLine].length;
    }
    private getLastLineIndex(textField: TextField): number {
        return textField.text.length - 1;
    }

    private getTextBeforePosition(textField: TextField): string {
        let textBefore = '';
        const text = textField.text[this.currentLine];

        for (let i = 0; i < this.position; i++) textBefore += text[i];

        return textBefore;
    }
    private getTextAfterPosition(textField: TextField): string {
        let textBefore = '';
        const text = textField.text[this.currentLine];

        for (let i = this.position; i < text.length; i++) textBefore += text[i];

        return textBefore;
    }

    private setNewArray(textField: TextField): void {
        const newText = new Array();
        for (let i = 0; i < this.currentLine; i++) {
            newText[i] = textField.text[i];
        }
        newText[this.currentLine] = textField.text[this.currentLine] + textField.text[this.currentLine + 1];
        for (let i = this.currentLine + 1; i < textField.text.length - 1; i++) {
            newText[i] = textField.text[i + 1];
        }
        textField.text = newText;
    }
}
