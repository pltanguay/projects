import { DrawingService } from '@app/services/drawing.service';
import { EmailService } from '@app/services/email.service';
import { TYPES } from '@app/types';
import { DrawingData } from '@common/communication/drawing-data';
import { EmailData } from '@common/communication/email';
import { HttpStatusCode } from '@common/declarations/http';
import { config } from 'dotenv';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class DrawingController {
    router: Router;

    constructor(
        @inject(TYPES.DrawingService) private drawingService: DrawingService,
        @inject(TYPES.EmailService) private emailService: EmailService,
    ) {
        config({ path: './../.env' });
        this.configureRouter();

        (async () => {
            await this.drawingService.connectDatabase(process.env.MONGO_CONNECTION as string);
        })();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/getAllDrawings', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const drawings = await this.drawingService.getAllDrawings();
                res.json(drawings);
            } catch (error) {
                next(error);
            }
        });

        this.router.delete('/deleteDrawing/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this.drawingService.deleteDrawing(req.params.id);
                res.json({
                    status: HttpStatusCode.Success,
                    message: 'Dessin supprimé',
                });
            } catch (error) {
                next(error);
            }
        });

        this.router.post('/saveDrawing', async (req: Request, res: Response, next: NextFunction) => {
            try {
                await this.drawingService.insertDrawing(req.body as DrawingData);
                res.json({
                    status: HttpStatusCode.Success,
                    message: 'Image sauvegardée avec succès',
                });
            } catch (error) {
                next(error);
            }
        });

        this.router.post('/sendEmail', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const email = req.body as EmailData;
                await this.emailService.sendEmail(email);
                res.json({
                    status: HttpStatusCode.Success,
                    message: `Dessin envoyé à votre courriel à ${email.to}`,
                });
            } catch (error) {
                next(error);
            }
        });

        this.router.use((error: Error, req: Request, res: Response, next: NextFunction) => {
            res.json({
                status: HttpStatusCode.Server_Error,
                message: error.message,
            });
        });
    }
}
