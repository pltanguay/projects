export enum AlertType {
    Warning = 'Warning',
    Success = 'Success',
    ChangesSaved = 'ChangesSaved',
}

export interface CanvasAlert {
    hasBeenSentByComponent?: boolean;
    canShowAlert: boolean;
    alert?: string;
    type?: AlertType;
}
