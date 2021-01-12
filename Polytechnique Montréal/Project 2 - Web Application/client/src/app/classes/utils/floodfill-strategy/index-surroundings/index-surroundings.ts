/*
    EXPLANATION:
    
    As we do the flood fill on one dimensionnal array (the data of the image), we can just consider
    one index instead of a whole Point(x, y). If we have a position in a canvas matrix (x,y)
    the index of the color is : index = y * width + x. At this index, the first byte is red, after grenn...
    A point west from (x, y) => (x+1, y) has index = y * width + x + 1 (we just increment index);
    A point east from (x, y) => (x, y+1) has index = (y+1) * width + x (we add width to index);
    A point north from (x, y) => (x, y-1) has index = (y-1) * width + x  (we just substract width from index);
    A point south from (x, y) => (x - 1,) has index = (y) * width + x-1 (we just decrement index);
    All this is done to optimize the algorithm of floodfill !
*/

export class IndexWithSurroundings {
    private index: number;
    width: number; // width of canvas

    constructor(index: number, width: number) {
        this.index = index;
        this.width = width;
    }

    get center(): number {
        return this.index;
    }
    get west(): IndexWithSurroundings {
        return new IndexWithSurroundings(this.index - 1, this.width);
    }

    get east(): IndexWithSurroundings {
        return new IndexWithSurroundings(this.index + 1, this.width);
    }

    get north(): IndexWithSurroundings {
        return new IndexWithSurroundings(this.index - this.width, this.width);
    }

    get south(): IndexWithSurroundings {
        return new IndexWithSurroundings(this.index + this.width, this.width);
    }
}
