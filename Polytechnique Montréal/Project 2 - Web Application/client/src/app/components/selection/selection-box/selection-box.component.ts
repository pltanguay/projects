import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Point } from '@app/classes/utils/point';
import { MouseButton } from '@app/declarations/mouse.enum';
import { SnapToGridService } from '@app/services/snap-to-grid/snap-to-grid.service';
import { BoundingBoxService } from '@app/services/tools/selection/bounding-box/bounding-box.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
import { WorkspaceService } from '@app/services/workspace/workspace.service';

export interface Translation {
    translation?: Point;
    upperLeft: Point;
}

export const BOX_ID = 'selection-box';
@Component({
    selector: 'app-selection-box',
    templateUrl: './selection-box.component.html',
    styleUrls: ['./selection-box.component.scss'],
})
export class SelectionBoxComponent implements AfterViewInit {
    readonly BOX_ID: string;
    private mouseDown: boolean;
    private last: Point;

    @ViewChild('selectionBox') selectionBox: ElementRef<HTMLDivElement>;

    constructor(
        public renderer: Renderer2,
        private toolService: ToolSelectNotifierService,
        private workspaceService: WorkspaceService,
        private boundingBoxService: BoundingBoxService,
        private snapToGridService: SnapToGridService,
    ) {
        this.BOX_ID = BOX_ID;
    }

    ngAfterViewInit(): void {
        this.addMouseListeners();
    }

    private addMouseListeners(): void {
        this.renderer.listen(this.selectionBox.nativeElement, 'pointerdown', (event: PointerEvent) => {
            if (event.button !== MouseButton.Left) return;

            this.selectionBox.nativeElement.setPointerCapture(event.pointerId);
            this.mouseDown = true;
            this.last = { x: event.clientX, y: event.clientY };
            this.workspaceService.setOverflow('hidden');
        });
        this.renderer.listen(this.selectionBox.nativeElement, 'pointerup', (event: PointerEvent) => {
            this.selectionBox.nativeElement.releasePointerCapture(event.pointerId);
            this.mouseDown = false;
            this.workspaceService.setOverflow('auto');
        });
        this.renderer.listen(this.selectionBox.nativeElement, 'pointermove', (event: PointerEvent) => {
            if (this.mouseDown) {
                let translation = { x: event.clientX - this.last.x, y: event.clientY - this.last.y };

                if (this.snapToGridService.active) {
                    translation = this.snapToGridService.getNearestPointTranslation(this.snapToGridService.snapPoint, translation);
                }

                this.boundingBoxService.applyTranslation(translation);
                this.last = { x: this.last.x + translation.x, y: this.last.y + translation.y };
                (this.toolService.currentTool as SelectionService).moveSelection(translation);
            }
        });
    }
}
