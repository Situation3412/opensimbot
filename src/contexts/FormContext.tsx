import React, { createContext, useContext, useState, useCallback } from 'react';

export type ValidationResult = string | undefined;
export type ValidationRule = (value: any, formValues?: any) => ValidationResult | Promise<ValidationResult>;

export interface ValidationRules {
  required?: string | boolean;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: ValidationRule;
}

export interface FieldState {
  value: any;
  error?: string;
  isDirty: boolean;
  isTouched: boolean;
}

export interface FormError {
  message?: string;
}

export interface FormState {
  isSubmitting: boolean;
  isDirty: boolean;
  errors: Record<string, FormError>;
}

export interface FormContextType<T = any> {
  values: Record<string, any>;
  errors: Record<string, FormError>;
  touched: Record<string, boolean>;
  registerField: (name: string, validations?: ValidationRules) => void;
  unregisterField: (name: string) => void;
  setFieldValue: (name: string, value: any) => void;
  setFieldTouched: (name: string, touched?: boolean) => void;
  validateField: (name: string) => Promise<void>;
  register: (name: string) => {
    value: any;
    onChange: (value: any) => void;
  };
  handleSubmit: (onSubmit: (data: T) => Promise<void>) => (e: React.FormEvent) => void;
  formState: FormState;
  control: {
    fields: Record<string, FieldState>;
    setFields: React.Dispatch<React.SetStateAction<Record<string, FieldState>>>;
  };
  getValues: () => T;
  setValue: (name: string, value: any) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

interface FormProviderProps {
  children: React.ReactNode;
  defaultValues?: Record<string, any>;
  validationRules?: Record<string, ValidationRules>;
}

export const FormProvider: React.FC<FormProviderProps> = ({
  children,
  defaultValues = {},
  validationRules = {}
}) => {
  const [fields, setFields] = useState<Record<string, FieldState>>(
    Object.keys(defaultValues).reduce((acc, key) => ({
      ...acc,
      [key]: {
        value: defaultValues[key],
        isDirty: false,
        isTouched: false
      }
    }), {})
  );

  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isDirty: false,
    errors: {}
  });

  const values = Object.entries(fields).reduce((acc, [key, field]) => ({
    ...acc,
    [key]: field.value
  }), {});

  const errors = formState.errors;
  const touched = Object.entries(fields).reduce((acc, [key, field]) => ({
    ...acc,
    [key]: field.isTouched
  }), {});

  const registerField = useCallback((name: string, validations?: ValidationRules) => {
    setFields(prev => ({
      ...prev,
      [name]: prev[name] || {
        value: defaultValues[name] || '',
        isDirty: false,
        isTouched: false
      }
    }));
  }, [defaultValues]);

  const unregisterField = useCallback((name: string) => {
    setFields(prev => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const setFieldValue = useCallback((name: string, value: any) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        isDirty: true
      }
    }));
  }, []);

  const setFieldTouched = useCallback((name: string, isTouched = true) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        isTouched
      }
    }));
  }, []);

  const validateField = useCallback(async (name: string) => {
    const rules = validationRules[name];
    if (!rules) return;

    const value = fields[name]?.value;
    let error: string | undefined;

    if (rules.required) {
      error = !value ? (typeof rules.required === 'string' ? rules.required : 'This field is required') : undefined;
    }

    if (!error && rules.validate) {
      error = await rules.validate(value, values);
    }

    if (!error && rules.minLength && value.length < rules.minLength.value) {
      error = rules.minLength.message;
    }

    if (!error && rules.maxLength && value.length > rules.maxLength.value) {
      error = rules.maxLength.message;
    }

    if (!error && rules.min && value < rules.min.value) {
      error = rules.min.message;
    }

    if (!error && rules.max && value > rules.max.value) {
      error = rules.max.message;
    }

    if (!error && rules.pattern && !rules.pattern.value.test(value)) {
      error = rules.pattern.message;
    }

    setFormState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [name]: error ? { message: error } : { message: undefined }
      }
    }));
  }, [fields, validationRules, values]);

  const register = useCallback((name: string) => ({
    value: fields[name]?.value ?? '',
    onChange: (value: any) => {
      setFieldValue(name, value);
      setFieldTouched(name, true);
      validateField(name);
    }
  }), [fields, setFieldValue, setFieldTouched, validateField]);

  const handleSubmit = useCallback((onSubmit: (data: any) => Promise<void>) => async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, isSubmitting: true }));

    try {
      await Promise.all(Object.keys(fields).map(validateField));
      const hasErrors = Object.values(formState.errors).some(error => error.message);
      if (!hasErrors) {
        await onSubmit(values);
      }
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [fields, formState.errors, validateField, values]);

  const getValues = useCallback(() => values, [values]);

  const setValue = useCallback((name: string, value: any) => {
    setFieldValue(name, value);
  }, [setFieldValue]);

  return (
    <FormContext.Provider value={{
      values,
      errors,
      touched,
      registerField,
      unregisterField,
      setFieldValue,
      setFieldTouched,
      validateField,
      register,
      handleSubmit,
      formState: {
        isSubmitting: formState.isSubmitting,
        isDirty: Object.values(fields).some(field => field.isDirty),
        errors: formState.errors
      },
      control: {
        fields,
        setFields
      },
      getValues,
      setValue
    }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = <T extends Record<string, any>>(options: {
  defaultValues?: Partial<T>;
  validationRules?: Record<string, ValidationRules>;
} = {}) => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};

export const useFieldArray = (options: {
  control: any;
  name: string;
}) => {
  const { control } = options;
  const fields = control.fields[options.name]?.value ?? [];

  return {
    fields,
    append: (value: any) => {
      control.setFields((prev: any) => ({
        ...prev,
        [options.name]: {
          ...prev[options.name],
          value: [...fields, value]
        }
      }));
    },
    remove: (index: number) => {
      control.setFields((prev: any) => ({
        ...prev,
        [options.name]: {
          ...prev[options.name],
          value: fields.filter((_: any, i: number) => i !== index)
        }
      }));
    }
  };
};

export const required = (message = 'This field is required') => ({
  required: message
});

export const minLength = (length: number, message = `Minimum length is ${length}`) => ({
  minLength: { value: length, message }
});

export const maxLength = (length: number, message = `Maximum length is ${length}`) => ({
  maxLength: { value: length, message }
});

export const pattern = (regex: RegExp, message: string) => ({
  pattern: { value: regex, message }
});

export const email = (message = 'Invalid email address') => ({
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message
  }
});