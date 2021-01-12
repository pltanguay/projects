import { DrawingData } from '@common/communication/drawing-data';
import { ErrorType, ServerError } from '@common/declarations/server-error';
import * as fs from 'fs';
import { injectable } from 'inversify';
import { Collection, MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import 'reflect-metadata';

const DB_COLLECTION = 'drawingTable';
const DRAWINGS_PATH = './assets/drawings';
const PNG_EXTENSION_SIZE = 4;
const MIN_LENGTH = 3;
const MAX_LENGTH = 20;

@injectable()
export class DrawingService {
    collection: Collection<DrawingData>;
    client: MongoClient;

    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    async connectDatabase(uri: string): Promise<void> {
        try {
            const client = await MongoClient.connect(uri, this.options);
            if (client) {
                this.client = client;
                this.collection = client.db().collection(DB_COLLECTION);
            }
        } catch (error) {
            console.error('CONNECTION ERROR. EXITING PROCESS');
            process.exit(1);
        }
    }

    closeConnection(): void {
        this.client.close();
    }

    async insertDrawing(drawingData: DrawingData): Promise<void> {
        try {
            this.validateDrawing(drawingData);

            const collectionData: DrawingData = {
                drawingName: drawingData.drawingName,
                tags: drawingData.tags,
            };

            const result = await this.collection.insertOne(collectionData);

            if (result) {
                const id = result.ops[0]._id;
                this.saveFileImage(id, drawingData.imageBase64 as string);
            }
        } catch (error) {
            if (error instanceof ServerError) {
                throw error;
            } else {
                throw new ServerError(ErrorType.InsertDrawing);
            }
        }
    }

    async getAllDrawings(): Promise<DrawingData[]> {
        const drawingsData: DrawingData[] = [];

        try {
            const idFiles: string[] = this.getIdFromFiles();

            for (const idFile of idFiles) {
                const base64 = this.convertPNGToBase64(idFile);
                const dbData: DrawingData | null = await this.collection.findOne({ _id: new ObjectId(idFile) });
                if (dbData) {
                    drawingsData.push({
                        id: idFile,
                        drawingName: dbData.drawingName,
                        tags: dbData.tags,
                        imageBase64: base64,
                    });
                }
            }
        } catch (error) {
            throw new ServerError(ErrorType.GetAllDrawings);
        }

        return drawingsData;
    }

    async deleteDrawing(id: string): Promise<void> {
        try {
            this.deleteFileImage(id);
            await this.collection.findOneAndDelete({ _id: new ObjectId(id) });
        } catch (error) {
            throw new ServerError(ErrorType.DeleteDrawing);
        }
    }

    private getIdFromFiles(): string[] {
        // get all files in folder
        const files = fs.readdirSync(DRAWINGS_PATH);

        // remove .keep file
        const keepFileIndex = files.indexOf('.keep');
        files.splice(keepFileIndex, 1);

        // remove .png from files
        for (let i = 0; i < files.length; i++) {
            files[i] = files[i].slice(0, files[i].length - PNG_EXTENSION_SIZE);
        }

        return files;
    }

    private convertPNGToBase64(id: string): string {
        const image = fs.readFileSync(this.getPathImage(id));
        const buffer = Buffer.from(image).toString('base64');
        const base64 = 'data:image/png;base64,' + buffer;

        return base64;
    }

    private saveFileImage(id: ObjectId, imageData: string): void {
        try {
            imageData = imageData.replace(/^data:image\/png;base64,/, '');
            const handler = (error: TypeError) => {
                if (error) {
                    throw new ServerError(ErrorType.SaveFile);
                }
            };
            fs.writeFile(this.getPathImage(id), imageData, { encoding: 'base64' }, handler);
        } catch (error) {
            throw new ServerError(ErrorType.SaveFile);
        }
    }

    private deleteFileImage(id: string): void {
        fs.unlinkSync(this.getPathImage(id));
    }

    private getPathImage(id: string | ObjectId): string {
        return `${DRAWINGS_PATH}/${id}.png`;
    }

    private validateDrawing(drawing: DrawingData): void {
        if (drawing.drawingName.length >= 0 && drawing.drawingName.length < MIN_LENGTH) {
            throw new ServerError(ErrorType.ValidateLength);
        }

        drawing.tags.forEach((tag: string): ServerError | void => {
            if (/[~`!#$%\^&@*+=\-\[\]\\';,._/{}()|\\":<>\?]/g.test(tag) || tag.includes(' ')) {
                throw new ServerError(ErrorType.ValidateContent);
            }

            if ((tag.length >= 0 && tag.length < MIN_LENGTH) || tag.length > MAX_LENGTH) {
                throw new ServerError(ErrorType.ValidateLength);
            }
        });
    }
}
