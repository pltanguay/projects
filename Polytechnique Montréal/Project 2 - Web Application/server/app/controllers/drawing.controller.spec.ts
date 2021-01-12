import { expect } from 'chai';
import {} from 'mocha';
import * as supertest from 'supertest';
import { DrawingData } from '../../../common/communication/drawing-data';
import { EmailData } from '../../../common/communication/email';
import { HttpStatusCode } from '../../../common/declarations/http';
import { ErrorType, ServerError } from '../../../common/declarations/server-error';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { DrawingService } from '../services/drawing.service';
import { EmailService } from '../services/email.service';
import { TYPES } from '../types';

// tslint:disable:no-any

describe('DrawingController', () => {
    let baseDrawingData: DrawingData;
    let allDrawings: DrawingData[];
    let app: Express.Application;
    let drawingService: Stubbed<DrawingService>;
    let emailService: Stubbed<EmailService>;
    let emailData: EmailData;

    beforeEach(async () => {
        baseDrawingData = {
            drawingName: 'Test',
            tags: ['poly'],
            imageBase64: 'data:image/png;base64,iVBORw0',
        };
        allDrawings = [baseDrawingData, baseDrawingData];

        emailData = {
            to: 'test@gmail.com',
            payload: 'data:image/png;base64,iVBORw0',
            drawingName: 'TsPaint',
            fileFormat: 'png',
        };

        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.DrawingService).toConstantValue({
            connectDatabase: sandbox.stub().resolves(),
            insertDrawing: sandbox.stub().resolves(),
            deleteDrawing: sandbox.stub().resolves(),
            getAllDrawings: sandbox.stub().resolves(allDrawings),
        });

        container.rebind(TYPES.EmailService).toConstantValue({
            sendEmail: sandbox.stub().resolves(),
        });

        drawingService = container.get(TYPES.DrawingService);
        emailService = container.get(TYPES.EmailService);
        app = container.get<Application>(TYPES.Application).app;
    });

    it('post /saveDrawing route should return a 200 success code/message after inserting in database', async () => {
        return supertest(app).post('/drawing/saveDrawing').send(baseDrawingData).set('Accept', 'application/json').expect(HttpStatusCode.Success);
    });

    it('post /saveDrawing route should throw error upon failure of insertion in database', async () => {
        baseDrawingData.drawingName = 'ts';
        drawingService.insertDrawing.rejects(new ServerError(ErrorType.SaveDrawing));

        return supertest(app).post('/drawing/saveDrawing').send(baseDrawingData).set('Accept', 'application/json').expect(HttpStatusCode.Success);
    });

    it('post /sendEmail route should return a 200 success if email has been sent successfully', async () => {
        return supertest(app).post('/drawing/sendEmail').send(emailData).set('Accept', 'application/json').expect(HttpStatusCode.Success);
    });

    it('post /sendEmail route should throw error upon failure of sending email', async () => {
        emailData.to = 'tsPaint';
        emailService.sendEmail.rejects(new ServerError(ErrorType.Email));

        return supertest(app).post('/drawing/sendEmail').send(emailData).set('Accept', 'application/json').expect(HttpStatusCode.Success);
    });

    it('get /getAllDrawings route should return drawings saved in database', async () => {
        drawingService.getAllDrawings.resolves(allDrawings);
        return supertest(app)
            .get('/drawing/getAllDrawings')
            .expect(HttpStatusCode.Success)
            .then((response: any) => {
                expect(response.body).to.deep.equal(allDrawings);
            });
    });

    it('get /getAllDrawings route should fail when the service throws', async () => {
        drawingService.getAllDrawings.rejects(new ServerError(ErrorType.GetAllDrawings));
        return supertest(app).get('/drawing/getAllDrawings').expect(HttpStatusCode.Success);
    });

    it('delete /deleteDrawing route should delete the corresponding drawing', async () => {
        return supertest(app).delete('/drawing/deleteDrawing/123').expect(HttpStatusCode.Success);
    });

    it('delete /deleteDrawing route throws error if deletion fails', async () => {
        drawingService.deleteDrawing.rejects(new ServerError(ErrorType.DeleteDrawing));
        return supertest(app).delete('/drawing/deleteDrawing/34').expect(HttpStatusCode.Success);
    });
});
