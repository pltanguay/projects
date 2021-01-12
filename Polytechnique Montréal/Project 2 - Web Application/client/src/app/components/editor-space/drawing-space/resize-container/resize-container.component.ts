import { Component, EventEmitter, Output } from '@angular/core';
import { MouseData } from '@app/classes/interfaces/mousedata';
import { ResizeMemento } from '@app/classes/undo-redo/memento/resize-memento';
import { ResizeService } from '@app/services/resize/resize.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';

@Component({
    selector: 'app-resize-container',
    templateUrl: './resize-container.component.html',
    styleUrls: ['./resize-container.component.scss'],
})
export class ResizeContainerComponent {
    resizeableBorderHidden: boolean;

    @Output() isDragged: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public resizeService: ResizeService, private snapShotFactory: SnapshotFactoryService) {
        this.resizeableBorderHidden = true;
    }

    resizeRightChange(event: MouseData): void {
        this.resizeService.updateWidthSize(event);
    }

    resizeBottomChange(event: MouseData): void {
        this.resizeService.updateHeightSize(event);
    }

    resizeDiagonalChange(event: MouseData): void {
        this.resizeService.updateHeightSize(event);
        this.resizeService.updateWidthSize(event);
    }

    resizeDragged(): void {
        this.resizeableBorderHidden = false;
        this.isDragged.emit(true);
    }

    resizeReleased(): void {
        this.resizeableBorderHidden = true;

        this.resizeService.resize();
        this.snapShotFactory.save(new ResizeMemento(this.resizeService.width, this.resizeService.height));
        this.isDragged.emit(false);
    }
}
