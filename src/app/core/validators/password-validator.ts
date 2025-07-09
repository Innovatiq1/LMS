// src/app/core/validators/password-validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(field: any): ValidatorFn {
  const min = field.minLength || 8;
  const max = field.maxLength || 20;
  const strength = field.strength || 'weak';

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';

    if (value.length < min || value.length > max) {
      return { passwordLength: true };
    }

    if (strength  === 'strong') {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
      if (!regex.test(value)) {
        return { strongPassword: true };
      }
    }

    return null;
  };
}
