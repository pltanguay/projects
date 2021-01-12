import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { AbsAttributeDirective } from '@app/components/editor-space/attribute-panel/abstract-attribute/abs-attribute.directive';
import { MAX_OPACITY, MAX_SQUARE_SIZE, MIN_OPACITY, MIN_SQUARE_SIZE } from '@app/declarations/sliders-edges';
import { GridService } from '@app/services/tools/grid-service/grid.service';

const COLOR_CONVERSION_FACTOR = 100;

@Component({
    selector: 'app-grid-attribute',
    templateUrl: './grid-attribute.component.html',
    styleUrls: ['./grid-attribute.component.scss', '../attribute-panel.component.scss'],
})
export class GridAttributeComponent extends AbsAttributeDirective implements OnInit {
    title: string;

    opacity: number;

    minSize: number;
    maxSize: number;
    minOpacity: number;
    maxOpacity: number;

    shouldDisableInput: boolean;

    constructor(public gridService: GridService) {
        super();
        this.title = 'Grille';

        this.minSize = MIN_SQUARE_SIZE;
        this.maxSize = MAX_SQUARE_SIZE;
        this.maxOpacity = MAX_OPACITY;
        this.minOpacity = MIN_OPACITY;
    }

    ngOnInit(): void {
        this.opacity = this.gridService.opacity * COLOR_CONVERSION_FACTOR;
    }

    isActiveChanged(event: MatSlideToggleChange): void {
        this.gridService.isActive = event.checked;
        this.gridService.drawGrid();
    }

    opacityChanged(event: MatSliderChange): void {
        this.opacity = event.value as number;
        this.gridService.opacity = this.opacity / COLOR_CONVERSION_FACTOR;
        this.gridService.drawGrid();
    }

    squareSizeChanged(event: MatSliderChange): void {
        this.gridService.squareSize = event.value as number;
        this.gridService.drawGrid();
    }
}
