import { AbstractControl } from '@angular/forms';

const MIN_LENGTH = 3;
const MAX_LENGTH = 20;

export const validateTagLength = (control: AbstractControl): { [key: string]: boolean } | null => {
    if ((control.value.length > 0 && control.value.length < MIN_LENGTH) || control.value.length > MAX_LENGTH) {
        return { lengthError: true };
    }

    return null;
};

export const validateTagContent = (control: AbstractControl): { [key: string]: boolean } | null => {
    if (/[~`!#$%\^&@*+=\-\[\]\\';,._/{}()|\\":<>\?]/g.test(control.value) || control.value.includes(' ')) {
        return { symbolError: true };
    }

    return null;
};

export const validateEmail = (control: AbstractControl): { [key: string]: boolean } | null => {
    if (
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            control.value,
        )
    ) {
        return { emailError: true };
    }
    return null;
};
