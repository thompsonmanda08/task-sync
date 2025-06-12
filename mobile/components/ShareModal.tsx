import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import { Search, X, UserPlus } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Role, User } from '@/types';
import { UserAvatar } from './UserAvatar';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  onShare: (userId: string, role: Role) => void;
  users: User[];
  alreadySharedUserIds: string[];
  title?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  onClose,
  onShare,
  users,
  alreadySharedUserIds,
  title = 'Share',
}) => {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>('viewer');

  const filteredUsers = users.filter(
    (user) =>
      !alreadySharedUserIds.includes(user.id) &&
      (user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())),
  );

  const handleShare = () => {
    if (selectedUser) {
      onShare(selectedUser.id, selectedRole);
      resetForm();
    }
  };

  const resetForm = () => {
    setSearch('');
    setSelectedUser(null);
    setSelectedRole('viewer');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {selectedUser ? (
              <View style={styles.selectedUserContainer}>
                <View style={styles.selectedUserInfo}>
                  <UserAvatar
                    name={selectedUser.name}
                    imageUrl={selectedUser.avatar}
                    size={48}
                  />
                  <View style={styles.selectedUserDetails}>
                    <Text style={styles.selectedUserName}>
                      {selectedUser.name}
                    </Text>
                    <Text style={styles.selectedUserEmail}>
                      {selectedUser.email}
                    </Text>
                  </View>
                </View>

                <View style={styles.roleSelector}>
                  <Text style={styles.roleLabel}>Role:</Text>
                  <View style={styles.roleOptions}>
                    <TouchableOpacity
                      style={[
                        styles.roleOption,
                        selectedRole === 'contributor' &&
                          styles.roleOptionSelected,
                      ]}
                      onPress={() => setSelectedRole('contributor')}
                    >
                      <Text
                        style={[
                          styles.roleOptionText,
                          selectedRole === 'contributor' &&
                            styles.roleOptionTextSelected,
                        ]}
                      >
                        Contributor
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.roleOption,
                        selectedRole === 'viewer' && styles.roleOptionSelected,
                      ]}
                      onPress={() => setSelectedRole('viewer')}
                    >
                      <Text
                        style={[
                          styles.roleOptionText,
                          selectedRole === 'viewer' &&
                            styles.roleOptionTextSelected,
                        ]}
                      >
                        Viewer
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={handleShare}
                >
                  <UserPlus size={18} color="#fff" style={styles.shareIcon} />
                  <Text style={styles.shareButtonText}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setSelectedUser(null)}
                >
                  <Text style={styles.backButtonText}>
                    Back to user selection
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.searchContainer}>
                  <Search
                    size={20}
                    color={colors.textSecondary}
                    style={styles.searchIcon}
                  />
                  <TextInput
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search by name or email"
                    placeholderTextColor={colors.placeholder}
                    autoFocus
                  />
                </View>

                {filteredUsers.length > 0 ? (
                  <FlatList
                    data={filteredUsers}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.userItem}
                        onPress={() => setSelectedUser(item)}
                      >
                        <UserAvatar
                          name={item.name}
                          imageUrl={item.avatar}
                          size={40}
                        />
                        <View style={styles.userInfo}>
                          <Text style={styles.userName}>{item.name}</Text>
                          <Text style={styles.userEmail}>{item.email}</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    style={styles.userList}
                  />
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                      {search.trim()
                        ? 'No users found matching your search'
                        : 'No users available to share with'}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 16,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  content: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  userList: {
    maxHeight: 400,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userInfo: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  selectedUserContainer: {
    padding: 8,
  },
  selectedUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  selectedUserDetails: {
    marginLeft: 16,
  },
  selectedUserName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  selectedUserEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  roleSelector: {
    marginBottom: 24,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  roleOptions: {
    flexDirection: 'row',
  },
  roleOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 8,
  },
  roleOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  roleOptionTextSelected: {
    color: '#fff',
  },
  shareButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  shareIcon: {
    marginRight: 8,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
