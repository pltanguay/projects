import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestResponse } from '@common/communication/database';
import { DrawingData } from '@common/communication/drawing-data';
import { API_URL, HttpStatusCode, SERVER_ERROR_MESSAGE, SERVER_TIMEOUT } from '@common/declarations/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class SaveDrawingService {
    private drawingData: DrawingData;
    private drawingSubject: BehaviorSubject<DrawingData>;

    constructor(private http: HttpClient) {
        this.initialiseValues();
    }

    private initialiseValues(): void {
        this.drawingData = {
            drawingName: '',
            imageBase64: '',
            tags: [],
        };
        this.drawingSubject = new BehaviorSubject<DrawingData>(this.drawingData);
    }

    getDrawingData(): Observable<DrawingData> {
        return this.drawingSubject.asObservable(); // emits
    }

    addTag(currentTag: string): void {
        if (currentTag.length === 0 || this.drawingData.tags.includes(currentTag)) return;

        this.drawingData.tags.push(currentTag);
        this.drawingSubject.next(this.drawingData);
    }

    deleteTag(index: number): void {
        this.drawingData.tags.splice(index, 1);
        this.drawingSubject.next(this.drawingData);
    }

    resetTags(): void {
        this.drawingData.tags = [];
        this.drawingSubject.next(this.drawingData);
    }

    sendData(drawingName: string): Observable<RequestResponse> {
        const subject: Subject<RequestResponse> = new Subject();
        this.drawingData.drawingName = drawingName;

        const body = this.drawingData;
        const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Headers': 'Content-Type' };

        this.http
            .post<RequestResponse>(`${API_URL}/drawing/saveDrawing`, body, { headers })
            .pipe(
                timeout(SERVER_TIMEOUT),
                catchError(() => this.emitErrorToComponent(subject)),
            )
            .subscribe((responseData: RequestResponse) => {
                if (responseData) subject.next(responseData);
            });

        return subject.asObservable();
    }

    setDrawingToBeSaved(base64Data: string): void {
        this.drawingData.imageBase64 = base64Data;
    }

    private emitErrorToComponent(subject: Subject<RequestResponse>): Observable<null> {
        subject.next({ status: HttpStatusCode.Server_Error, message: SERVER_ERROR_MESSAGE });
        return of(null);
    }
}
