import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/constants/colors';
import { Role } from '@/types';

interface RoleSelectorProps {
  selectedRole: Role;
  onChange: (role: Role) => void;
  disabled?: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onChange,
  disabled = false,
}) => {
  const roles: { value: Role; label: string }[] = [
    { value: 'owner', label: 'Owner' },
    { value: 'contributor', label: 'Contributor' },
    { value: 'viewer', label: 'Viewer' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Role</Text>
      <View style={styles.options}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.value}
            style={[
              styles.option,
              selectedRole === role.value && styles.selectedOption,
              disabled && styles.disabledOption,
            ]}
            onPress={() => !disabled && onChange(role.value)}
            disabled={disabled}
          >
            <Text
              style={[
                styles.optionText,
                selectedRole === role.value && styles.selectedOptionText,
                disabled && styles.disabledOptionText,
              ]}
            >
              {role.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  options: {
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: colors.primary,
  },
  disabledOption: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  selectedOptionText: {
    color: '#fff',
  },
  disabledOptionText: {
    color: colors.placeholder,
  },
});
