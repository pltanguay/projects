import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { InitialMemento } from '@app/classes/undo-redo/memento/initial-memento';
import { BrowserRefresh } from '@app/classes/utils/browser-refresh';
import { CanvasLoaderService } from '@app/services/canvas/canvas-loader/canvas-loader.service';
import { CanvasService } from '@app/services/canvas/canvas.service';
import { LocalStorageService } from '@app/services/local-storage/local-storage.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { Size, WorkspaceService } from '@app/services/workspace/workspace.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-base-canvas',
    templateUrl: './base-canvas.component.html',
    styleUrls: ['./base-canvas.component.scss'],
})
export class BaseCanvasComponent implements AfterViewInit, OnDestroy {
    wpSubscription: Subscription;
    @Input() width: number;
    @Input() height: number;
    @Input() hasEraser: boolean;
    @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;

    constructor(
        private baseCanvasService: CanvasService,
        private workspaceService: WorkspaceService,
        private snapshotFactory: SnapshotFactoryService,
        private localStorageService: LocalStorageService,
        private canvasLoader: CanvasLoaderService,
    ) {}

    ngAfterViewInit(): void {
        this.baseCanvasService.setCanvas(this.canvas);
        BrowserRefresh.hasRefreshed ? this.openLastDrawing() : this.setNewCanvas();
        this.subscribeNewDrawingSize();
    }

    ngOnDestroy(): void {
        this.wpSubscription.unsubscribe();
        this.baseCanvasService.isEmpty = true;
    }

    private subscribeNewDrawingSize(): void {
        this.wpSubscription = this.workspaceService.getNewDrawingSize().subscribe((size: Size) => {
            this.baseCanvasService.setSize(size.width, size.height);
        });
    }

    private openLastDrawing(): void {
        const data = this.localStorageService.getItem() as string;
        this.canvasLoader.openDrawing(data).subscribe((memento) => {
            this.snapshotFactory.save(memento);
        });
    }

    private setNewCanvas(): void {
        this.baseCanvasService.setSize(this.width, this.height);
        const size: Size = { width: this.width, height: this.height };
        this.snapshotFactory.save(new InitialMemento(size));
    }
}
