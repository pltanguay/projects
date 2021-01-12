import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RequestResponse } from '@common/communication/database';
import { DrawingData } from '@common/communication/drawing-data';
import { API_URL, HttpStatusCode } from '@common/declarations/http';
import { Subject } from 'rxjs';
import { SaveDrawingService } from './save-drawing.service';

// tslint:disable:no-string-literal

describe('SaveDrawingService', () => {
    let service: SaveDrawingService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [SaveDrawingService],
        });
        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(SaveDrawingService);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#addTag should not add tag to #drawingData if the tag is invalid', () => {
        // Arrange
        spyOn(service['drawingSubject'], 'next');
        service['drawingData'].tags = [];

        // Act
        service.addTag('');

        // Assert
        expect(service['drawingData'].tags.length).toBe(0);
        expect(service['drawingSubject'].next).not.toHaveBeenCalled();
    });

    it('#addTag should add tag to #drawingData', () => {
        // Arrange
        spyOn(service['drawingSubject'], 'next');
        service['drawingData'].tags = [];

        // Act
        service.addTag('tsPaint');

        // Assert
        expect(service['drawingData'].tags.length).toBe(1);
        expect(service['drawingSubject'].next).toHaveBeenCalled();
    });

    it('#deleteTag should remove tag from #drawingData', () => {
        // Arrange
        spyOn(service['drawingSubject'], 'next');
        service['drawingData'].tags = ['tsPaint', 'Poly'];

        // Act
        service.deleteTag(0);

        // Assert
        expect(service['drawingData'].tags).toEqual(['Poly']);
        expect(service['drawingData'].tags.length).toBe(1);
        expect(service['drawingSubject'].next).toHaveBeenCalled();
    });

    it('#sendData should post drawingData to server', () => {
        // Arrange
        const postResponse: RequestResponse = { status: HttpStatusCode.Success, message: 'OK' };
        const drawing: DrawingData = { drawingName: 'TsPaint', tags: [] };
        service['drawingData'] = drawing;

        // Act
        service.sendData(drawing.drawingName).subscribe((data) => expect(data).toEqual(postResponse, 'should return response'), fail);

        // Assert
        // should make a POST drawing request
        const req = httpTestingController.expectOne(`${API_URL}/drawing/saveDrawing`);
        expect(req.request.method).toEqual('POST');

        // expect server to return response
        const expectedResponse = new HttpResponse({ status: HttpStatusCode.Success, statusText: 'Created', body: postResponse });
        req.event(expectedResponse);

        req.flush('');
    });

    it('#sendData should show catch error message if server is down', (done) => {
        // Arrange
        const postResponse: RequestResponse = { status: HttpStatusCode.Server_Error, message: 'server down' };
        const drawing: DrawingData = { drawingName: 'TsPaint', tags: [] };
        service['drawingData'] = drawing;
        const error = new ErrorEvent(postResponse.message);

        // Act
        service.sendData(drawing.drawingName).subscribe(
            () => done(),
            (err) => {
                expect(err.status).toBe(postResponse.status);
                expect(err.message).toBe(postResponse.message);
                done();
            },
        );

        // Assert
        const req = httpTestingController.expectOne(`${API_URL}/drawing/saveDrawing`);
        expect(req.request.method).toEqual('POST');
        req.error(error, { status: HttpStatusCode.Server_Error, statusText: postResponse.message });

        httpTestingController.verify();
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
