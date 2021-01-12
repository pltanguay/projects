import { Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { AbsAttributeDirective } from '@app/components/editor-space/attribute-panel/abstract-attribute/abs-attribute.directive';
import { MAX_WIDTH_ERASER, MIN_WIDTH_ERASER } from '@app/declarations/sliders-edges';
import { EraserService } from '@app/services/tools/base-trace/eraser/eraser.service';

@Component({
    selector: 'app-eraser-attributes',
    templateUrl: './eraser-attributes.component.html',
    styleUrls: ['./eraser-attributes.component.scss', '../attribute-panel.component.scss'],
})
export class EraserAttributesComponent extends AbsAttributeDirective implements OnInit {
    title: string;
    width: number;

    constructor(private eraseService: EraserService) {
        super();
        this.title = 'Efface';
    }

    ngOnInit(): void {
        this.setWidth();
        this.minWidth = MIN_WIDTH_ERASER;
        this.maxWidth = MAX_WIDTH_ERASER;
    }

    widthChanged(event: MatSliderChange): void {
        this.width = event.value as number;
        this.eraseService.width = this.width;
    }

    private setWidth(): void {
        this.width = this.eraseService.width;
    }
}
