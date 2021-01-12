import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSliderChange } from '@angular/material/slider';
import { ColorPalette } from '@app/classes/color/color';
import { AbsAttributeDirective } from '@app/components/editor-space/attribute-panel/abstract-attribute/abs-attribute.directive';
import { MAX_SIZE_TEXT, MIN_SIZE_TEXT } from '@app/declarations/sliders-edges';
import { ColorService } from '@app/services/tools/color/color.service';
import { POLICE, TextService } from '@app/services/tools/text/text.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-text-attribute',
    templateUrl: './text-attribute.component.html',
    styleUrls: ['./text-attribute.component.scss', '../attribute-panel.component.scss'],
})
export class TextAttributeComponent extends AbsAttributeDirective implements OnInit, OnDestroy {
    title: string;
    size: number;
    selectedPolice: string;
    polices: string[] = POLICE;
    align: CanvasTextAlign;
    isBold: boolean;
    isItalic: boolean;

    minSize: number;
    maxSize: number;

    shouldDisableInput: boolean;

    private colorsSubscription: Subscription;

    constructor(private textService: TextService, private colorService: ColorService) {
        super();
        this.title = 'Texte';
    }

    ngOnInit(): void {
        this.setAttributes();
        this.subscribeToColor();
        this.subscribeToInputEvent();

        this.minSize = MIN_SIZE_TEXT;
        this.maxSize = MAX_SIZE_TEXT;
    }

    ngOnDestroy(): void {
        this.colorsSubscription.unsubscribe();
    }

    private setAttributes(): void {
        this.isBold = this.textService.attribute.isBold;
        this.isItalic = this.textService.attribute.isItalic;

        this.size = this.textService.attribute.size;
        this.selectedPolice = this.textService.attribute.police;
        this.align = this.textService.attribute.align;

        this.setButtonStyle('italic', this.isItalic);
        this.setButtonStyle('bold', this.isBold);
        this.setButtonStyle('left', this.align === 'left');
        this.setButtonStyle('center', this.align === 'center');
        this.setButtonStyle('right', this.align === 'right');
    }

    subscribeToColor(): void {
        this.colorsSubscription = this.colorService.getColorsObservable().subscribe((colors: ColorPalette) => {
            this.textService.attribute.color = colors.selectedColor;
            this.updatePreview();
        });
    }

    subscribeToInputEvent(): void {
        this.textService.getEventObservable().subscribe((shouldDisable: boolean) => {
            this.shouldDisableInput = shouldDisable;
        });
    }

    activateInput(): void {
        this.shouldDisableInput = false;
    }

    updatePreview(): void {
        if (this.textService.isProcessing) this.textService.drawPreviewText();
    }

    sizeChanged(event: MatSliderChange): void {
        this.size = event.value as number;
        this.textService.attribute.size = this.size;
        this.updatePreview();
    }

    policeChanged(event: MatRadioChange): void {
        this.selectedPolice = event.value;

        this.textService.attribute.police = event.value;
        this.updatePreview();
    }

    boldToggled(): void {
        this.isBold = !this.textService.attribute.isBold;

        this.textService.attribute.isBold = this.isBold;
        this.updatePreview();
        this.setButtonStyle('bold', this.isBold);
    }

    italicToggled(): void {
        this.isItalic = !this.textService.attribute.isItalic;

        this.textService.attribute.isItalic = this.isItalic;
        this.updatePreview();
        this.setButtonStyle('italic', this.isItalic);
    }

    alignChanged(align: CanvasTextAlign): void {
        this.align = align;

        this.textService.attribute.align = this.align;
        this.updatePreview();

        this.setButtonStyle('left', this.align === 'left');
        this.setButtonStyle('center', this.align === 'center');
        this.setButtonStyle('right', this.align === 'right');
    }

    setButtonStyle(id: string, isSelect: boolean): void {
        const button = document.getElementById(id);
        if (button === null) return;
        if (isSelect) {
            button.style.backgroundColor = '#69f0ae';
        } else {
            button.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        }
    }
}
