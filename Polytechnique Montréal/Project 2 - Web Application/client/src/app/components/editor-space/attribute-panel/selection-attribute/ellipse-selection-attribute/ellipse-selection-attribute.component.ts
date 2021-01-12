import { Component, Renderer2 } from '@angular/core';
import { AbsAttributeDirective } from '@app/components/editor-space/attribute-panel/abstract-attribute/abs-attribute.directive';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse-selection/ellipse-selection.service';

@Component({
    selector: 'app-ellipse-selection-attribute',
    templateUrl: './../selection-attribute.component.html',
    styleUrls: ['./ellipse-selection-attribute.component.scss', './../../attribute-panel.component.scss'],
})
export class EllipseSelectionAttributeComponent extends AbsAttributeDirective {
    title: string;
    constructor(protected renderer: Renderer2, private ellipseSelectionService: EllipseSelectionService, public clipboard: ClipboardService) {
        super();
        this.title = 'Sélection par Ellipse';
        this.ellipseSelectionService.renderer = renderer;
        this.clipboard.selectionService = ellipseSelectionService;
    }

    selectAll(): void {
        this.ellipseSelectionService.selectAll();
    }
}
