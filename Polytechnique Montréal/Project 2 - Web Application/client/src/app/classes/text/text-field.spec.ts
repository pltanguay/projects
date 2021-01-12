import { canvasTestHelper } from '@app/classes/utils/canvas-test-helper';
import { Point } from '@app/classes/utils/point';
import { POLICE } from '@app/services/tools/text/text.service';
import { TextField } from './text-field';

// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
// tslint:disable:no-any
describe('TextField', () => {
    let textField: TextField;

    let ctxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        spyOn(ctxStub, 'fillText');

        textField = new TextField(new Point(0, 0), { size: 40, police: POLICE[0], isBold: false, isItalic: false, align: 'left', color: 'black' });

        textField.text[0] = 'Hello ';
        textField.text[1] = 'Worlddddd';
        textField.text[2] = '!!';
    });
    it('should be created', () => {
        expect(textField).toBeTruthy();
    });

    it('#processDrawing should draw every line on canvas', () => {
        // Arrange
        const spySetContext = spyOn<any>(textField, 'setContext');
        const spySetProperty = spyOn<any>(textField, 'setProperty');

        // Act
        textField.processDrawing(ctxStub);

        // Assert
        expect(spySetContext).toHaveBeenCalled();
        expect(spySetProperty).toHaveBeenCalled();
        expect(ctxStub.fillText).toHaveBeenCalledWith('!!', 0 + textField.alignFactor, 80 + textField.alignFactor);
    });

    it('#fontConstructor should create a string to set the font with #bold if #isBold is true', () => {
        // Arrange
        textField.attribute.isBold = true;
        textField.attribute.isItalic = false;
        const expectedResult = 'bold 40px Arial';

        // Act
        const result = textField['fontConstructor']();

        // Assert
        expect(result).toBe(expectedResult);
    });

    it('#fontConstructor should create a string to set the font with #italic if #isItalic is true', () => {
        // Arrange
        textField.attribute.isBold = false;
        textField.attribute.isItalic = true;
        const expectedResult = 'italic 40px Arial';

        // Act
        const result = textField['fontConstructor']();

        // Assert
        expect(result).toBe(expectedResult);
    });

    it('#getHeight should return the height of all the line', () => {
        // Arrange
        const expectedHeight = 120;

        // Act
        const height = textField.getHeight();

        // Assert
        expect(height).toBe(expectedHeight);
    });

    it('#setContext should set the Canvas attribute', () => {
        // Arrange
        const spyFontConstructor = spyOn<any>(textField, 'fontConstructor');

        // Act
        textField['setContext'](ctxStub);

        // Assert
        expect(spyFontConstructor).toHaveBeenCalled();
    });

    it('#getWidth should return the width of the longest line', () => {
        // Arrange
        const spySetContext = spyOn<any>(textField, 'setContext');

        // Act
        textField.getWidth(ctxStub);

        // Assert
        expect(spySetContext).toHaveBeenCalled();

        expect(textField.width).not.toBe(0);
    });

    it('#setProperty should set the alignFactor and the width (case LEFT)', () => {
        // Arrange

        // Act
        textField.setProperty(ctxStub);

        // Assert
        expect(textField.alignFactor).toBe(0);
    });

    it('#setProperty should set the alignFactor and the width (case CENTER)', () => {
        // Arrange
        textField.attribute.align = 'center';

        // Act
        textField.setProperty(ctxStub);

        // Assert
        expect(textField.alignFactor).toBe(textField.width / 2);
    });

    it('#setProperty should set the alignFactor and the width (case RIGHT)', () => {
        // Arrange
        textField.attribute.align = 'right';

        // Act
        textField.setProperty(ctxStub);

        // Assert
        expect(textField.alignFactor).toBe(textField.width);
    });
});
