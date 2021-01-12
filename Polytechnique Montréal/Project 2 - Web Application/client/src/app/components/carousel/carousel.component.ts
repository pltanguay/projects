import { Component, DoCheck, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CanvasLoaderService } from '@app/services/canvas/canvas-loader/canvas-loader.service';
import { CarouselService, MAXIMUM_IMAGES_CAROUSEL } from '@app/services/carousel/carousel.service';
import { FilterService } from '@app/services/carousel/filter/filter.service';
import { ToolSelectNotifierService } from '@app/services/tools/tool-select-notifier.service';
import { SnapshotFactoryService } from '@app/services/undo-redo/snapshot-factory/snapshot-factory.service';
import { RequestResponse } from '@common/communication/database';
import { DrawingData } from '@common/communication/drawing-data';
import { HttpStatusCode } from '@common/declarations/http';

const MESSAGE_DURATION = 2500;

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit, OnDestroy, DoCheck {
    @ViewChild('bodyContainer') bodyContainer: ElementRef;

    shouldLoadSpinner: boolean;
    canShowConfirmation: boolean;
    carouselCssClass: string;
    serverResponse: RequestResponse;
    filter: string;
    isServerDown: boolean;

    constructor(
        private dialogRef: MatDialogRef<CarouselComponent>,
        public carouselService: CarouselService,
        public filterService: FilterService,
        private snapshotFactory: SnapshotFactoryService,
        public dialog: MatDialog,
        private canvasLoader: CanvasLoaderService,
        private toolService: ToolSelectNotifierService,
    ) {
        this.shouldLoadSpinner = true;
        this.serverResponse = {} as RequestResponse;
    }

    ngDoCheck(): void {
        this.updateDrawingLayout();
    }

    ngOnInit(): void {
        this.getDrawingsFromServer();
    }

    onFilterInputEnter(value: string): void {
        if (value === '') return;
        this.filterService.applyFilter(this.filter);
        this.filter = '';
    }

    ngOnDestroy(): void {
        this.filterService.reset();
        this.carouselService.reset();
    }

    restore(): void {
        this.filterService.restore();
    }

    getDrawingsFromServer(): void {
        this.shouldLoadSpinner = true;
        this.carouselService.getDrawings().subscribe((response: RequestResponse) => {
            this.shouldLoadSpinner = false;
            this.validateResponse(response);
        });
    }

    // to load drawing on canvas
    onDrawingClicked(clickedDrawing: DrawingData): void {
        this.carouselService.selectedDrawing = clickedDrawing;
        if (this.carouselService.canOpen()) {
            this.openDrawing();
            return;
        }
        this.canShowConfirmation = true;
    }

    closeConfirm(): void {
        this.canShowConfirmation = false;
    }

    openDrawing(): void {
        const imageData = this.carouselService.selectedDrawing.imageBase64 as string;

        this.dialogRef.close();
        this.canvasLoader.openDrawing(imageData).subscribe((memento) => {
            this.snapshotFactory.save(memento);
        });

        this.toolService.currentTool.stopDrawing();
    }

    onDeleteDrawing(clickedDrawing: DrawingData): void {
        this.shouldLoadSpinner = true;
        this.serverResponse = {} as RequestResponse;

        this.carouselService.deleteDrawing(clickedDrawing.id as string).subscribe((responseData: RequestResponse) => {
            this.validateResponse(responseData);
            this.handleDeleteResponse(responseData, clickedDrawing);
        });
    }

    updateDrawingLayout(): void {
        if (this.isServerDown) return;

        this.carouselCssClass = '';
        if (this.shouldLoadSpinner) return;
        if (this.carouselService.drawingsLength === 0 && this.filterService.unfilteredImages.size !== 0) {
            this.carouselCssClass = 'drawingFiltered';
            return;
        }
        if (this.canShowConfirmation) {
            this.carouselCssClass = 'show-confirmation';
            return;
        }

        this.carouselCssClass = `drawing${Math.min(this.carouselService.drawingsLength, MAXIMUM_IMAGES_CAROUSEL)}`;
    }

    private validateResponse(response: RequestResponse): void {
        this.isServerDown = response.status === HttpStatusCode.Server_Error;
        if (response.status === HttpStatusCode.Server_Error) this.carouselCssClass = 'server-down';
    }

    private handleDeleteResponse(responseData: RequestResponse, clickedDrawing: DrawingData): void {
        this.shouldLoadSpinner = false;
        this.serverResponse = responseData;

        if (this.serverResponse.status === HttpStatusCode.Success) {
            this.filterService.tryUpdateFilters(clickedDrawing);
        }

        this.removeResponseMessage();
    }

    private removeResponseMessage(): void {
        setTimeout(() => {
            this.serverResponse = {} as RequestResponse;
        }, MESSAGE_DURATION);
    }
}
