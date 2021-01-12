import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarouselComponent } from '@app/components/carousel/carousel.component';
import { UserManualComponent } from '@app/components/user-manual/user-manual.component';
import { Keyboard } from '@app/declarations/keyboard.enum';
import { CanvasLoaderService } from '@app/services/canvas/canvas-loader/canvas-loader.service';
import { LocalStorageService } from '@app/services/local-storage/local-storage.service';
import { Shortcut } from '@app/services/shortcut-handler/shortcut';
import { ShortcutHandlerService } from '@app/services/shortcut-handler/shortcut-handler.service';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';

@Component({
    selector: 'app-entry-point',
    templateUrl: './entry-point.component.html',
    styleUrls: ['./entry-point.component.scss'],
})
export class EntryPointComponent implements OnInit {
    storageData: string;

    constructor(
        public dialog: MatDialog,
        private shortcutHandler: ShortcutHandlerService,
        private localStorage: LocalStorageService,
        private snapshotFactory: SnapshotFactoryService,
        private canvasLoader: CanvasLoaderService,
        private toolNotifier: ToolSelectNotifierService,
    ) {}

    ngOnInit(): void {
        this.registerShortcut();
        this.checkLocalStorage();
    }

    openCarouselDialog(): void {
        this.dialog.open(CarouselComponent, {
            panelClass: 'carousel',
        });
    }

    openUserGuideDialog(): void {
        this.dialog.open(UserManualComponent, {
            panelClass: 'user-guide',
        });
    }

    openCarouselAction(): void {
        if (this.dialog.openDialogs.length > 0) return;
        this.openCarouselDialog();
    }

    openLastDrawing(): void {
        this.resetToolState();
        this.canvasLoader.openDrawing(this.storageData).subscribe((memento) => {
            this.snapshotFactory.save(memento);
        });
    }

    resetToolState(): void {
        this.toolNotifier.currentTool.stopDrawing();
    }

    private registerShortcut(): void {
        this.shortcutHandler.register(new Shortcut(Keyboard.G, true), this.openCarouselAction.bind(this));
    }

    private checkLocalStorage(): void {
        this.storageData = this.localStorage.getItem() as string;
    }
}
