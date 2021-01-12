import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CircularBuffer } from '@app/classes/utils/ring-buffer';
import { CanvasService } from '@app/services/canvas/canvas.service';
import { RequestResponse } from '@common/communication/database';
import { DrawingData } from '@common/communication/drawing-data';
import { API_URL, HttpStatusCode, SERVER_TIMEOUT } from '@common/declarations/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

export const MAXIMUM_IMAGES_CAROUSEL = 2 + 1;

@Injectable({
    providedIn: 'root',
})
export class CarouselService {
    selectedDrawing: DrawingData;
    private ringBuffer: CircularBuffer<DrawingData>;

    constructor(private http: HttpClient, private canvasService: CanvasService) {
        this.ringBuffer = new CircularBuffer<DrawingData>();
    }

    getDrawings(): Observable<RequestResponse> {
        const subject: Subject<RequestResponse> = new Subject();
        this.ringBuffer.reset();

        this.http
            .get<DrawingData[]>(`${API_URL}/drawing/getAllDrawings`)
            .pipe(
                timeout(SERVER_TIMEOUT),
                catchError(() => this.emitErrorToComponent(subject)),
            )
            .subscribe((drawingsData: DrawingData[]) => {
                if (drawingsData) {
                    this.ringBuffer.add(drawingsData);
                    subject.next({ status: HttpStatusCode.Success, message: 'Server is working' });
                }
            });

        return subject.asObservable();
    }

    deleteDrawing(id: string): Observable<RequestResponse> {
        const options = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
        const subject: Subject<RequestResponse> = new Subject();

        this.http
            .delete(`${API_URL}/drawing/deleteDrawing/${id}`, options)
            .pipe(
                timeout(SERVER_TIMEOUT),
                catchError(() => this.emitErrorToComponent(subject)),
            )
            .subscribe((responseData: RequestResponse) => {
                if (responseData) {
                    const isResponseSuccess: boolean = responseData.status === HttpStatusCode.Success;
                    if (isResponseSuccess) {
                        this.ringBuffer.filter((drawing: DrawingData) => {
                            return drawing.id !== id;
                        });
                    }
                    subject.next(responseData);
                }
            });

        return subject.asObservable();
    }

    canOpen(): boolean {
        return this.canvasService.isEmpty;
    }

    private emitErrorToComponent(subject: Subject<RequestResponse>): Observable<null> {
        subject.next({ status: HttpStatusCode.Server_Error, message: 'Server down' });
        return of(null);
    }

    get currentDrawings(): DrawingData[] {
        const drawingArray: DrawingData[] = [];
        for (let i = 0; i < Math.min(this.ringBuffer.size, MAXIMUM_IMAGES_CAROUSEL); i++) {
            drawingArray.push(this.ringBuffer.get(i - 1));
        }
        return drawingArray;
    }

    get drawingsLength(): number {
        return this.ringBuffer.size;
    }

    get drawings(): CircularBuffer<DrawingData> {
        return this.ringBuffer;
    }

    reset(): void {
        this.ringBuffer.reset();
    }

    next(): void {
        if (this.ringBuffer.size < MAXIMUM_IMAGES_CAROUSEL) return;
        this.ringBuffer.next();
    }
    previous(): void {
        if (this.ringBuffer.size < MAXIMUM_IMAGES_CAROUSEL) return;
        this.ringBuffer.previous();
    }
}
