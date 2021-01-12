import { Component, Renderer2 } from '@angular/core';
import { AbsAttributeDirective } from '@app/components/editor-space/attribute-panel/abstract-attribute/abs-attribute.directive';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { MagicWandSelectionService } from '@app/services/tools/selection/magic-wand-selection/magic-wand-selection.service';
@Component({
    selector: 'app-magic-wand-selection-attribute',
    templateUrl: './../../selection-attribute.component.html',
    styleUrls: ['./magic-wand-selection-attribute.component.scss', './../../../attribute-panel.component.scss'],
})
export class MagicWandSelectionAttributeComponent extends AbsAttributeDirective {
    title: string;
    constructor(protected renderer: Renderer2, private magicWandSelection: MagicWandSelectionService, private clipboard: ClipboardService) {
        super();
        this.title = 'Sélection par Baguette magique';
        this.magicWandSelection.renderer = renderer;
        this.clipboard.selectionService = magicWandSelection;
    }

    selectAll(): void {
        this.magicWandSelection.selectAll();
    }
}
