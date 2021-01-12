export const enum ErrorType {
    SaveDrawing = 'SaveDrawing',
    SaveFile = 'SaveFile',
    DeleteDrawing = 'DeleteDrawing',
    GetAllDrawings = 'GetAllDrawings',
    ValidateLength = 'ValidateLength',
    ValidateContent = 'ValidateContent',
    ValidateEmail = 'ValidateEmail',
    InsertDrawing = 'InsertDrawing',
    Email = 'Email',
}

export const errorMap: Map<ErrorType, string> = new Map<ErrorType, string>([
    [ErrorType.SaveDrawing, 'Erreur de sauvegarde du dessin dans le serveur'],
    [ErrorType.SaveFile, 'Échec de File System par le serveur'],
    [ErrorType.DeleteDrawing, 'Erreur de suppression du dessin'],
    [ErrorType.GetAllDrawings, 'Échec envers la récupération des dessins'],
    [ErrorType.ValidateLength, 'Longueur du nom ou tags invalide'],
    [ErrorType.ValidateContent, 'Contenu du tags invalide (Présence de symboles)'],
    [ErrorType.ValidateEmail, 'Adresse courriel invalide'],
    [ErrorType.InsertDrawing, "Échec d'insertion dans la base de données"],
    [ErrorType.Email, "Échec du serveur lors de l'envoi du dessin à votre courriel"],
]);

export class ServerError extends Error {
    type: ErrorType;

    constructor(code: ErrorType) {
        super();
        this.type = code;
    }

    get message(): string {
        return errorMap.get(this.type) as string;
    }
}
