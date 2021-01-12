import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { FILTER_DATA } from '@app/declarations/export-data';
import { CanvasService } from '@app/services/canvas/canvas.service';
import { RequestResponse } from '@common/communication/database';
import { EmailData } from '@common/communication/email';
import { API_URL, HttpStatusCode } from '@common/declarations/http';
import { ExportDrawingService } from './export-drawing.service';

// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
// tslint:disable:no-any
describe('ExportDrawingService', () => {
    let service: ExportDrawingService;
    let canvasService: jasmine.SpyObj<CanvasService>;
    let canvasContext: CanvasRenderingContext2D;
    let rendererSpy: jasmine.SpyObj<Renderer2>;
    let htmlElementSpy: jasmine.SpyObj<HTMLAnchorElement>;
    let canvasStub: HTMLCanvasElement;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        rendererSpy = jasmine.createSpyObj('Renderer2', ['createElement']);

        htmlElementSpy = jasmine.createSpyObj('HTMLAnchorElement', ['click']);
        rendererSpy.createElement.and.returnValue(htmlElementSpy);

        canvasStub = canvasTestHelper.canvas;

        canvasContext = canvasStub.getContext('2d') as CanvasRenderingContext2D;
        canvasService = {
            ...jasmine.createSpyObj('CanvasService', ['clean', 'isEmpty', 'clearCanvas', 'getContext']),
            canvas: canvasStub,
            width: canvasStub.width,
            height: canvasStub.height,
        } as jasmine.SpyObj<CanvasService>;

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: CanvasService, useValue: canvasService }],
        });
        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(ExportDrawingService);

        service['renderer'] = rendererSpy;
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#findFilter should return the right filter', () => {
        // Arrange
        const filterName = FILTER_DATA[0].name;

        // Act
        const foundFilter = service.findFilter(filterName);

        // Assert
        expect(foundFilter).toEqual(FILTER_DATA[0]);
    });

    it('#download should create an HTMLAnchorElement', () => {
        // Arrange
        spyOn<any>(service, 'buildURL');

        // Act
        service.download();

        // Assert
        expect(service.downloadElement).not.toBeNull();
    });

    it('#buildTemporaryCtxFiltered should call #buildCssProperty in service and #drawImage on context', () => {
        // Arrange
        const spy = spyOn<any>(service, 'buildCssProperty');
        rendererSpy.createElement.and.returnValue(canvasStub);

        // Act
        service['buildTemporaryCtxFiltered']();

        // Assert
        expect(spy).toHaveBeenCalled();
    });

    it('#buildURL should return an url', () => {
        // Arrange
        const format = 'jpeg';
        spyOn<any>(service, 'buildTemporaryCtxFiltered').and.returnValue(canvasContext);

        // Act
        const url = service['buildURL'](format);

        // Assert
        expect(url).toContain(format);
    });

    it('#updateCssProperty should set new css property', () => {
        // Arrange
        spyOn<any>(service, 'buildCssProperty').and.returnValue('Grayscale(50%)');

        // Act
        service.updateCssProperty();

        // Assert
        expect(service.cssFilter).toEqual('Grayscale(50%)');
    });

    it('#buildCssProperty should return none with Aucun filter', () => {
        // Arrange
        const noneFilter = FILTER_DATA[0];

        // Act
        const cssProperty = service['buildCssProperty'](noneFilter, 20);

        // Assert
        expect(cssProperty).toEqual('none');
    });

    it('#buildCssProperty should return grayscale(100%) with grayscale filter and value of 100%', () => {
        // Arrange
        const grayscaleFilter = FILTER_DATA[2];

        // Act
        const cssProperty = service['buildCssProperty'](grayscaleFilter, 100);

        // Assert
        expect(cssProperty).toEqual('grayscale(100%)');
    });

    it('#sendEmail should post EmailData to server', () => {
        // Arrange
        const postResponse: RequestResponse = { status: HttpStatusCode.Success, message: 'OK' };
        const email: EmailData = {
            to: 'test@yahoo.com',
            drawingName: 'TsPaint',
            fileFormat: 'jpg',
            payload: 'test',
        };
        spyOn<any>(service, 'buildURL').and.returnValue('jpg');

        // Act
        service.sendEmail(email.to).subscribe((data) => expect(data).toEqual(postResponse, 'should return response'), fail);

        // Assert
        // should make a POST drawing request
        const req = httpTestingController.expectOne(`${API_URL}/drawing/sendEmail`);
        expect(req.request.method).toEqual('POST');

        // expect server to return response
        const expectedResponse = new HttpResponse({ status: HttpStatusCode.Success, statusText: 'Created', body: postResponse });
        req.event(expectedResponse);

        req.flush('');
    });

    it('#sendEmail should show catch error message if server is down', (done) => {
        // Arrange
        const postResponse: RequestResponse = { status: HttpStatusCode.Server_Error, message: 'server down' };
        const email: EmailData = {
            to: 'test@yahoo.com',
            drawingName: 'TsPaint',
            fileFormat: 'jpg',
            payload: 'test',
        };
        const error = new ErrorEvent(postResponse.message);
        spyOn<any>(service, 'buildURL').and.returnValue('jpg');

        // Act
        service.sendEmail(email.to).subscribe(
            () => done(),
            (err) => {
                expect(err.status).toBe(postResponse.status);
                expect(err.message).toBe(postResponse.message);
                done();
            },
        );

        // Assert
        const req = httpTestingController.expectOne(`${API_URL}/drawing/sendEmail`);
        expect(req.request.method).toEqual('POST');
        req.error(error, { status: HttpStatusCode.Server_Error, statusText: postResponse.message });

        httpTestingController.verify();
    });
});
