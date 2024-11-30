import { useEffect } from 'react';
import { useForm } from '../contexts/FormContext';
import type { ValidationRules } from '../contexts/FormContext';

interface UseFieldProps {
  name: string;
  validations?: ValidationRules;
}

export const useField = ({ name, validations = {} }: UseFieldProps) => {
  const {
    registerField,
    unregisterField,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    validateField
  } = useForm();

  useEffect(() => {
    registerField(name, validations);
    return () => unregisterField(name);
  }, [name, validations, registerField, unregisterField]);

  return {
    field: {
      value: values[name],
      onChange: (value: any) => {
        setFieldValue(name, value);
        setFieldTouched(name, true);
        validateField(name);
      },
      onBlur: () => {
        setFieldTouched(name, true);
        validateField(name);
      }
    },
    fieldState: {
      error: errors[name],
      touched: touched[name]
    }
  };
}; 