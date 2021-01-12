import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/interfaces/vec2';
import { Matrix } from '@app/classes/matrix/matrix';
import { TransformationMatrixService } from './transformation-matrix.service';

describe('TransformationMatrixService', () => {
    let service: TransformationMatrixService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TransformationMatrixService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('init should initialize matrix', () => {
        // Arrange
        const initialCenter: Vec2 = { x: 2, y: 4 };

        // Act
        service.init(initialCenter);

        // Assert
        expect(service.matrix.e).toEqual(initialCenter.x);
        expect(service.matrix.f).toEqual(initialCenter.y);
    });

    it('setMatrix should set matrix', () => {
        // Arrange
        const m = new Matrix();

        // Act
        service.setMatrix(m);

        // Assert
        expect(service.matrix).toEqual(m);
    });

    it('translate should translate matrix', () => {
        // Arrange
        const tx = 10;
        const ty = 2.0;
        service.reset();

        // Act
        service.translate(tx, ty);

        // Assert
        expect(service.matrix.e).toEqual(tx);
        expect(service.matrix.f).toEqual(ty);
    });

    it('scale should scale matrix', () => {
        // Arrange
        const sx = 1.5;
        const sy = 2.0;

        // Act
        service.scale(sx, sy, 0, 0);

        // Assert
        expect(service.matrix.a).toEqual(sx);
        expect(service.matrix.d).toEqual(sy);
    });

    it('rotate should rotate matrix', () => {
        // Arrange
        const angle = 90;

        // Act
        service.rotate(angle, 0, 0);

        // Assert
        expect(service.matrix.a).toBeCloseTo(0);
        expect(service.matrix.b).toBeCloseTo(1);
        expect(service.matrix.c).toBeCloseTo(0 - 1);
        expect(service.matrix.d).toBeCloseTo(0);
    });
});
