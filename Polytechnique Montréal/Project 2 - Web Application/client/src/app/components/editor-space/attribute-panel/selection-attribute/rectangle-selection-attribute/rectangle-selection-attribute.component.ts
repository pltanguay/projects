import { Component, Renderer2 } from '@angular/core';
import { AbsAttributeDirective } from '@app/components/editor-space/attribute-panel/abstract-attribute/abs-attribute.directive';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle-selection/rectangle-selection.service';

@Component({
    selector: 'app-rectangle-selection-attribute',
    templateUrl: './../selection-attribute.component.html',
    styleUrls: ['./rectangle-selection-attribute.component.scss', './../../attribute-panel.component.scss'],
})
export class RectangleSelectionAttributeComponent extends AbsAttributeDirective {
    title: string;
    constructor(protected renderer: Renderer2, protected recSelService: RectangleSelectionService, public clipboard: ClipboardService) {
        super();
        this.title = 'Sélection par Rectangle';
        this.recSelService.renderer = renderer;
        this.clipboard.selectionService = recSelService;
    }

    selectAll(): void {
        this.recSelService.selectAll();
    }
}
