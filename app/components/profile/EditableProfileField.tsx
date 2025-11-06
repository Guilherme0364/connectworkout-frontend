import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface EditableProfileFieldProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  isEditing: boolean;
  required?: boolean;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export const EditableProfileField: React.FC<EditableProfileFieldProps> = ({
  label,
  value,
  onChangeText,
  isEditing,
  required = false,
  error,
  multiline = false,
  numberOfLines = 1,
  ...textInputProps
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      {isEditing ? (
        <View>
          <TextInput
            style={[
              styles.input,
              multiline && styles.multilineInput,
              error && styles.inputError,
            ]}
            value={value}
            onChangeText={onChangeText}
            placeholder={`Digite ${label.toLowerCase()}`}
            placeholderTextColor="#9ca3af"
            multiline={multiline}
            numberOfLines={numberOfLines}
            textAlignVertical={multiline ? 'top' : 'center'}
            {...textInputProps}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      ) : (
        <Text style={[styles.value, !value && styles.emptyValue]}>
          {value || 'Não informado'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  value: {
    fontSize: 15,
    color: '#1f2937',
    paddingVertical: 8,
  },
  emptyValue: {
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1f2937',
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: 12,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
});
