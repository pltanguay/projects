import { expect, should, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import { describe } from 'mocha';
import { MongoClient, ObjectID } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as Sinon from 'sinon';
import { DrawingData } from '../../../common/communication/drawing-data';
import { errorMap, ErrorType, ServerError } from '../../../common/declarations/server-error';
import { DrawingService } from './drawing.service';

// tslint:disable:no-string-literal
// tslint:disable:no-any

const IMAGE_DATA = 'data:image/png;base64,iVBORw0';
const OBJECT_ID = new ObjectID('507f1f77bcf86cd799439011');

describe('DrawingService', () => {
    let drawingService: DrawingService;
    const mongoServer: MongoMemoryServer = new MongoMemoryServer();
    let testCollectionData: DrawingData;
    let mongoUri: string;
    let sandbox: Sinon.SinonSandbox;

    should();
    use(chaiAsPromised);

    beforeEach(async () => {
        drawingService = new DrawingService();
        sandbox = Sinon.createSandbox();

        // Start a local test server
        mongoUri = await mongoServer.getUri();
        await drawingService.connectDatabase(mongoUri);

        testCollectionData = { drawingName: 'TsPaint', tags: ['Poly', 'Projet'], imageBase64: IMAGE_DATA };

        await drawingService.collection.insertOne(testCollectionData);
    });

    afterEach(async () => {
        sandbox.restore();
        drawingService.closeConnection();
    });

    it('#connectDatabase should connect the mongoClient to the database', () => {
        // Arrange
        sandbox.stub(console, 'error');
        const exit = sandbox.stub(process, 'exit');

        // Act
        const promise = drawingService.connectDatabase(mongoUri);

        // Assert
        expect(promise).to.eventually.not.rejectedWith(ServerError);
        Sinon.assert.notCalled(exit);
        exit.restore();
    });

    it('#connectDatabase should not detect a MongoClient', async () => {
        // Arrange
        sandbox.stub(MongoClient, 'connect').resolves(null);

        // Act
        await drawingService.connectDatabase(mongoUri);

        // Assert
        expect(drawingService.client).to.not.equal(null);
    });

    it('#connectDatabase should not connect to the mongoClient when exception thrown', () => {
        // Arrange
        sandbox.stub(MongoClient, 'connect').throws(new Error());
        sandbox.stub(console, 'error');
        const exit = sandbox.stub(process, 'exit');

        // Act
        const promise = drawingService.connectDatabase(mongoUri);

        // Assert
        expect(promise).to.eventually.not.rejectedWith(ServerError);
        Sinon.assert.called(exit);
        exit.restore();
    });

    it('#closeConnection should close the #client', () => {
        // Arrange
        const spy = sandbox.spy(drawingService.client, 'close');

        // Act
        drawingService.closeConnection();

        // Assert
        Sinon.assert.called(spy);
    });

    it('#getAllDrawings should collect drawings from database', () => {
        // Arrange
        sandbox.stub(drawingService, 'getIdFromFiles' as any).returns([OBJECT_ID.toHexString()]);
        sandbox.stub(drawingService, 'convertPNGToBase64' as any).returns(IMAGE_DATA);
        sandbox.stub(drawingService.collection, 'findOne').resolves(testCollectionData);

        // Act
        const promise = drawingService['getAllDrawings']();

        // Assert
        const expectedValue = {
            id: OBJECT_ID.toHexString(),
            drawingName: testCollectionData.drawingName,
            tags: testCollectionData.tags,
            imageBase64: testCollectionData.imageBase64,
        };
        expect(promise).to.eventually.include.deep.include(expectedValue);
    });

    it('#getAllDrawings should not get DrawingData if the database does not find any drawing', async () => {
        // Arrange
        sandbox.stub(drawingService, 'getIdFromFiles' as any).returns([OBJECT_ID.toHexString()]);
        sandbox.stub(drawingService, 'convertPNGToBase64' as any).returns(IMAGE_DATA);
        sandbox.stub(drawingService.collection, 'findOne').resolves(null);

        // Act
        const drawings = await drawingService['getAllDrawings']();

        // Assert
        expect(drawings.length).to.equal(0);
    });

    it('#getAllDrawings should throw #ServerError if any error occurs', () => {
        // Arrange
        const files: string[] = ['test1'];
        sandbox.stub(drawingService, 'getIdFromFiles' as any).returns(files);
        sandbox.stub(drawingService, 'convertPNGToBase64' as any).returns(IMAGE_DATA);

        // Act
        const promise = drawingService['getAllDrawings']();

        // Assert
        expect(promise).to.eventually.rejectedWith(ServerError);
    });

    it('#insertDrawing should insert a new drawing', async () => {
        // Arrange
        const initialDrawing: DrawingData = { drawingName: 'Test', tags: ['TsPaint'], imageBase64: '' };
        sandbox.stub(fs, 'writeFile').returns();
        sandbox.stub(drawingService, 'validateDrawing' as any).returns(null);

        // Act
        const promise = drawingService.insertDrawing(initialDrawing);

        // Assert
        expect(promise).to.eventually.not.rejectedWith(ServerError);
        const drawings = await drawingService.collection.find({}).toArray();
        expect(drawings.length).to.above(1);
    });

    it('#insertDrawing should not insert when database returns null result', async () => {
        // Arrange
        const initialDrawing: DrawingData = { drawingName: 'Test', tags: ['TsPaint'], imageBase64: '' };
        sandbox.stub(fs, 'writeFile');
        sandbox.stub(drawingService, 'validateDrawing' as any).returns(null);
        sandbox.stub(drawingService.collection, 'insertOne').resolves(null);

        // Act
        const promise = drawingService.insertDrawing(initialDrawing);

        // Assert
        expect(promise).to.eventually.not.rejectedWith(ServerError);
    });

    it('#insertDrawing should not insert a new drawing if the #drawingName is invalid', () => {
        // Arrange
        const corruptData: DrawingData = { drawingName: '', tags: [], imageBase64: '' };
        const insertSpy = sandbox.spy(drawingService.collection, 'insertOne');

        // Act
        const promise = drawingService.insertDrawing(corruptData);

        // Assert
        expect(promise).to.eventually.rejectedWith(ServerError);
        Sinon.assert.notCalled(insertSpy);
    });

    it('#insertDrawing should throw error if insertion fails', () => {
        // Arrange
        const initialDrawing: DrawingData = { drawingName: 'Test', tags: ['TsPaint'], imageBase64: '' };
        sandbox.stub(drawingService, 'validateDrawing' as any).returns(null);
        sandbox.stub(drawingService.collection, 'insertOne').throws(new Error());

        // Act
        const promise = drawingService.insertDrawing(initialDrawing);

        // Assert
        expect(promise).to.eventually.rejectedWith(ServerError);
    });

    it('#saveFileImage should throw error if writeFile fails', () => {
        // Arrange
        sandbox.stub(fs, 'writeFile').yields(new Error());

        // Act
        const saveFunc = drawingService['saveFileImage'].bind(drawingService, OBJECT_ID, IMAGE_DATA);

        // Assert
        expect(saveFunc).to.throw(ServerError);
    });

    it('#saveFileImage should not do anything if no error occurs', () => {
        // Arrange
        sandbox.stub(fs, 'writeFile').yields(null);

        // Act
        const saveFunc = drawingService['saveFileImage'].bind(drawingService, OBJECT_ID, IMAGE_DATA);

        // Assert
        expect(saveFunc).to.not.throw(ServerError);
    });

    it('#saveFileImage should return #ServerError if the image is null', () => {
        // Arrange

        // Act
        const saveFunc = drawingService['saveFileImage'].bind(drawingService, OBJECT_ID, null);

        // Assert
        expect(saveFunc).to.throw(ServerError);
    });

    it('#saveFileImage should save image', () => {
        // Arrange
        sandbox.stub(fs, 'writeFile').returns();

        // Act
        const saveFunc = drawingService['saveFileImage'].bind(drawingService, OBJECT_ID, IMAGE_DATA);

        // Assert
        expect(saveFunc).to.not.throw(ServerError);
    });

    it('#deleteFileImage should delete the image', () => {
        // Arrange
        sandbox.stub(fs, 'unlinkSync').returns();

        // Act
        const func = drawingService['deleteFileImage'].bind(drawingService, OBJECT_ID);

        // Assert
        expect(func).to.not.throw(ServerError);
    });

    it('#deleteDrawing should delete the image', () => {
        // Arrange
        sandbox.stub(fs, 'unlinkSync').returns();
        const spy = sandbox.spy(drawingService.collection, 'findOneAndDelete');

        // Act
        const promise = drawingService['deleteDrawing'](OBJECT_ID.toHexString());

        // Assert
        expect(promise).to.eventually.not.rejectedWith(ServerError);
        expect(spy.called).to.equal(true);
    });

    it('#deleteDrawing should throw error if delete fails', async () => {
        // Arrange
        const error = new Error();
        sandbox.stub(drawingService, 'deleteFileImage' as any).throws(error);

        // Act
        const promise = drawingService['deleteDrawing'](OBJECT_ID.toHexString());

        // Assert
        expect(promise).to.eventually.rejectedWith(ServerError);
    });

    it('#getIdFromFiles should retrieve all images from folder and return the files name', () => {
        // Arrange
        const files: string[] = ['test1.png', 'test2.png', '.keep'];
        sandbox.stub(fs, 'readdirSync').returns(files as any[]);

        const results = ['test1', 'test2'];

        // Act
        const filesResult = drawingService['getIdFromFiles']();

        // Assert
        const isDifferent = filesResult.some((file, index) => file !== results[index]);
        expect(filesResult.length).to.equal(results.length);
        expect(isDifferent).to.equal(false);
    });

    it('#convertPNGToBase64 should transform image to base64', () => {
        // Arrange
        const fakeFile = 'Test';
        sandbox.stub(fs, 'readFileSync').returns(fakeFile);

        // Act
        const imageBase64 = drawingService['convertPNGToBase64'](fakeFile);

        // Assert
        expect(imageBase64).to.contain('data:image/png;base64,');
    });

    it('#validateDrawing should return #ErrorType.ValidateLength if the #drawingName is less than 3 characters', () => {
        // Arrange
        const corruptData: DrawingData = { drawingName: 'ts', tags: [] };

        // Act
        const func = drawingService['validateDrawing'].bind(drawingService, corruptData);

        // Assert
        expect(func).to.throw(errorMap.get(ErrorType.ValidateLength));
    });

    it("#validateDrawing should return #ErrorType.ValidateLength if at least one of the tag's length is less than 3 characters", () => {
        // Arrange
        const corruptData: DrawingData = { drawingName: 'tsPaint', tags: ['first', 'ts'] };

        // Act
        const func = drawingService['validateDrawing'].bind(drawingService, corruptData);

        // Assert
        expect(func).to.throw(errorMap.get(ErrorType.ValidateLength));
    });

    it("#validateDrawing should return #ErrorType.ValidateContent if at least one of the tag's length contains a symbol", () => {
        // Arrange
        const corruptData: DrawingData = { drawingName: 'tsPaint', tags: ['first', 't-s'] };

        // Act
        const func = drawingService['validateDrawing'].bind(drawingService, corruptData);

        // Assert
        expect(func).to.throw(errorMap.get(ErrorType.ValidateContent));
    });
});
