// This interface is used to call the algorithm defined by the bucket service

export interface FloodfillStrategy {
    do(imageData: ImageData): ImageData;
}
