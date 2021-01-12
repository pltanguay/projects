import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { validateEmail, validateTagContent, validateTagLength } from './validation';

describe('Validation', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{}],
        });
    });

    it('#validateTagLength should return #true if the length of string is less than 3 characters', () => {
        // Arrange
        const control = new FormControl('input');
        control.setValue('Ts');

        // Act
        const validation = validateTagLength(control);

        // Assert
        expect(validation?.lengthError).toBe(true);
    });

    it('#validateTagLength should return null if the length of string is correct', () => {
        // Arrange
        const control = new FormControl('input');
        control.setValue('TsPaint');

        // Act
        const validation = validateTagLength(control);

        // Assert
        expect(validation).toBe(null);
    });

    it('#validateTagContent should return #true if the string contains a symbol', () => {
        // Arrange
        const control = new FormControl('input');
        control.setValue('-');

        // Act
        const validation = validateTagContent(control);

        // Assert
        expect(validation?.symbolError).toBe(true);
    });

    it('#validateTagContent should return null if the string does not contain any symbol', () => {
        // Arrange
        const control = new FormControl('input');
        control.setValue('TsPaint');

        // Act
        const validation = validateTagContent(control);

        // Assert
        expect(validation).toBe(null);
    });

    it('#validateEmail should return #true if the email is invalid', () => {
        // Arrange
        const control = new FormControl('input');
        control.setValue('TsPaint');

        // Act
        const validation = validateEmail(control);

        // Assert
        expect(validation?.emailError).toBe(true);
    });

    it('#validateEmail should return null if the email is valid', () => {
        // Arrange
        const control = new FormControl('input');
        control.setValue('test@gmail.com');

        // Act
        const validation = validateEmail(control);

        // Assert
        expect(validation).toBe(null);
    });
});
