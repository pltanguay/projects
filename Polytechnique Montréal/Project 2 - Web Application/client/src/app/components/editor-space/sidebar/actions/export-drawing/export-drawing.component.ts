import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSliderChange } from '@angular/material/slider';
import { Filter } from '@app/classes/interfaces/filter';
import { validateEmail } from '@app/classes/utils/validation';
import { DEFAULT_INDEX_ZERO, DEFAULT_SLIDER_HUNDRED, FILTERS, FILTER_DATA, FORMATS } from '@app/declarations/export-data';
import { Keyboard } from '@app/declarations/keyboard.enum';
import { MIN_VALUE_EXPORT } from '@app/declarations/sliders-edges';
import { AlertService } from '@app/services/alert/alert.service';
import { CanvasService } from '@app/services/canvas/canvas.service';
import { ExportDrawingService } from '@app/services/export-drawing/export-drawing.service';
import { Shortcut } from '@app/services/shortcut-handler/shortcut';
import { ShortcutHandlerService } from '@app/services/shortcut-handler/shortcut-handler.service';
import { RequestResponse } from '@common/communication/database';

const MIN_NAME_LENGTH = 3;

@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent implements OnInit {
    minValue: number;
    toolTipText: string = 'Exporter - CTRL + E';
    cssFilter: string;
    currentFormat: string;
    currentFilter: Filter;
    sliderValue: number;
    previewCanvas: string;
    filters: string[] = FILTERS;
    formats: string[] = FORMATS;
    filterData: Filter[] = FILTER_DATA;
    allowDialogToOpen: boolean;
    exportForm: FormGroup;
    isSendingEmail: boolean;
    serverResponse: RequestResponse;

    @Input() isSelected: boolean;

    @ViewChild('exportDrawingDialogElements') exportDrawingDialogElements: TemplateRef<ElementRef>;

    constructor(
        private canvasService: CanvasService,
        public exportDrawingDialog: MatDialog,
        private exportDrawingService: ExportDrawingService,
        private alertService: AlertService,
        private shortcutHandler: ShortcutHandlerService,
    ) {}

    ngOnInit(): void {
        this.resetSettings(this.filterData[DEFAULT_INDEX_ZERO]);
        this.registerShortcut();
        this.minValue = MIN_VALUE_EXPORT;
    }

    private resetSettings(resetFilter: Filter): void {
        this.exportForm = new FormGroup({
            drawingName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(MIN_NAME_LENGTH)])),
            emailAddress: new FormControl('', Validators.compose([Validators.required, validateEmail])),
        });

        this.isSendingEmail = false;
        this.serverResponse = {} as RequestResponse;
        this.currentFilter = resetFilter;
        this.cssFilter = resetFilter.cssName;
        this.exportDrawingService.resetFilter();
        this.currentFormat = FORMATS[DEFAULT_INDEX_ZERO];
        this.sliderValue = DEFAULT_SLIDER_HUNDRED;
    }

    sliderFormatLabel(value: number): string {
        let unit = '';
        if (this.currentFilter.unit === 'deg') unit = '°';
        else unit = this.currentFilter.unit;
        return value + unit;
    }

    onExportClick(event: Event): void {
        event.preventDefault();
        this.exportDrawingService.fileName = this.exportForm.get('drawingName')?.value;
        this.exportDrawingService.download();
    }

    filterChanged(event: MatRadioChange): void {
        this.exportDrawingService.filterName = event.value;
        const foundFilter = this.exportDrawingService.findFilter(event.value);
        this.currentFilter = this.exportDrawingService.currentFilter = foundFilter;
        this.updateFilterSettings();
    }

    updateFilterSettings(): void {
        this.sliderValue = this.exportDrawingService.sliderRatio * this.currentFilter.maxValue;
        this.exportDrawingService.numericValue = this.sliderValue;
        this.exportDrawingService.updateCssProperty();
        this.cssFilter = this.exportDrawingService.cssFilter;
    }

    sliderValueChanged(event: MatSliderChange): void {
        this.exportDrawingService.numericValue = this.sliderValue = event.value as number;
        this.exportDrawingService.sliderRatio = (event.value as number) / this.currentFilter.maxValue;
        this.exportDrawingService.updateCssProperty();
        this.cssFilter = this.exportDrawingService.cssFilter;
    }

    formatChanged(event: MatRadioChange): void {
        this.exportDrawingService.format = this.currentFormat = event.value;
    }

    onClickAction(): void {
        if (this.canvasService.isEmpty) {
            this.alertService.showNewAlert({
                canShowAlert: true,
                hasBeenSentByComponent: true,
                alert: 'Un dessin vide ne peut pas être exporté',
            });
            return;
        }
        this.resetSettings(this.filterData[DEFAULT_INDEX_ZERO]);

        this.allowDialogToOpen = false;
        this.exportDrawingDialog.open(this.exportDrawingDialogElements, {
            panelClass: 'export-drawing-dialog',
        });
        this.previewCanvas = this.canvasService.canvas.toDataURL('image/png');
    }

    onEmailButtonClicked(): void {
        this.isSendingEmail = true;
        const emailAddress = this.exportForm.get('emailAddress')?.value;
        this.exportDrawingService.fileName = this.exportForm.get('drawingName')?.value;

        this.exportDrawingService.sendEmail(emailAddress).subscribe((response) => {
            this.isSendingEmail = false;
            this.serverResponse = response;
        });
    }

    onCloseButtonClicked(): void {
        this.exportDrawingDialog.closeAll();
    }

    closeEmailResponse(): void {
        this.serverResponse = {} as RequestResponse;
    }

    private exportDrawingAction(): void {
        if (this.exportDrawingDialog.openDialogs.length > 0) return;
        this.onClickAction();
    }

    private registerShortcut(): void {
        this.shortcutHandler.register(new Shortcut(Keyboard.E, true), this.exportDrawingAction.bind(this));
    }
}
