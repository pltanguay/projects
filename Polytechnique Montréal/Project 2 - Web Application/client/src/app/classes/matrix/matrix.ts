export const ORDER = 3;
export class Matrix {
    matrix: number[][];

    constructor(matrix?: number[][]) {
        if (matrix) {
            this.matrix = matrix;
            return;
        }
        this.matrix = [];
        this.identity();
    }

    private identity(): void {
        this.matrix = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
        ];
    }

    // A * B
    multiply(B: Matrix): Matrix {
        const newMatrix = new Matrix();
        for (let i = 0; i < this.m; i++) {
            for (let j = 0; j < B.n; j++) {
                let res = 0;
                for (let k = 0; k < this.n; k++) {
                    res += this.matrix[i][k] * B.matrix[k][j];
                }
                newMatrix.matrix[i][j] = res;
            }
        }
        return newMatrix;
    }

    clone(): Matrix {
        const matrixArray: number[][] = [];
        for (let i = 0; i < this.m; i++) {
            matrixArray[i] = [];
            for (let j = 0; j < this.n; j++) {
                matrixArray[i][j] = this.matrix[i][j];
            }
        }
        return new Matrix(matrixArray);
    }

    get a(): number {
        return this.matrix[0][0];
    }
    get b(): number {
        return this.matrix[1][0];
    }
    get c(): number {
        return this.matrix[0][1];
    }
    get d(): number {
        return this.matrix[1][1];
    }
    get e(): number {
        return this.matrix[0][2];
    }
    get f(): number {
        return this.matrix[1][2];
    }

    get m(): number {
        return this.matrix.length;
    }

    get n(): number {
        return this.matrix[0].length;
    }
}
