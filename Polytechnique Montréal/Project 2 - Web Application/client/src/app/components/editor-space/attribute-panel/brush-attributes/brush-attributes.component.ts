import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { MatSliderChange } from '@angular/material/slider';
import { ColorPalette } from '@app/classes/color/color';
import { AbsAttributeDirective } from '@app/components/editor-space/attribute-panel/abstract-attribute/abs-attribute.directive';
import { MAX_WIDTH_BRUSH, MIN_WIDTH_BRUSH } from '@app/declarations/sliders-edges';
import { BrushService } from '@app/services/tools/base-trace/brush/brush-service';
import { ColorService } from '@app/services/tools/color/color.service';
import { Subscription } from 'rxjs';

export const TOOL_TEXTURES = ['Ombre', 'Flou', 'Ombre Noire', 'Linéaire', 'Points', 'Fractal'];

@Component({
    selector: 'app-brush-attributes',
    templateUrl: './brush-attributes.component.html',
    styleUrls: ['./brush-attributes.component.scss', '../attribute-panel.component.scss'],
})
export class BrushAttributesComponent extends AbsAttributeDirective implements OnInit {
    title: string;
    strokeWidth: number;
    colorsSubscription: Subscription;
    selectedTexture: string;
    textures: string[] = TOOL_TEXTURES;

    constructor(private brushService: BrushService, private colorService: ColorService) {
        super();
        this.title = 'Pinceau';
    }

    ngOnInit(): void {
        this.subscribeToColor();
        this.strokeWidth = this.brushService.width;
        this.selectedTexture = this.brushService.texture;
        this.minWidth = MIN_WIDTH_BRUSH;
        this.maxWidth = MAX_WIDTH_BRUSH;
    }

    widthChanged(event: MatSliderChange): void {
        this.strokeWidth = event.value as number;
        this.brushService.width = event.value as number;
    }

    textureChanged(event: MatRadioChange): void {
        this.brushService.texture = event.value;
        this.selectedTexture = event.value;
    }

    private subscribeToColor(): void {
        this.colorsSubscription = this.colorService.getColorsObservable().subscribe((colors: ColorPalette) => {
            this.brushService.color = colors.selectedColor;
        });
    }
}
