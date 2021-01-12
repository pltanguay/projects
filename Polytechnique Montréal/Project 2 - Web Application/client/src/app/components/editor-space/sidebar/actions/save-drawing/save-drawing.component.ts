import { Component, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertType } from '@app/classes/interfaces/canvas-alert';
import { validateTagContent, validateTagLength } from '@app/classes/utils/validation';
import { Keyboard } from '@app/declarations/keyboard.enum';
import { AlertService } from '@app/services/alert/alert.service';
import { CanvasService } from '@app/services/canvas/canvas.service';
import { SaveDrawingService } from '@app/services/save-drawing/save-drawing.service';
import { Shortcut } from '@app/services/shortcut-handler/shortcut';
import { ShortcutHandlerService } from '@app/services/shortcut-handler/shortcut-handler.service';
import { RequestResponse } from '@common/communication/database';
import { DrawingData } from '@common/communication/drawing-data';
import { HttpStatusCode } from '@common/declarations/http';
import { Subscription } from 'rxjs';

const MIN_NAME_LENGTH = 3;

@Component({
    selector: 'app-save-drawing',
    templateUrl: './save-drawing.component.html',
    styleUrls: ['./save-drawing.component.scss'],
})
export class SaveDrawingComponent implements OnInit, OnDestroy {
    isMakingHttpRequest: boolean;
    serverResponse: RequestResponse;

    toolTipText: string = 'Sauvegarder - CTRL + S';
    savingForm: FormGroup;
    tagsForm: FormGroup;
    drawingData: DrawingData;

    private saveDrawingSubscription: Subscription;

    @Input() isSelected: boolean;

    @ViewChild('saveDrawingDialogElements') saveDrawingDialogElements: TemplateRef<ElementRef>;

    constructor(
        private canvasService: CanvasService,
        public saveDrawingDialog: MatDialog,
        private saveDrawingService: SaveDrawingService,
        private alertService: AlertService,
        private shortcutHandler: ShortcutHandlerService,
    ) {
        this.initialiseValues();
    }

    private initialiseValues(): void {
        this.isMakingHttpRequest = false;
        this.serverResponse = {} as RequestResponse;
        this.saveDrawingService.resetTags();
        this.savingForm = new FormGroup({
            drawingName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(MIN_NAME_LENGTH)])),
        });
        this.tagsForm = new FormGroup({
            currentTag: new FormControl('', [validateTagLength, validateTagContent]),
        });
    }

    ngOnInit(): void {
        this.saveDrawingSubscription = this.saveDrawingService.getDrawingData().subscribe((data: DrawingData) => {
            this.drawingData = data;
        });
        this.shortcutHandler.register(new Shortcut(Keyboard.S, true), this.saveDrawingAction.bind(this));
    }

    ngOnDestroy(): void {
        this.saveDrawingSubscription.unsubscribe();
    }

    onClickAction(): void {
        const base64Data: string = this.canvasService.canvas.toDataURL('image/png', 1.0);

        // prevent saving empty canvas
        if (this.canvasService.isEmpty) {
            this.alertService.showNewAlert({
                canShowAlert: true,
                hasBeenSentByComponent: true,
                alert: 'Un dessin vide ne peut pas être sauvegardé',
            });
            return;
        }

        this.initialiseValues();

        this.saveDrawingService.setDrawingToBeSaved(base64Data);
        this.saveDrawingDialog.open(this.saveDrawingDialogElements, {
            panelClass: 'save-drawing-dialog',
        });
    }

    onAddButtonClicked(event: Event): void {
        event.stopPropagation();

        this.saveDrawingService.addTag(this.tagsForm.get('currentTag')?.value);
        this.tagsForm.get('currentTag')?.setValue('');
    }

    deleteTag(index: number): void {
        this.saveDrawingService.deleteTag(index);
    }

    onFocus(): void {
        this.serverResponse = {} as RequestResponse;
    }

    onCloseButtonClicked(): void {
        this.saveDrawingDialog.closeAll();
    }

    onSaveClick(): void {
        this.isMakingHttpRequest = true;
        this.serverResponse = {} as RequestResponse;

        const data = this.saveDrawingService.sendData(this.savingForm.get('drawingName')?.value);

        data.subscribe((response) => {
            this.verifyResponse(response);
            this.isMakingHttpRequest = false;
        });
    }

    saveDrawingAction(): void {
        if (this.saveDrawingDialog.openDialogs.length > 0) return;
        this.onClickAction();
    }

    private verifyResponse(response: RequestResponse): void {
        this.serverResponse = response;

        if (response.status === HttpStatusCode.Success) {
            this.saveDrawingDialog.closeAll();
            this.alertService.showNewAlert({
                canShowAlert: true,
                hasBeenSentByComponent: true,
                alert: response.message,
                type: AlertType.Success,
            });
        }
    }
}
