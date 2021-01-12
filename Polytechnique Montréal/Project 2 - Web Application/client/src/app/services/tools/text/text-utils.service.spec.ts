import { TextField } from '@app/classes/text/text-field';
import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { Point } from '@app/classes/utils/point';
import { TextUtilsService } from './text-utils.service';
import { POLICE } from './text.service';

// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
// tslint:disable:no-any
// tslint:disable:max-file-line-count
describe('TextUtils', () => {
    let textUtils: TextUtilsService;
    let textField: TextField;

    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        textUtils = new TextUtilsService();
        textField = new TextField(new Point(0, 0), { size: 40, police: POLICE[0], isBold: false, isItalic: false, align: 'left', color: 'black' });

        textField.text[0] = 'Hello ';
        textField.text[1] = 'Worlddddd';
        textField.text[2] = '!!';
    });
    it('should be created', () => {
        expect(textUtils).toBeTruthy();
    });

    it('#changeLine should create a new line with the text after the position of the cursor (case MIDDLE)', () => {
        // Arrange
        textUtils.position = 2;
        textUtils.currentLine = 0;

        // Act
        textUtils.changeLine(textField);

        // Assert
        expect(textField.text[0]).toBe('He');
        expect(textField.text[1]).toBe('llo ');
        expect(textField.text[2]).toBe('Worlddddd');
        expect(textField.text[3]).toBe('!!');
    });

    it('#changeLine should create a newLine with the text after the position of the cursor (case END)', () => {
        // Arrange
        textUtils.position = 6;
        textUtils.currentLine = 0;

        // Act
        textUtils.changeLine(textField);

        // Assert
        expect(textField.text[0]).toBe('Hello ');
        expect(textField.text[1]).toBe('');
        expect(textField.text[2]).toBe('Worlddddd');
        expect(textField.text[3]).toBe('!!');
    });

    it('#moveLeft should change the #position', () => {
        // Arrange
        textUtils.position = 2;

        // Act
        textUtils.moveLeft(textField);

        // Assert
        expect(textUtils.position).toBe(1);
    });
    it('#moveLeft should change line if we are at the beggining of the line', () => {
        // Arrange
        textUtils.position = 0;
        textUtils.currentLine = 1;

        // Act
        textUtils.moveLeft(textField);

        // Assert
        expect(textUtils.position).toBe(6);
        expect(textUtils.currentLine).toBe(0);
    });

    it('#moveLeft should do nothing if we are at the beggining of the line and on the first line', () => {
        // Arrange
        textUtils.position = 0;
        textUtils.currentLine = 0;

        // Act
        textUtils.moveLeft(textField);

        // Assert
        expect(textUtils.position).toBe(0);
        expect(textUtils.currentLine).toBe(0);
    });

    it('#moveRight should change the #position', () => {
        // Arrange
        textUtils.position = 2;

        // Act
        textUtils.moveRight(textField);

        // Assert
        expect(textUtils.position).toBe(3);
    });
    it('#moveRight should change line if we are at the end of the line', () => {
        // Arrange
        textUtils.position = 6;
        textUtils.currentLine = 0;

        // Act
        textUtils.moveRight(textField);

        // Assert
        expect(textUtils.position).toBe(0);
        expect(textUtils.currentLine).toBe(1);
    });

    it('#moveRight should do nothing if we are at the end of the line and on the last line', () => {
        // Arrange
        textUtils.position = 2;
        textUtils.currentLine = 2;

        // Act
        textUtils.moveRight(textField);

        // Assert
        expect(textUtils.position).toBe(2);
        expect(textUtils.currentLine).toBe(2);
    });

    it('#moveUp should change line if we are not athe first Line', () => {
        // Arrange
        textUtils.position = 2;
        textUtils.currentLine = 2;

        // Act
        textUtils.moveUp(textField);

        // Assert
        expect(textUtils.position).toBe(2);
        expect(textUtils.currentLine).toBe(1);
    });

    it('#moveUp should do nothing if we are at the first Line', () => {
        // Arrange
        textUtils.position = 2;
        textUtils.currentLine = 0;

        // Act
        textUtils.moveUp(textField);

        // Assert
        expect(textUtils.position).toBe(2);
        expect(textUtils.currentLine).toBe(0);
    });

    it('#moveUp should place the indicator at the end of the line if it is smaller than the currentLine', () => {
        // Arrange
        textUtils.position = 8;
        textUtils.currentLine = 1;

        // Act
        textUtils.moveUp(textField);

        // Assert
        expect(textUtils.position).toBe(6);
        expect(textUtils.currentLine).toBe(0);
    });

    it('#moveDown should change line if we are not athe last Line', () => {
        // Arrange
        textUtils.position = 1;
        textUtils.currentLine = 1;

        // Act
        textUtils.moveDown(textField);

        // Assert
        expect(textUtils.position).toBe(1);
        expect(textUtils.currentLine).toBe(2);
    });

    it('#moveDown should do nothing if we are at the last Line', () => {
        // Arrange
        textUtils.position = 2;
        textUtils.currentLine = 2;

        // Act
        textUtils.moveDown(textField);

        // Assert
        expect(textUtils.position).toBe(2);
        expect(textUtils.currentLine).toBe(2);
    });

    it('#moveDown should place the indicator at the end of the line if it is smaller than the currentLine', () => {
        // Arrange
        textUtils.position = 8;
        textUtils.currentLine = 1;

        // Act
        textUtils.moveDown(textField);

        // Assert
        expect(textUtils.position).toBe(2);
        expect(textUtils.currentLine).toBe(2);
    });

    it('#addCharacter should insert a new symbole at the correct #position', () => {
        // Arrange
        textUtils.position = 2;
        textUtils.currentLine = 0;
        const char = 'A';

        // Act
        textUtils.addCharacter(textField, char);

        // Assert
        expect(textField.text[0]).toBe('HeAllo ');
    });

    it('#deletePreviousCharacter should do nothing if we are at the beginnig of first line', () => {
        // Arrange
        textUtils.position = 0;
        textUtils.currentLine = 0;

        // Act
        textUtils.deletePreviousCharacter(textField);

        // Assert
        expect(textField.text[0]).toBe('Hello ');
    });

    it('#deletePreviousCharacter should join the line with the line before if we are at the beginning of the line', () => {
        // Arrange
        textUtils.position = 0;
        textUtils.currentLine = 1;

        // Act
        textUtils.deletePreviousCharacter(textField);

        // Assert
        expect(textField.text[0]).toBe('Hello Worlddddd');
        expect(textField.text[1]).toBe('!!');
    });

    it('#deletePreviousCharacter should delete the symbole before the indicator', () => {
        // Arrange
        textUtils.position = 1;
        textUtils.currentLine = 0;

        // Act
        textUtils.deletePreviousCharacter(textField);

        // Assert
        expect(textField.text[0]).toBe('ello ');
    });

    it('#deleteNextCharacter should do nothing if we are at the end of last line', () => {
        // Arrange
        textUtils.position = 2;
        textUtils.currentLine = 2;

        // Act
        textUtils.deleteNextCharacter(textField);

        // Assert
        expect(textField.text[2]).toBe('!!');
    });

    it('#deleteNextCharacter should join the line with the line before if we are at the end of the line', () => {
        // Arrange
        textUtils.position = 6;
        textUtils.currentLine = 0;

        // Act
        textUtils.deleteNextCharacter(textField);

        // Assert
        expect(textField.text[0]).toBe('Hello Worlddddd');
        expect(textField.text[1]).toBe('!!');
    });

    it('#deleteNextCharacter should delete the symbole after the indicator', () => {
        // Arrange
        textUtils.position = 1;
        textUtils.currentLine = 0;

        // Act
        textUtils.deleteNextCharacter(textField);

        // Assert
        expect(textField.text[0]).toBe('Hllo ');
    });

    it('#initializeData should reset the #position and #currentline', () => {
        // Arrange
        textUtils.position = 3;
        textUtils.currentLine = 1;

        // Act
        textUtils.initializeData();

        // Assert
        expect(textUtils.position).toBe(0);
        expect(textUtils.currentLine).toBe(0);
    });

    it('#getPositionIndicator should calculate the position of the Indicator according to the align (left case)', () => {
        // Arrange
        textField.attribute.align = 'left';
        textUtils.position = 1;
        textUtils.currentLine = 1;

        // Act
        const result = textUtils.getPositionIndicator(ctxStub, textField);

        // Assert
        expect(result.x).toBeGreaterThan(textField.startPoint.x);
        expect(result.x).toBeLessThan(textField.width);
        expect(result.y).toBe(40);
    });

    it('#getPositionIndicator should calculate the position of the Indicator according to the align (right case)', () => {
        // Arrange
        textField.attribute.align = 'right';
        textUtils.position = 1;
        textUtils.currentLine = 0;

        // Act
        const result = textUtils.getPositionIndicator(ctxStub, textField);

        // Assert
        expect(result.x).toBeGreaterThan(textField.startPoint.x);
        expect(result.x).toBeLessThan(textField.width);
        expect(result.y).toBe(0);
    });

    it('#getPositionIndicator should calculate the position of the Indicator according to the align (center case)', () => {
        // Arrange
        textField.attribute.align = 'center';
        textUtils.position = 1;
        textUtils.currentLine = 2;

        // Act
        const result = textUtils.getPositionIndicator(ctxStub, textField);

        // Assert
        expect(result.x).toBeGreaterThan(textField.startPoint.x);
        expect(result.x).toBeLessThan(textField.width);
        expect(result.y).toBe(80);
    });

    it('#setNewArray should calculate the position of the Indicator according to the align (center case)', () => {
        // Arrange
        textUtils.currentLine = 1;

        // Act
        textUtils['setNewArray'](textField);

        // Assert
        expect(textField.text[0]).toBe('Hello ');
        expect(textField.text[1]).toBe('Worlddddd!!');
    });
});
