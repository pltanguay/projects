import { HttpClient } from '@angular/common/http';
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Filter } from '@app/classes/interfaces/filter';
import { DEFAULT_INDEX_ZERO, DEFAULT_SLIDER_HUNDRED, DEFAULT_SLIDER_RATIO_ONE, FILTERS, FILTER_DATA, FORMATS } from '@app/declarations/export-data';
import { CanvasService } from '@app/services/canvas/canvas.service';
import { RequestResponse } from '@common/communication/database';
import { API_URL, HttpStatusCode, SERVER_ERROR_MESSAGE, SERVER_TIMEOUT } from '@common/declarations/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ExportDrawingService {
    currentFilter: Filter;
    cssFilter: string;
    sliderRatio: number;
    fileName: string;
    filterData: Filter[] = FILTER_DATA;
    exportCanvas: HTMLCanvasElement;
    downloadElement: HTMLAnchorElement;
    filterName: string;
    format: string;
    numericValue: number;

    private renderer: Renderer2;

    constructor(protected canvasService: CanvasService, rendererFactory: RendererFactory2, private http: HttpClient) {
        this.renderer = rendererFactory.createRenderer(null, null);
        this.resetFilter();
    }

    findFilter(filterName: string): Filter {
        const foundFilter = this.filterData.find((filter) => filter.name === this.filterName) as Filter;
        return foundFilter;
    }

    resetFilter(): void {
        this.currentFilter = this.filterData[DEFAULT_INDEX_ZERO];
        this.format = FORMATS[DEFAULT_INDEX_ZERO];
        this.numericValue = DEFAULT_SLIDER_HUNDRED;
        this.filterName = FILTERS[DEFAULT_INDEX_ZERO];
        this.sliderRatio = DEFAULT_SLIDER_RATIO_ONE;
    }

    download(): void {
        this.downloadElement = this.renderer.createElement('a') as HTMLAnchorElement;
        this.downloadElement.href = this.buildURL(this.format);
        this.downloadElement.download = `${this.fileName}.${this.format.toLowerCase()}`;
        this.downloadElement.click();
    }

    updateCssProperty(): void {
        this.cssFilter = this.buildCssProperty(this.currentFilter, this.numericValue);
    }

    sendEmail(emailAddress: string): Observable<RequestResponse> {
        const subject: Subject<RequestResponse> = new Subject();
        const imageData = this.buildURL(this.format);

        const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Origin': '*' };
        const body = {
            to: emailAddress,
            payload: imageData,
            drawingName: this.fileName,
            fileFormat: this.format.toLowerCase(),
        };

        this.http
            .post<RequestResponse>(`${API_URL}/drawing/sendEmail`, body, { headers })
            .pipe(
                timeout(SERVER_TIMEOUT),
                catchError(() => {
                    subject.next({ status: HttpStatusCode.Server_Error, message: SERVER_ERROR_MESSAGE });
                    return of(null);
                }),
            )
            .subscribe((response: RequestResponse) => {
                if (response) subject.next(response);
            });

        return subject.asObservable();
    }

    private buildCssProperty(filter: Filter, numericValue: number): string {
        if (filter.name === 'Aucun') return 'none';
        else return filter.cssName + '(' + numericValue.toString() + filter.unit + ')';
    }

    private buildTemporaryCtxFiltered(): CanvasRenderingContext2D {
        // Creating a new canvas and context
        this.exportCanvas = this.renderer.createElement('canvas') as HTMLCanvasElement;
        const exportContext = this.exportCanvas.getContext('2d') as CanvasRenderingContext2D;

        this.exportCanvas.width = this.canvasService.width;
        this.exportCanvas.height = this.canvasService.height;

        // Apply CSS filter selected in the settings
        exportContext.filter = this.buildCssProperty(this.currentFilter, this.numericValue);

        // Draw base context into temporary context
        exportContext.drawImage(this.canvasService.canvas, 0, 0);

        return exportContext;
    }

    private buildURL(format: string): string {
        const exportContext = this.buildTemporaryCtxFiltered();
        const type = `image/${format}`;
        const url = exportContext.canvas.toDataURL(type);
        return url;
    }
}
