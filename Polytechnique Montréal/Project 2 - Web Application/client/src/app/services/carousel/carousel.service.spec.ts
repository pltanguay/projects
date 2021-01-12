import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CircularBuffer } from '@app/classes/utils/ring-buffer';
import { ResizeService } from '@app/services/resize/resize.service';
import { RequestResponse } from '@common/communication/database';
import { DrawingData } from '@common/communication/drawing-data';
import { API_URL, HttpStatusCode } from '@common/declarations/http';
import { Subject } from 'rxjs';
import { CarouselService } from './carousel.service';

// tslint:disable:no-string-literal
// tslint:disable:no-any

describe('CarouselService', () => {
    let service: CarouselService;
    let resizeServiceSpy: jasmine.SpyObj<ResizeService>;
    let bufferSpy: jasmine.SpyObj<CircularBuffer<DrawingData>>;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        resizeServiceSpy = jasmine.createSpyObj('ResizeService', ['resize']);
        bufferSpy = jasmine.createSpyObj('CirculerBuffer', ['next', 'add', 'previous', 'reset']);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: ResizeService, useValue: resizeServiceSpy }],
        });
        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(CarouselService);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#getDrawings should get all drawings from server', () => {
        // Arrange
        const drawing: DrawingData = { drawingName: 'TsPaint', tags: [] };
        const drawings: DrawingData[] = [drawing, drawing];
        const httpGetResponse: RequestResponse = { status: HttpStatusCode.Success, message: 'Server is working' };

        // Act
        service
            .getDrawings()
            .subscribe((response: RequestResponse) => expect(response).toEqual(httpGetResponse, 'should return response of http request'), fail);

        // Assert
        // should make a GET drawing request
        const req = httpTestingController.expectOne(`${API_URL}/drawing/getAllDrawings`);
        expect(req.request.method).toEqual('GET');

        // expect server to return response
        const expectedResponse = new HttpResponse({ status: HttpStatusCode.Success, statusText: 'Created', body: drawings });
        req.event(expectedResponse);

        req.flush('');
    });

    it('#getDrawings should catch error if request fails', (done) => {
        // Arrange
        const httpGetResponse: RequestResponse = { status: HttpStatusCode.Server_Error, message: 'Server is down' };
        const error = new ErrorEvent(httpGetResponse.message);

        // Act
        service.getDrawings().subscribe(
            () => done(),
            (err) => {
                expect(err.status).toBe(httpGetResponse.status);
                expect(err.message).toBe(httpGetResponse.message);
                done();
            },
        );

        // Assert
        const req = httpTestingController.expectOne(`${API_URL}/drawing/getAllDrawings`);
        expect(req.request.method).toEqual('GET');
        req.error(error, { status: HttpStatusCode.Server_Error, statusText: httpGetResponse.message });

        httpTestingController.verify();
    });

    it('#deleteDrawing should make delete request to server and remove drawing from #ringBuffer if got success response', () => {
        // Arrange
        const firstDrawing: DrawingData = { drawingName: 'TsPaint', tags: [], id: '1' };
        const secondDrawing: DrawingData = { drawingName: 'Poly', tags: [], id: '2' };
        const drawings: DrawingData[] = [firstDrawing, secondDrawing];
        service['ringBuffer'].add(drawings);
        const postResponse: RequestResponse = { status: HttpStatusCode.Success, message: 'server is working' };

        // Act
        service.deleteDrawing(secondDrawing.id as string).subscribe((data) => expect(data).toEqual(postResponse, 'should return response'), fail);

        // Assert
        // should make a DELETE drawing request
        const req = httpTestingController.expectOne(`${API_URL}/drawing/deleteDrawing/${secondDrawing.id}`);
        expect(req.request.method).toEqual('DELETE');

        // expect server to return response
        const expectedResponse = new HttpResponse({ status: HttpStatusCode.Success, statusText: 'Created', body: postResponse });
        req.event(expectedResponse);
        expect(service['ringBuffer'].size).toBe(1);

        req.flush('');
    });

    it('#deleteDrawing should make delete request to server and remove drawing from #ringBuffer if got success response', () => {
        // Arrange
        const firstDrawing: DrawingData = { drawingName: 'TsPaint', tags: [], id: '1' };
        const secondDrawing: DrawingData = { drawingName: 'Poly', tags: [], id: '2' };
        const drawings: DrawingData[] = [firstDrawing, secondDrawing];
        service['ringBuffer'].add(drawings);
        const postResponse: RequestResponse = { status: HttpStatusCode.Server_Error, message: 'server is not working' };

        // Act
        service.deleteDrawing(secondDrawing.id as string).subscribe((data) => expect(data).toEqual(postResponse, 'should return response'), fail);

        // Assert
        // should make a DELETE drawing request
        const req = httpTestingController.expectOne(`${API_URL}/drawing/deleteDrawing/${secondDrawing.id}`);
        expect(req.request.method).toEqual('DELETE');

        // expect server to return response
        const expectedResponse = new HttpResponse({ status: HttpStatusCode.Server_Error, statusText: 'Created', body: postResponse });
        req.event(expectedResponse);
        expect(service['ringBuffer'].size).toBe(2);

        req.flush('');
    });

    it('#deleteDrawing should catch error if request fails', (done) => {
        // Arrange
        const firstDrawing: DrawingData = { drawingName: 'TsPaint', tags: [], id: '1' };
        const secondDrawing: DrawingData = { drawingName: 'Poly', tags: [], id: '2' };
        const drawings: DrawingData[] = [firstDrawing, secondDrawing];
        service['ringBuffer'].add(drawings);
        const postResponse: RequestResponse = { status: HttpStatusCode.Server_Error, message: 'server is down' };
        const error = new ErrorEvent(postResponse.message);

        // Act
        service.deleteDrawing(secondDrawing.id as string).subscribe(
            () => done(),
            (err) => {
                expect(err.status).toBe(postResponse.status);
                expect(err.message).toBe(postResponse.message);
                done();
            },
        );

        // Assert
        const req = httpTestingController.expectOne(`${API_URL}/drawing/deleteDrawing/${secondDrawing.id}`);
        expect(req.request.method).toEqual('DELETE');
        req.error(error, { status: HttpStatusCode.Server_Error, statusText: postResponse.message });

        expect(service['ringBuffer'].size).toBe(2); // no drawings deleted

        httpTestingController.verify();
    });

    it('#currentDrawings should return all drawings from #ringBuffer', () => {
        // Arrange
        const drawing: DrawingData = { drawingName: 'TsPaint', tags: [] };
        const drawings: DrawingData[] = [drawing, drawing];
        service['ringBuffer'].add(drawings);

        // Act
        const serviceDrawings = service.currentDrawings;

        // Assert
        expect(serviceDrawings).toEqual(drawings);
        expect(serviceDrawings.length).toEqual(drawings.length);
    });

    it('#next should call #next of #ringBuffer', () => {
        // Arrange
        service['ringBuffer'] = bufferSpy;

        // Act
        service.next();

        // Assert
        expect(bufferSpy.next).toHaveBeenCalled();
    });

    it('#next should not call #next of #ringBuffer if the size of #ringBuffer is less than 3', () => {
        // Arrange
        service['ringBuffer'] = bufferSpy;
        Object.defineProperty(service['ringBuffer'], 'size', { value: 2 });

        // Act
        service.next();

        // Assert
        expect(bufferSpy.next).not.toHaveBeenCalled();
    });

    it('#previous should not call #previous of #ringBuffer if the size of #ringBuffer is less than 3', () => {
        // Arrange
        service['ringBuffer'] = bufferSpy;
        Object.defineProperty(service['ringBuffer'], 'size', { value: 2 });

        // Act
        service.previous();

        // Assert
        expect(bufferSpy.next).not.toHaveBeenCalled();
    });

    it('#previous should call #previous of #ringBuffer', () => {
        // Arrange
        service['ringBuffer'] = bufferSpy;

        // Act
        service.previous();

        // Assert
        expect(bufferSpy.previous).toHaveBeenCalled();
    });

    it('#canOpen should return whether canvas is empty or not', () => {
        // Arrange
        service['canvasService'].isEmpty = false;

        // Act
        const isEmpty = service.canOpen();

        // Assert
        expect(isEmpty).toBe(false);
    });

    it('#drawingsLength should return the size of #ringBuffer', () => {
        // Arrange
        const drawing: DrawingData = { drawingName: 'TsPaint', tags: [] };
        service['ringBuffer'] = new CircularBuffer();
        service['ringBuffer'].add([drawing, drawing]);

        // Act
        const length = service.drawingsLength;

        // Assert
        expect(length).toBe(2);
    });

    it('#reset should call reset of #ringBuffer', () => {
        // Arrange
        service['ringBuffer'] = bufferSpy;

        // Act
        service.reset();

        // Assert
        expect(bufferSpy.reset).toHaveBeenCalled();
    });

    it('#emitErrorToComponent should call next of subject of', () => {
        // Arrange
        const subject: Subject<RequestResponse> = new Subject();
        spyOn(subject, 'next');

        // Act
        service['emitErrorToComponent'](subject);

        // Assert
        expect(subject.next).toHaveBeenCalled();
    });
});
