import { useCallback } from 'react';
import { useForm } from '../contexts/FormContext';
import type { ValidationRules } from '../contexts/FormContext';

interface UseFieldArrayProps {
  name: string;
  validations?: ValidationRules;
}

export const useFieldArray = ({ name, validations = {} }: UseFieldArrayProps) => {
  const {
    values,
    setFieldValue,
    validateField
  } = useForm();

  const fields = values[name] ?? [];

  const append = useCallback((value: any) => {
    setFieldValue(name, [...fields, value]);
    validateField(name);
  }, [fields, name, setFieldValue, validateField]);

  const remove = useCallback((index: number) => {
    setFieldValue(name, fields.filter((_: any, i: number) => i !== index));
    validateField(name);
  }, [fields, name, setFieldValue, validateField]);

  const update = useCallback((index: number, value: any) => {
    const newFields = [...fields];
    newFields[index] = value;
    setFieldValue(name, newFields);
    validateField(name);
  }, [fields, name, setFieldValue, validateField]);

  return {
    fields,
    append,
    remove,
    update
  };
}; 