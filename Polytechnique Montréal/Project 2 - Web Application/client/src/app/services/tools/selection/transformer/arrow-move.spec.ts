import { EllipseSelection } from '@app/classes/selection-shape/selection/ellipse-selection/ellipse-selection';
import { Keyboard } from '@app/declarations/keyboard.enum';
import { SnapToGridService } from '@app/services/snap-to-grid/snap-to-grid.service';
import { BoundingBoxService } from '@app/services/tools/selection/bounding-box/bounding-box.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { ArrowMove } from './arrow-move';
import { TransformationMatrixService } from './transformation-matrix.service';

// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:no-empty
// tslint:disable:no-magic-numbers
describe('ArrowMove', () => {
    let selectionService: jasmine.SpyObj<SelectionService>;
    let boudingBox: jasmine.SpyObj<BoundingBoxService>;
    let transformationMatrixService: jasmine.SpyObj<TransformationMatrixService>;
    let snapGrid: jasmine.SpyObj<SnapToGridService>;
    let move: ArrowMove;
    let event: KeyboardEvent;

    beforeEach(() => {
        selectionService = jasmine.createSpyObj('SelectionService', ['']);
        snapGrid = jasmine.createSpyObj('SnapToGridService', ['getNearestPointTranslation', 'getArrowTranslationPoint']);
        snapGrid.active = false;

        transformationMatrixService = jasmine.createSpyObj('TransformationMatrixService', ['translate']);

        boudingBox = jasmine.createSpyObj('BoundingBoxService', ['applyTranslation']);
        boudingBox.left = boudingBox.top = 0;
        boudingBox.dimension = { width: 100, height: 100 };
        move = new ArrowMove(selectionService, transformationMatrixService, boudingBox, snapGrid);

        event = { key: Keyboard.LEFT_ARROW, preventDefault: () => {}, timeStamp: 1000 } as KeyboardEvent;
        (move['selection'].currentSelection as EllipseSelection) = new EllipseSelection({} as HTMLCanvasElement, { x: 0, y: 0 }, { x: 0, y: 0 });
    });

    it('should be created', () => {
        expect(move).toBeTruthy();
    });

    it('#keyDown should do nothing if no arrows are pressed', () => {
        // Arrange
        event = { key: Keyboard.A, preventDefault: () => {}, timeStamp: 100 } as KeyboardEvent;
        spyOn(event, 'preventDefault');

        // Act
        move.keyDown(event);

        // Assert
        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('#keyDown should translate on first arrow key press', () => {
        // Arrange
        spyOn<any>(move, 'translate');
        spyOn<any>(move['pressedArrowKeys'], 'add');
        move['pressedArrowKeys'].clear();

        // Act
        move.keyDown(event);

        // Assert
        expect(move['translate']).toHaveBeenCalled();
        expect(move['pressedArrowKeys'].add).toHaveBeenCalled();
    });

    it('#keyDown should keep translating every 100ms if continuousMove is true after 500ms', () => {
        // Arrange
        spyOn<any>(move, 'translate');
        event = { key: Keyboard.LEFT_ARROW, preventDefault: () => {}, timeStamp: 1000 } as KeyboardEvent;
        move['pressedArrowKeys'].add(Keyboard.LEFT_ARROW);

        move['continuousMove'] = true;
        move['checkDelay'] = false;
        move['time'] = 10; // timestamp - time = 1990 > 100

        // Act
        move.keyDown(event);

        // Assert
        expect(move['translate']).toHaveBeenCalled();
        expect(move['checkDelay']).toBeTrue();
    });

    it('#keyDown should not translate if #continuousMove is true but delay is less than 100ms', () => {
        // Arrange
        spyOn<any>(move, 'translate');
        event = { key: Keyboard.LEFT_ARROW, preventDefault: () => {}, timeStamp: 0 } as KeyboardEvent;
        move['pressedArrowKeys'].add(Keyboard.LEFT_ARROW);
        move['continuousMove'] = true;
        move['checkDelay'] = true;
        move['time'] = 0; // timestamp - time = 10 < 100

        // Act
        move.keyDown(event);

        // Assert
        expect(move['translate']).not.toHaveBeenCalled();
        expect(move['checkDelay']).toBeFalse();
    });

    it('#keyUp should delete key pressed from set', () => {
        // Arrange
        spyOn<any>(move.pressedArrowKeys, 'delete');
        const resetPos = { x: 0, y: 0 };

        // Act
        move.keyUp(event);

        // Assert
        expect(move.pressedArrowKeys.delete).toHaveBeenCalled();
        expect(move['arrowTranslation']).toEqual(resetPos);
    });

    it('#translate should call #translateSelectionPixel for every key in #pressedArrowKeys set', () => {
        // Arrange
        spyOn<any>(move, 'translateSelectionPixel');
        move['pressedArrowKeys'].add(Keyboard.LEFT_ARROW);
        move['pressedArrowKeys'].add(Keyboard.RIGHT_ARROW);

        // Act
        move['translate']();

        // Assert
        expect(move['translateSelectionPixel']).toHaveBeenCalledTimes(2);
    });

    it('#translate should call snap to grid service if snap to grid is active', () => {
        // Arrange
        spyOn<any>(move, 'translateSelectionPixel');
        move['snapToGridService'].active = true;
        move['pressedArrowKeys'].add(Keyboard.LEFT_ARROW);
        move['pressedArrowKeys'].add(Keyboard.RIGHT_ARROW);

        // Act
        move['translate']();

        // Assert
        expect(move['snapToGridService'].getNearestPointTranslation).toHaveBeenCalled();
        expect(move['snapToGridService'].getArrowTranslationPoint).toHaveBeenCalled();
    });

    it('#translate should not call snap to grid service if snap to grid is not active', () => {
        // Arrange
        spyOn<any>(move, 'translateSelectionPixel');
        move['snapToGridService'].active = false;
        move['pressedArrowKeys'].add(Keyboard.LEFT_ARROW);
        move['pressedArrowKeys'].add(Keyboard.RIGHT_ARROW);

        // Act
        move['translate']();

        // Assert
        expect(move['snapToGridService'].getNearestPointTranslation).not.toHaveBeenCalled();
        expect(move['snapToGridService'].getArrowTranslationPoint).not.toHaveBeenCalled();
    });

    it('#translateSelectionPixel should call #translateBoundingBox and translate matrix', () => {
        // Arrange
        const movePixel = { x: 3, y: 3 };
        spyOn<any>(move, 'translateBoundingBox');

        // Act
        move['translateSelectionPixel'](movePixel);

        // Assert
        expect(move['translateBoundingBox']).toHaveBeenCalled();
        expect(move['transformationMatrix'].translate).toHaveBeenCalled();
    });

    it('#translateBoundingBox should call bounding box apply translation', () => {
        // Arrange
        const movePixel = { x: 3, y: 3 };

        // Act
        move['translateBoundingBox'](movePixel);

        // Assert
        expect(move['boundingBox'].applyTranslation).toHaveBeenCalled();
    });

    it('#arrowPressed should return true if arrow key pressed', () => {
        // Arrange

        // Act
        const ret = move.arrowPressed(Keyboard.LEFT_ARROW);

        // Assert
        expect(ret).toBeTrue();
    });

    it('#arrowPressed should return false if key pressed is not an arrow', () => {
        // Arrange

        // Act
        const ret = move.arrowPressed(Keyboard.A);

        // Assert
        expect(ret).toBeFalse();
    });
});
