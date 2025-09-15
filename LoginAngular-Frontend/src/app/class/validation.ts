import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export function numberOnlyValidator() : ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        return /^[0-9]*$/.test(value) ? null : { numberOnly: true}
    }
}