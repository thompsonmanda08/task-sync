import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/constants/colors';
import { Role, User } from '@/types';

interface UserItemProps {
  user: User;
  role?: Role;
  onPress?: () => void;
  onRoleChange?: (role: Role) => void;
  onRemove?: () => void;
  selectable?: boolean;
  selected?: boolean;
}

export const UserItem: React.FC<UserItemProps> = ({
  user,
  role,
  onPress,
  onRoleChange,
  onRemove,
  selectable = false,
  selected = false,
}) => {
  const getRoleColor = (role?: Role) => {
    switch (role) {
      case 'owner':
        return colors.primary;
      case 'contributor':
        return colors.success;
      case 'viewer':
        return colors.info;
      default:
        return colors.placeholder;
    }
  };

  const getRoleLabel = (role?: Role) => {
    switch (role) {
      case 'owner':
        return 'Owner';
      case 'contributor':
        return 'Contributor';
      case 'viewer':
        return 'Viewer';
      default:
        return '';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        selectable && selected && styles.selectedContainer,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Image
        source={
          user.avatar ||
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
        style={styles.avatar}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      {role && (
        <View
          style={[
            styles.roleContainer,
            { backgroundColor: getRoleColor(role) },
          ]}
        >
          <Text style={styles.roleText}>{getRoleLabel(role)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  selectedContainer: {
    backgroundColor: `${colors.primary}20`,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  email: {
    fontSize: 14,
    color: colors.placeholder,
  },
  roleContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
});
