import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {
  ChevronRight,
  User,
  Bell,
  Moon,
  HelpCircle,
  LogOut,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useTodoStore } from '@/store/todoStore';

import { UserAvatar } from '@/components/UserAvatar';

export default function SettingsScreen() {
  const currentUser = useTodoStore((state) => state.currentUser);

  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  interface SettingItemProps {
    icon: React.ReactNode;
    title: string;
    onPress: () => void;
    value?: boolean;
    isSwitch: boolean;
  }

  const SettingItem: React.FC<SettingItemProps> = ({
    icon,
    title,
    onPress,
    value,
    isSwitch,
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={isSwitch}
    >
      <View style={styles.settingIcon}>{icon}</View>
      <Text style={styles.settingTitle}>{title}</Text>
      <View style={styles.settingAction}>
        {isSwitch ? (
          <Switch
            value={value}
            onValueChange={onPress}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
        ) : (
          <ChevronRight size={20} color={colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <UserAvatar
          name={currentUser.name}
          imageUrl={currentUser.avatar}
          size={80}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{currentUser.name}</Text>
          <Text style={styles.profileEmail}>{currentUser.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.sectionContent}>
          <SettingItem
            icon={<User size={22} color={colors.primary} />}
            title="Profile"
            onPress={() => {}}
            value={undefined}
            isSwitch={false}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.sectionContent}>
          <SettingItem
            icon={<Bell size={22} color={colors.primary} />}
            title="Notifications"
            onPress={() => setNotifications(!notifications)}
            value={notifications}
            isSwitch={true}
          />
          <SettingItem
            icon={<Moon size={22} color={colors.primary} />}
            title="Dark Mode"
            onPress={() => setDarkMode(!darkMode)}
            value={darkMode}
            isSwitch={true}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.sectionContent}>
          <SettingItem
            icon={<HelpCircle size={22} color={colors.primary} />}
            title="Help & Support"
            onPress={() => {}}
            value={undefined}
            isSwitch={false}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <LogOut size={20} color={colors.danger} style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },
  profileSection: {
    backgroundColor: colors.background,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sectionContent: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIcon: {
    width: 24,
    marginRight: 16,
    alignItems: 'center',
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  settingAction: {
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.danger,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 32,
  },
});
