'use client';
import type {
  FieldPath,
  FieldValues,
  UseControllerProps,
} from 'react-hook-form';

import { useState } from 'react';

import { Calendar } from './calendar';
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { InputDateField } from './input-date-field';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

import type { Matcher } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { ptBR } from 'date-fns/locale';

interface DateFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<UseControllerProps<TFieldValues, TFieldName>, 'disabled'> {
  label: string;
  description?: string;
  placeholder?: string;
  className?: string;
  disabled?: Matcher | Matcher[] | undefined;
  inputDisabled?: boolean;
  initialValue?: Date;
  endMonth?: Date;
  required?: boolean;
}

function DateField<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  inputDisabled,
  placeholder,
  endMonth,
  className,
  disabled,
  initialValue,
  required,
}: DateFieldProps<TFieldValues, TFieldName>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      disabled={inputDisabled}
      defaultValue={initialValue as any}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          <FormLabel htmlFor={name}>
            {label}
            {required && (
              <span className="text-red-500 text-lg leading-none">*</span>
            )}
          </FormLabel>

          <Popover open={!inputDisabled && isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              tabIndex={-1}
              className="w-full !mt-0 outline-none"
            >
              <InputDateField
                id={name}
                field={field}
                disabled={inputDisabled}
                onFocus={() => setIsOpen(true)}
                className={cn(fieldState.error && 'border-destructive')}
              />
            </PopoverTrigger>
            <PopoverContent
              onOpenAutoFocus={(e) => e.preventDefault()}
              className="flex justify-center w-fit p-0"
            >
              <Calendar
                mode="single"
                locale={ptBR}
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  setIsOpen(false);
                }}
                defaultMonth={field.value || new Date()}
                key={`${name}-${field.value?.toString()}`}
                endMonth={endMonth}
                disabled={disabled}
              />
            </PopoverContent>
          </Popover>

          <FormDescription>{description}</FormDescription>
          {fieldState.error && <FormMessage />}
        </FormItem>
      )}
    />
  );
}

export { DateField };
