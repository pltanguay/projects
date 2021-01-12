import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ToolType } from '@app/declarations/tool-declarations';
import { ResizeService } from '@app/services/resize/resize.service';
import { LineService } from '@app/services/tools/line/line.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { TextService } from '@app/services/tools/text/text.service';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
import { CANVAS_SIZE_RATIO, Size, WorkspaceService } from '@app/services/workspace/workspace.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-drawing-space',
    templateUrl: './drawing-space.component.html',
    styleUrls: ['./drawing-space.component.scss'],
})
export class DrawingSpaceComponent implements OnInit, OnDestroy {
    @ViewChild('canvasContainer', { static: false }) container: ElementRef<HTMLElement>;

    @Input() workspaceWidth: number;
    @Input() workspaceHeight: number;
    @Input() workspace: ElementRef<HTMLDivElement>;

    containerWidth: number;
    containerHeight: number;

    cursor: string;

    private workspaceSubscription: Subscription;
    private resizeSubscription: Subscription;

    constructor(
        private toolSelectService: ToolSelectNotifierService,
        private workspaceService: WorkspaceService,
        private resizeService: ResizeService,
    ) {
        this.cursor = 'crosshair';
    }

    ngOnInit(): void {
        this.subscribeNewDrawingSpaceSize();
        this.updateContainerSize(this.workspaceWidth * CANVAS_SIZE_RATIO, this.workspaceHeight * CANVAS_SIZE_RATIO);
    }

    ngOnDestroy(): void {
        this.workspaceSubscription.unsubscribe();
        this.resizeSubscription.unsubscribe();
    }

    private subscribeNewDrawingSpaceSize(): void {
        this.workspaceSubscription = this.workspaceService.getNewDrawingSize().subscribe((size: Size) => {
            this.updateContainerSize(size.width, size.height);
        });
        this.resizeSubscription = this.resizeService.getSize().subscribe((size: Size) => {
            this.updateContainerSize(size.width, size.height);
        });
    }

    private updateContainerSize(width: number, height: number): void {
        this.containerWidth = Math.round(width);
        this.containerHeight = Math.round(height);
        this.resizeService.width = this.containerWidth;
        this.resizeService.height = this.containerHeight;
    }

    get customCursor(): boolean {
        const cursorType = this.toolSelectService.currentTool.type;
        return cursorType === ToolType.Eraser || cursorType === ToolType.FeatherPen || cursorType === ToolType.Stamp;
    }

    get selection(): boolean {
        return (
            !(this.toolSelectService.currentTool as SelectionService).selectionActive &&
            !(this.toolSelectService.currentTool as LineService).lineActive &&
            !(this.toolSelectService.currentTool as TextService).textActive
        );
    }
}
