import type { ValidationRule, ValidationResult } from '../contexts/FormContext';

// Basic validations
export const required = (message = 'This field is required'): ValidationRule =>
  (value: any): ValidationResult => !value && value !== 0 ? message : undefined;

export const email = (message = 'Invalid email address'): ValidationRule =>
  (value: string): ValidationResult => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ? message : undefined;

export const url = (message = 'Invalid URL'): ValidationRule =>
  (value: string): ValidationResult => {
    if (!value) return undefined;
    try {
      new URL(value);
      return undefined;
    } catch {
      return message;
    }
  };

// String validations
export const minLength = (min: number, message = `Must be at least ${min} characters`): ValidationRule =>
  (value: string): ValidationResult => value && value.length < min ? message : undefined;

export const maxLength = (max: number, message = `Must be no more than ${max} characters`): ValidationRule =>
  (value: string): ValidationResult => value && value.length > max ? message : undefined;

export const pattern = (regex: RegExp, message = 'Invalid format'): ValidationRule =>
  (value: string): ValidationResult => value && !regex.test(value) ? message : undefined;

// Number validations
export const min = (min: number, message = `Must be at least ${min}`): ValidationRule =>
  (value: number): ValidationResult => value && value < min ? message : undefined;

export const max = (max: number, message = `Must be no more than ${max}`): ValidationRule =>
  (value: number): ValidationResult => value && value > max ? message : undefined;

export const integer = (message = 'Must be a whole number'): ValidationRule =>
  (value: number): ValidationResult => value && !Number.isInteger(value) ? message : undefined;

export const decimal = (places: number, message = `Must have ${places} decimal places`): ValidationRule =>
  (value: number): ValidationResult => {
    if (!value) return undefined;
    const [, decimals] = value.toString().split('.');
    return decimals?.length !== places ? message : undefined;
  };

// Array validations
export const minItems = (min: number, message = `Must have at least ${min} items`): ValidationRule =>
  (value: any[]): ValidationResult => value && value.length < min ? message : undefined;

export const maxItems = (max: number, message = `Must have no more than ${max} items`): ValidationRule =>
  (value: any[]): ValidationResult => value && value.length > max ? message : undefined;

export const uniqueItems = (message = 'Items must be unique'): ValidationRule =>
  (value: any[]): ValidationResult => {
    if (!value) return undefined;
    const uniqueSet = new Set(value.map(item => JSON.stringify(item)));
    return uniqueSet.size !== value.length ? message : undefined;
  };

// Custom validations
export const matches = (field: string, message = 'Fields must match'): ValidationRule =>
  (value: any, formValues: any): ValidationResult => value !== formValues[field] ? message : undefined;

export const when = (
  condition: (value: any, formValues: any) => boolean,
  validations: ValidationRule[]
): ValidationRule =>
  async (value: any, formValues: any): Promise<ValidationResult> => {
    if (!condition(value, formValues)) return undefined;
    for (const validation of validations) {
      const error = await validation(value, formValues);
      if (error) return error;
    }
    return undefined;
  };

export const compose = (validations: ValidationRule[]): ValidationRule =>
  async (value: any, formValues: any): Promise<ValidationResult> => {
    for (const validation of validations) {
      const error = await validation(value, formValues);
      if (error) return error;
    }
    return undefined;
  };

export const asyncValidation = (
  validator: (value: any) => Promise<boolean>,
  message = 'Invalid value'
): ValidationRule => {
  let lastValue: any = undefined;
  let lastResult: ValidationResult = undefined;
  let validating = false;

  return async (value: any): Promise<ValidationResult> => {
    if (value === lastValue && !validating) {
      return lastResult;
    }

    lastValue = value;
    validating = true;

    try {
      const result = await validator(value);
      lastResult = result ? undefined : message;
      return lastResult;
    } catch (error) {
      return message;
    } finally {
      validating = false;
    }
  };
}; 