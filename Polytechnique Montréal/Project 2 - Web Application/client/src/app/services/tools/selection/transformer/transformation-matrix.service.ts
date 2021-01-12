import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { Matrix } from '@app/classes/matrix/matrix';

export const HALF_TURN = 180;
@Injectable({
    providedIn: 'root',
})
export class TransformationMatrixService {
    transformationMatrix: Matrix;

    constructor() {
        this.transformationMatrix = new Matrix();
    }

    init(center: Vec2): void {
        this.transformationMatrix = new Matrix([
            [1, 0, center.x],
            [0, 1, center.y],
            [0, 0, 1],
        ]);
    }

    setMatrix(matrix: Matrix): void {
        this.transformationMatrix = matrix;
    }

    translate(tx: number, ty: number): void {
        const transM = new Matrix([
            [1, 0, tx],
            [0, 1, ty],
            [0, 0, 1],
        ]);

        this.transformationMatrix = transM.multiply(this.transformationMatrix);
    }

    scale(sx: number, sy: number, tx: number, ty: number): void {
        const scaleM = new Matrix([
            [sx, 0, 0],
            [0, sy, 0],
            [0, 0, 1],
        ]);

        const trans1 = new Matrix([
            [1, 0, tx],
            [0, 1, ty],
            [0, 0, 1],
        ]);

        const trans2 = new Matrix([
            [1, 0, -tx],
            [0, 1, -ty],
            [0, 0, 1],
        ]);

        const result = trans1.multiply(scaleM).multiply(trans2);

        this.transformationMatrix = result.multiply(this.transformationMatrix);
    }

    rotate(angle: number, tx: number, ty: number): void {
        angle = (angle * Math.PI) / HALF_TURN;
        const rotationM = new Matrix([
            [Math.cos(angle), -Math.sin(angle), 0],
            [Math.sin(angle), Math.cos(angle), 0],
            [0, 0, 1],
        ]);

        const trans1 = new Matrix([
            [1, 0, tx],
            [0, 1, ty],
            [0, 0, 1],
        ]);

        const trans2 = new Matrix([
            [1, 0, -tx],
            [0, 1, -ty],
            [0, 0, 1],
        ]);
        const result = trans1.multiply(rotationM).multiply(trans2);
        this.transformationMatrix = result.multiply(this.transformationMatrix);
    }

    get matrix(): Matrix {
        return this.transformationMatrix;
    }

    reset(): void {
        this.transformationMatrix = new Matrix();
    }
}
