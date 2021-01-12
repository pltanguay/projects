import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { CLIPBOARD_ID } from '@app/components/editor-space/attribute-panel/selection-attribute/clipboard/clipboard.component';
import { INDICATOR_ID } from '@app/components/editor-space/drawing-space/resize-indicator/resize-indicator.component';
import { BoundingBoxService } from '@app/services/tools/selection/bounding-box/bounding-box.service';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse-selection/ellipse-selection.service';
import { MagicWandSelectionService } from '@app/services/tools/selection/magic-wand-selection/magic-wand-selection.service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle-selection/rectangle-selection.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
import { BOX_ID } from './selection-box/selection-box.component';

@Component({
    selector: 'app-selection',
    templateUrl: './selection.component.html',
    styleUrls: ['./selection.component.scss'],
})
export class SelectionComponent implements AfterViewInit {
    x: number;
    y: number;
    constructor(
        private recSelService: RectangleSelectionService,
        private ellipseSelService: EllipseSelectionService,
        private magicWandSelService: MagicWandSelectionService,
        private toolService: ToolSelectNotifierService,
        public boundingBox: BoundingBoxService,
        private renderer: Renderer2,
        public elem: ElementRef,
    ) {}

    get selectionActive(): boolean {
        return this.recSelService.selectionActive || this.ellipseSelService.selectionActive || this.magicWandSelService.selectionActive;
    }

    ignoreContextMenu(event: MouseEvent): void {
        event.preventDefault();
    }

    ngAfterViewInit(): void {
        this.addMouseListeners();
    }

    private addMouseListeners(): void {
        this.renderer.listen('document', 'pointerdown', (event: PointerEvent) => {
            this.x = this.y = 0;
            const targetId = (event.target as HTMLDivElement).id;
            const notOnSelection = [BOX_ID, INDICATOR_ID, CLIPBOARD_ID].every((id) => {
                return targetId !== id;
            });
            if (this.selectionActive && notOnSelection) {
                (this.toolService.currentTool as SelectionService).terminateSelection();
            }
        });

        this.renderer.listen(this.elem.nativeElement, 'wheel', (event: WheelEvent) => {
            event.preventDefault();
            this.toolService.currentTool.onWheelScroll(event);
        });
    }
}
