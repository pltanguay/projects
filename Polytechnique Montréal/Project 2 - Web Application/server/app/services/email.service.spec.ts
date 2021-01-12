import Axios from 'axios';
import { expect, should, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import * as Sinon from 'sinon';
import { EmailData } from '../../../common/communication/email';
import { errorMap, ErrorType, ServerError } from '../../../common/declarations/server-error';
import { EmailService } from './email.service';

// tslint:disable:no-string-literal
// tslint:disable:no-any
const IMAGE_DATA = 'data:image/png;base64,iVBORw0';

describe('EmailService', () => {
    let emailService: EmailService;
    let sandbox: Sinon.SinonSandbox;
    let emailData: EmailData;

    beforeEach(async () => {
        emailService = new EmailService();

        should();
        use(chaiAsPromised);
        sandbox = Sinon.createSandbox();

        emailData = {
            to: 'test@gmail.com',
            payload: IMAGE_DATA,
            drawingName: 'TsPaint',
            fileFormat: 'png',
        };
    });

    afterEach(() => sandbox.restore());

    it('#validateEmail should return #ErrorType.ValidateEmail if the email is invalid', () => {
        // Arrange
        const invalidEmail = 'tspaint';

        // Act
        const func = emailService['validateEmail'].bind(emailService, invalidEmail);

        // Assert
        expect(func).to.throw(errorMap.get(ErrorType.ValidateEmail));
    });

    it('#dataURLtoBuffer should return buffer from image base64', () => {
        // Arrange
        sandbox.stub(emailService, 'dataURLtoBuffer' as any).returns(IMAGE_DATA);

        // Act
        const buffer = emailService['dataURLtoBuffer'](IMAGE_DATA);

        // Assert
        expect(buffer).not.to.equal('');
    });

    it('#createFormData should create form and append header and properties', () => {
        // Arrange

        // Act
        const formData = emailService['createFormData'](emailData);

        // Assert
        expect(formData).not.to.equal(null);
    });

    it('#sendEmail should not make post request if email is invalid', () => {
        // Arrange
        emailData.to = 'tsPaint';
        const axiosSpy = sandbox.spy(Axios, 'post');

        // Act
        const promise = emailService.sendEmail(emailData);

        // Assert
        expect(promise).to.eventually.rejectedWith(ServerError);
        Sinon.assert.notCalled(axiosSpy);
    });

    it('#sendEmail should throw error if post request returns error', () => {
        // Arrange
        sandbox.stub(Axios, 'post').throws(new Error());

        // Act
        const promise = emailService.sendEmail(emailData);

        // Assert
        expect(promise).to.eventually.rejectedWith(ServerError);
    });

    it('#sendEmail should make post request if email and other properties are valid', () => {
        // Arrange
        const resolved = new Promise((resolve) => resolve());
        const axiosSpy = sandbox.stub(Axios, 'post').returns(resolved);

        // Act
        emailService.sendEmail(emailData);

        // Assert
        expect(axiosSpy.called).to.equal(true);
    });
});
