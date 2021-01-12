import { Container } from 'inversify';
import { Application } from './app';
import { DrawingController } from './controllers/drawing.controller';
import { Server } from './server';
import { DrawingService } from './services/drawing.service';
import { EmailService } from './services/email.service';
import { TYPES } from './types';

export const containerBootstrapper: () => Promise<Container> = async () => {
    const container: Container = new Container();

    container.bind(TYPES.Server).to(Server);
    container.bind(TYPES.Application).to(Application);

    container.bind(TYPES.DrawingController).to(DrawingController);
    container.bind(TYPES.DrawingService).to(DrawingService);
    container.bind(TYPES.EmailService).to(EmailService);

    return container;
};
