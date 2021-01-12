import { Size } from '@app/services/workspace/workspace.service';
import { Memento, MementoType } from './memento';

/*
    This class represents the initial memento. It holds an image data when user loaded drawing from carousel.
    In all other cases (new drawing, first laucnch of editor-space) it is a simple
    resize. We don't store the 2D matrix of canvas
*/
export class InitialMemento implements Memento {
    readonly type: MementoType;
    size: Size;
    image?: ImageData;
    constructor(size: Size, image?: ImageData) {
        this.type = MementoType.Initial;
        this.size = size;
        this.image = image;
    }
}
