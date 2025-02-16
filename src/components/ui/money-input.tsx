'use client';

import { useEffect, useReducer } from 'react';
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseControllerProps,
  UseFormStateReturn,
} from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

interface MoneyInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends UseControllerProps<TFieldValues, TFieldName> {
  label: string;
  placeholder: string;
  description?: string;
  required?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: keyof Intl.NumberFormatOptionsStyleRegistry;
}

function MoneyFieldRender<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  field,
  fieldState,
  className,
  description,
  label,
  placeholder,
  required,
  disabled = false,
  children,
  style = 'currency',
}: {
  field: ControllerRenderProps<TFieldValues, TFieldName>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<TFieldValues>;
  className?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  style?: keyof Intl.NumberFormatOptionsStyleRegistry;
}) {
  const moneyFormatter = Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    currencyDisplay: 'symbol',
    currencySign: 'standard',
    style,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const initialValue = moneyFormatter.format(field.value);

  const [value, setValue] = useReducer((_: any, next: string) => {
    const digits = next.replace(/\D/g, '');
    return moneyFormatter.format(Number(digits) / 100);
  }, initialValue);

  function handleChange(realChangeFn: Function, formattedValue: string) {
    const digits = formattedValue.replace(/\D/g, '');
    const realValue = Number(digits) / 100;
    realChangeFn(realValue);
  }

  useEffect(() => {
    setValue(initialValue);
  }, [value, initialValue]);

  return (
    <FormItem className={className}>
      <FormLabel>
        {label}
        {required && (
          <span className="text-red-500 text-lg leading-none">*</span>
        )}
        {children}
      </FormLabel>
      <FormControl>
        <Input
          placeholder={placeholder}
          type="text"
          {...field}
          onChange={(ev) => {
            setValue(ev.target.value);
            handleChange(field.onChange, ev.target.value);
          }}
          value={value}
          disabled={disabled}
        />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      {fieldState.error && <FormMessage />}
    </FormItem>
  );
}

function MoneyInput<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  required,
  placeholder,
  description,
  control,
  disabled,
  className,
  children,
  style,
}: MoneyInputProps<TFieldValues, TFieldName>) {
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      render={(props) => (
        <MoneyFieldRender
          {...props}
          description={description}
          label={label}
          placeholder={placeholder}
          className={className}
          required={required}
          children={children}
          disabled={disabled}
          style={style}
        />
      )}
    />
  );
}

export { MoneyInput };
