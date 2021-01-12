import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InitialMemento } from '@app/classes/undo-redo/memento/initial-memento';
import { Keyboard } from '@app/declarations/keyboard.enum';
import { AlertService } from '@app/services/alert/alert.service';
import { CanvasService } from '@app/services/canvas/canvas.service';
import { Shortcut } from '@app/services/shortcut-handler/shortcut';
import { ShortcutHandlerService } from '@app/services/shortcut-handler/shortcut-handler.service';
import { GridService } from '@app/services/tools/grid-service/grid.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { CANVAS_SIZE_RATIO, Size, WorkspaceService } from '@app/services/workspace/workspace.service';

@Component({
    selector: 'app-new-drawing',
    templateUrl: './new-drawing.component.html',
    styleUrls: ['./new-drawing.component.scss'],
})
export class NewDrawingComponent implements OnInit {
    toolTipText: string = 'Creer un nouveau dessin - CTRL + O';
    @Input() isSelected: boolean;

    @ViewChild('confirmationDialogElements') confirmationDialogElements: TemplateRef<ElementRef>;

    constructor(
        public confirmationDialog: MatDialog,
        private workspaceService: WorkspaceService,
        private canvasService: CanvasService,
        private snapshotFactory: SnapshotFactoryService,
        private alertService: AlertService,
        private shortcutHandler: ShortcutHandlerService,
        private gridService: GridService,
    ) {}

    ngOnInit(): void {
        this.registerShortcut();
    }

    onClickAction(): void {
        // prevent saving empty canvas
        if (this.canvasService.isEmpty) {
            this.alertService.showNewAlert({
                canShowAlert: true,
                hasBeenSentByComponent: true,
                alert: 'Votre dessin est déjà vide',
            });
            return;
        }

        this.confirmationDialog.open(this.confirmationDialogElements, {
            panelClass: 'confirmation-dialog',
        });
    }

    onConfirmationClick(): void {
        this.confirmationDialog.closeAll();
        this.newDrawing();
    }

    newDrawing(): void {
        this.workspaceService.updateDrawingSpaceSize();
        this.canvasService.isEmpty = true;
        const size: Size = {
            width: this.workspaceService.width * CANVAS_SIZE_RATIO,
            height: this.workspaceService.height * CANVAS_SIZE_RATIO,
        };
        this.snapshotFactory.save(new InitialMemento(size));
        this.gridService.isActive = false;
    }

    newDrawingAction(): void {
        if (this.confirmationDialog.openDialogs.length > 0) return;
        this.onClickAction();
    }

    private registerShortcut(): void {
        this.shortcutHandler.register(new Shortcut(Keyboard.O, true), this.newDrawingAction.bind(this));
    }
}
