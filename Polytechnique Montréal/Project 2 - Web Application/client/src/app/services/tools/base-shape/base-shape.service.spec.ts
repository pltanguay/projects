import { Vec2 } from '@app/classes/interfaces/vec2';
import { Point } from '@app/classes/utils/point';
import { MouseButton } from '@app/declarations/mouse.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MathUtilsService } from '@app/services/mathematic/math-utils.service';
import { BaseShapeService } from './base-shape.service';

class BaseShapeServiceTest extends BaseShapeService {
    protected configureShape(): void {
        return;
    }
    protected newShape(): void {
        return;
    }
    protected transformShapeAlgorithm(startPoint: Point, oppositePoint: Point): Point {
        return { x: 0, y: 0 };
    }
}

// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:max-file-line-count

describe('BaseShapeService', () => {
    let service: BaseShapeServiceTest;
    let mouseEvent: PointerEvent;
    let keyevent: KeyboardEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let mathService: jasmine.SpyObj<MathUtilsService>;

    beforeEach(() => {
        mathService = jasmine.createSpyObj('MathUtilsService()', ['transformRectangleToSquare']);
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['cleanPreview', 'drawPreview', 'drawBase', 'pushData']);
        service = new BaseShapeServiceTest(drawServiceSpy, mathService);

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as PointerEvent;
        keyevent = {
            key: 'Shift',
        } as KeyboardEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' #startDrawing should  #newShape', () => {
        // Arrange
        spyOn<any>(service, 'newShape');

        // Act
        service.startDrawing();

        // Assert
        expect(service['newShape']).toHaveBeenCalled();
    });

    it(' #mouseDown should set #mouseDownCoord to correct position on left click and create new shape', () => {
        // Arrange
        const expectedResult: Vec2 = { x: 25, y: 25 };
        spyOn<any>(service, 'newShape');

        // Act
        service.onMouseDown(mouseEvent);

        // Assert
        expect(service['newShape']).toHaveBeenCalled();
        expect(service['mousePosition']).toEqual(expectedResult);
    });

    it(' #mouseDown should set #mouseDown property to true on left click', () => {
        // Arrange

        // Act
        service.onMouseDown(mouseEvent);

        // Assert
        expect(service['mouseDown']).toEqual(true);
    });

    it(' #mouseDown should do nothing on right click', () => {
        // Arrange
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as PointerEvent;
        service['mouseDown'] = true;
        spyOn<any>(service, 'newShape');

        // Act
        service.onMouseDown(mouseEventRClick);

        // Assert
        expect(service['mouseDown']).toEqual(true);
        expect(service['newShape']).not.toHaveBeenCalled();
    });

    it(' #onMouseUp should not nothing mouse up button was a right click', () => {
        // Arrange
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as PointerEvent;
        spyOn<any>(service, 'changeOppositePoint');
        spyOn<any>(service, 'stopDrawing');

        // Act
        service.onMouseUp(mouseEventRClick);

        // Assert
        expect(service['stopDrawing']).not.toHaveBeenCalled();
        expect(service['changeOppositePoint']).not.toHaveBeenCalled();
    });

    it(' #onMouseUp should call #stopDrawing if mouse was already down (inside)', () => {
        // Arrange
        service['mousePosition'] = { x: 0, y: 0 };
        service['mouseDown'] = true;
        service['mouseOut'] = false;
        spyOn<any>(service, 'stopDrawing');

        // Act
        service.onMouseUp(mouseEvent);

        // Assert
        expect(service['stopDrawing']).toHaveBeenCalled();
    });

    it(' #onMouseUp should not change position of mouse if it was already down (outside)', () => {
        // Arrange
        const expectedResult = { x: 25, y: 25 };
        service['mousePosition'] = expectedResult;
        service['mouseDown'] = true;

        // Act
        service.onMouseUp(mouseEvent);

        // Assert
        expect(service['mousePosition']).toEqual(expectedResult);
    });

    it(' #onMouseUp should not call #stopDrawing if mouse was not already down', () => {
        // Arrange
        service['mouseDown'] = false;
        service['mousePosition'] = { x: 0, y: 0 };
        spyOn<any>(service, 'stopDrawing');

        // Act
        service.onMouseUp(mouseEvent);

        // Assert
        expect(service['stopDrawing']).not.toHaveBeenCalled();
    });

    it(' #onMouseMove should call #updateView if mouse was already down', () => {
        // Arrange
        service['mousePosition'] = { x: 0, y: 0 };
        service['mouseDown'] = true;
        spyOn<any>(service, 'updateView');

        // Act
        service.onMouseMove(mouseEvent);

        // Assert
        expect(service['updateView']).toHaveBeenCalled();
    });

    it(' #onMouseMove should not call #updateView if mouse was not already down', () => {
        // Arrange
        service['mousePosition'] = { x: 0, y: 0 };
        service['mouseDown'] = false;
        spyOn<any>(service, 'updateView');

        // Act
        service.onMouseMove(mouseEvent);

        // Assert
        expect(service['updateView']).not.toHaveBeenCalled();
    });

    it(' #onMouseEnter should set #mouseOut property to false ', () => {
        // Arrange

        // Act
        service.onMouseEnter(mouseEvent);

        // Assert
        expect(service['mouseOut']).toEqual(false);
    });

    it(' #onKeyDown with escape key should clean preview and set mousedown to false', () => {
        // Arrange
        const keyEvent = {
            key: 'Escape',
        } as KeyboardEvent;
        service['mouseDown'] = true;
        spyOn<any>(service, 'updateView');
        spyOn<any>(service, 'transformShape');

        // Act
        service.onKeyDown(keyEvent);

        // Assert
        expect(drawServiceSpy.cleanPreview).toHaveBeenCalled();
        expect(service['mouseDown']).toBeFalse();
        expect(service['transformShape']).not.toHaveBeenCalled();
        expect(service['updateView']).not.toHaveBeenCalled();
    });

    it(' #onKeyDown with shift key should not #transformShape when mouse is not down', () => {
        // Arrange
        service['mouseDown'] = false;
        spyOn<any>(service, 'transformShape');

        // Act
        service.onKeyDown(keyevent);

        // Assert
        expect(service['transformShape']).not.toHaveBeenCalled();
    });

    it(' #onKeyDown with shift key should not #transformShape when mouse is down', () => {
        // Arrange
        service['mouseDown'] = true;
        spyOn<any>(service, 'transformShape');

        // Act
        service.onKeyDown(keyevent);

        // Assert
        expect(service['transformShape']).toHaveBeenCalled();
    });

    it(' #onKeyDown with key different than shift should not #transformShape', () => {
        // Arrange
        service['mouseDown'] = true;
        keyevent = {
            key: 'Control',
        } as KeyboardEvent;
        spyOn<any>(service, 'transformShape');

        // Act
        service.onKeyDown(keyevent);

        // Assert
        expect(service['transformShape']).not.toHaveBeenCalled();
    });

    it(' #onKeyUp with mouse not down should not #restoreShape', () => {
        // Arrange
        service['mouseDown'] = false;
        spyOn<any>(service, 'restoreShape');

        // Act
        service.onKeyUp(keyevent);

        // Assert
        expect(service['restoreShape']).not.toHaveBeenCalled();
    });

    it('# onKeyUp with shift key should  #restoreShape', () => {
        // Arrange
        service['mouseDown'] = true;
        spyOn<any>(service, 'restoreShape');

        // Act
        service.onKeyUp(keyevent);

        // Assert
        expect(service['restoreShape']).toHaveBeenCalled();
    });

    it(' #onKeyUp with key different than shift should not #restoreShape', () => {
        // Arrange
        service['mouseDown'] = true;
        keyevent = {
            key: 'Control',
        } as KeyboardEvent;
        spyOn<any>(service, 'restoreShape');

        // Act
        service.onKeyUp(keyevent);

        // Assert
        expect(service['restoreShape']).not.toHaveBeenCalled();
    });

    it(' #changeOppositePoint should set oppositePoint to mousePosition when shape is not transformed', () => {
        // Arrange
        service['oppositePoint'] = { x: 1, y: 1 };
        service['mousePosition'] = { x: 0, y: 0 };
        service['isTransformed'] = false;

        // Act
        service['changeOppositePoint']();

        // Assert
        expect(service['oppositePoint']).toBe(service['mousePosition']);
    });

    it(' #changeOppositePoint should transformation algorithm when the form is transformed', () => {
        // Arrange
        service['isTransformed'] = true;
        spyOn<any>(service, 'transformShapeAlgorithm');

        // Act
        service['changeOppositePoint']();

        // Assert
        expect(service['oppositePoint']).toBe(service['mousePosition']);
        expect(service['transformShapeAlgorithm']).toHaveBeenCalled();
    });

    it(' #transformShape should set isTransformed true and call transformation algorithm', () => {
        // Arrange
        spyOn<any>(service, 'transformShapeAlgorithm');
        service['isTransformed'] = false;

        // Act
        service['transformShape']();

        // Assert
        expect(service['transformShapeAlgorithm']).toHaveBeenCalled();
        expect(service['isTransformed']).toBe(true);
    });

    it(' #restoreShape should set isTransformed false and restore the shape dimensions', () => {
        // Arrange
        service['oppositePoint'] = { x: 1, y: 1 };
        service['mousePosition'] = { x: 0, y: 0 };
        service['isTransformed'] = true;

        // Act
        service['restoreShape']();

        // Assert
        expect(service['oppositePoint']).toBe(service['mousePosition']);
        expect(service['isTransformed']).toBe(false);
    });
});
