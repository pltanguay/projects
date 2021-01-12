import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ColorPalette } from '@app/classes/color/color';
import { AbsAttributeDirective } from '@app/components/editor-space/attribute-panel/abstract-attribute/abs-attribute.directive';
import { MAX_WIDTH_PENCIL, MIN_WIDTH_PENCIL } from '@app/declarations/sliders-edges';
import { PencilService } from '@app/services/tools/base-trace/pencil/pencil-service';
import { ColorService } from '@app/services/tools/color/color.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-pencil-attributes',
    templateUrl: './pencil-attributes.component.html',
    styleUrls: ['./pencil-attributes.component.scss', '../attribute-panel.component.scss'],
})
export class PencilAttributesComponent extends AbsAttributeDirective implements OnInit, OnDestroy {
    title: string;
    width: number;
    colorsSubscription: Subscription;

    constructor(private pencilService: PencilService, private colorService: ColorService) {
        super();
        this.title = 'Crayon';
    }

    ngOnInit(): void {
        this.setWidth();
        this.subscribeToColor();
        this.minWidth = MIN_WIDTH_PENCIL;
        this.maxWidth = MAX_WIDTH_PENCIL;
    }

    ngOnDestroy(): void {
        this.colorsSubscription.unsubscribe();
    }

    widthChanged(event: MatSliderChange): void {
        this.width = event.value as number;
        this.pencilService.width = this.width;
    }

    private subscribeToColor(): void {
        this.colorsSubscription = this.colorService.getColorsObservable().subscribe((colors: ColorPalette) => {
            this.pencilService.color = colors.selectedColor;
        });
    }

    private setWidth(): void {
        this.width = this.pencilService.width;
    }
}
