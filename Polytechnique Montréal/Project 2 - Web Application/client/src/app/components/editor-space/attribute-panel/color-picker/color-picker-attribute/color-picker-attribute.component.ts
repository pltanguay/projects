import { Component, OnDestroy, OnInit } from '@angular/core';
import { PixelPicker } from '@app/classes/color-picker/color-picker';
import { AbsAttributeDirective } from '@app/components/editor-space/attribute-panel/abstract-attribute/abs-attribute.directive';
import { ColorPickerService } from '@app/services/tools/color-picker/color-picker.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-color-picker-attribute',
    templateUrl: './color-picker-attribute.component.html',
    styleUrls: ['./color-picker-attribute.component.scss'],
})
export class ColorPickerAttributeComponent extends AbsAttributeDirective implements OnInit, OnDestroy {
    title: string = 'Pipette';

    colorPicker: PixelPicker;

    private pickerSubscription: Subscription;

    constructor(private colorPickerService: ColorPickerService) {
        super();
    }

    ngOnInit(): void {
        this.pickerSubscription = this.colorPickerService.getColorsObservable().subscribe((picker: PixelPicker) => {
            this.colorPicker = picker;
        });
    }

    ngOnDestroy(): void {
        this.pickerSubscription.unsubscribe();
    }

    applyBorderColor(): object {
        return {
            border: `2.5px solid ${this.colorPicker.middlePixel}`,
            display: 'block',
        };
    }
}
