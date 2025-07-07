import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { colors } from '../constants/colors';
import { SharedUser } from '@/types';
import { UserAvatar } from './UserAvatar';

interface UserListItemProps {
  user: SharedUser;
  onPress?: () => void;
  onOptionsPress?: () => void;
}

export const UserListItem: React.FC<UserListItemProps> = ({
  user,
  onPress,
  onOptionsPress,
}) => {
  const getRoleBadgeColor = () => {
    switch (user.role) {
      case 'owner':
        return '#6366F1'; // Indigo
      case 'contributor':
        return '#10B981'; // Emerald
      case 'viewer':
        return '#F59E0B'; // Amber
      default:
        return colors.primary; // Default to primary color
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
    >
      <UserAvatar name={user.name} size={40} />

      <View style={styles.content}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View
        style={[styles.roleBadge, { backgroundColor: getRoleBadgeColor() }]}
      >
        <Text style={styles.roleText}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Text>
      </View>

      {onOptionsPress && (
        <TouchableOpacity style={styles.optionsButton} onPress={onOptionsPress}>
          <MoreVertical size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  optionsButton: {
    padding: 8,
  },
});
