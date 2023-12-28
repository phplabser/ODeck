import {
  FormControl,
  Input,
  InputGroup,
  InputProps,
  FormHelperText,
  FormErrorMessage,
  FormLabel,
  Button,
} from '@chakra-ui/react';
import React, { useCallback, useMemo, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styles from './FileInput.module.scss';

export interface FileInputProps extends InputProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
}

const FileInput: React.FC<FileInputProps> = ({
  label,
  defaultValue,
  name,
  required,
  disabled,
  className,
  maxLength,
  hint,
  ...rest
}) => {
  const { formState, control } = useFormContext();
  const { t } = useTranslation('editor');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const error = useMemo(
    () => formState.errors[name]?.message,
    [formState.errors, name]
  );

  const handleOpenFilePicker = useCallback(
    async (onChange) => {
      const dialogResult = await window.electron.ipcRenderer.openDialog(
        'showOpenDialog',
        {
          properties: ['openFile'],
          filters: rest.types || [],
        }
      );
      if (dialogResult.canceled) return;
      if (inputRef.current) {
        inputRef.current.value = dialogResult?.filePaths[0];
      }
      onChange(dialogResult?.filePaths[0]);
    },
    [rest.types]
  );

  return (
    <FormControl
      isInvalid={Boolean(error)}
      isDisabled={disabled}
      isRequired={required}
    >
      <FormLabel htmlFor={name} required={required}>
        {label}
      </FormLabel>
      {hint && <FormHelperText marginBottom={4}>{hint}</FormHelperText>}
      <div className={styles.inputContainer}>
        <InputGroup>
          <Controller
            control={control}
            name={name}
            render={({
              field: { onChange, onBlur, value, name: fieldName },
            }) => (
              <>
                <Input
                  ref={inputRef}
                  onBlur={onBlur}
                  name={fieldName}
                  value={value}
                  disabled
                />
                <Button
                  onClick={() => handleOpenFilePicker(onChange)}
                  size="sm"
                >
                  {t('file_picker.label')}
                </Button>
              </>
            )}
          />
        </InputGroup>
      </div>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default FileInput;
