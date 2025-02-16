import type { ControllerRenderProps } from 'react-hook-form';

import { ComponentProps, useEffect, useState } from 'react';

import { Input } from './input';

import { withMask } from 'use-mask-input';

import { isValid, parse } from 'date-fns';

const InputDateField: React.FC<
  {
    field: ControllerRenderProps<any, string>;
    disabled?: boolean;
    id?: string;
  } & ComponentProps<typeof Input>
> = ({ field, disabled, id, ...props }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parts = e.target.value.split('/');
    let day = parts[0];
    let month = parts[1];
    if (Number(day) > 31) {
      parts[0] = (day || '')?.slice(0, 1).padStart(2, '0');
    }
    if (Number(month) > 12) {
      parts[1] = (month || '').slice(0, 1).padStart(2, '0');
    }

    const newValue = parts.join('/');
    setInputValue(parts.join('/'));

    if (newValue.length === 10) {
      const parsedDate = parse(newValue, 'dd/MM/yyyy', new Date());
      if (isValid(parsedDate)) {
        field.onChange(parsedDate);
      }
    }
  };

  useEffect(() => {
    if (field.value) {
      const value =
        typeof field?.value === 'string'
          ? new Date(field?.value)
          : field?.value;
      setInputValue(value?.toLocaleDateString('pt-BR'));
    } else {
      setInputValue('');
    }
  }, [field.value]);

  return (
    <Input
      id={id}
      placeholder="Selecione a data"
      ref={withMask('99/99/9999', {
        undoOnEscape: false,
      })}
      className="w-full outline-none"
      value={inputValue}
      onChange={handleChange}
      readOnly={disabled}
      autoComplete="off"
      {...props}
    />
  );
};

export { InputDateField };
