import { EmailData } from '@common/communication/email';
import { ErrorType, ServerError } from '@common/declarations/server-error';
import Axios from 'axios';
import { config } from 'dotenv';
import * as FormData from 'form-data';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class EmailService {
    constructor() {
        config({ path: './../.env' });
    }

    async sendEmail(emailData: EmailData): Promise<void> {
        try {
            this.validateEmail(emailData.to);

            const url = 'http://log2990.step.polymtl.ca/email?address_validation=false&quick_return=false&dry_run=false';
            const formData: FormData = this.createFormData(emailData);

            const axiosOptions = {
                headers: {
                    'x-team-key': process.env.X_TEAM_KEY,
                    'Content-Type': 'multipart/form-data',
                    ...formData.getHeaders(),
                },
            };

            await Axios.post(url, formData.getBuffer(), axiosOptions);
        } catch (error) {
            if (error instanceof ServerError) {
                throw error;
            } else {
                throw new ServerError(ErrorType.Email);
            }
        }
    }

    private createFormData(emailData: EmailData): FormData {
        const payloadBuffer = this.dataURLtoBuffer(emailData.payload);

        const formDataOptions = {
            contentType: `image/${emailData.fileFormat}`,
            filename: `${emailData.drawingName}.${emailData.fileFormat}`,
        };

        const formData: FormData = new FormData();
        formData.append('to', emailData.to);
        formData.append('payload', payloadBuffer, formDataOptions);

        return formData;
    }

    private dataURLtoBuffer(dataURL: string): Buffer {
        const imageData = dataURL.split(',');
        const buffer = Buffer.from(imageData[1], 'base64');
        return buffer;
    }

    private validateEmail(emailAddress: string): void {
        if (
            !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                emailAddress,
            )
        ) {
            throw new ServerError(ErrorType.ValidateEmail);
        }
    }
}
