import { X } from 'lucide-react-native';
import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  PanResponder,
  Image,
} from 'react-native';

import { colors, primary } from '@/constants/colors';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import images from '@/constants/images';

interface AuthBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

const { width, height: screenHeight } = Dimensions.get('window');

export const AuthBottomSheet: React.FC<AuthBottomSheetProps> = ({
  visible,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const slideAnim = useRef(new Animated.Value(0)).current;
  const sheetAnim = useRef(new Animated.Value(screenHeight)).current;
  const sheetHeightPercentage = 0.91;

  useEffect(() => {
    if (visible) {
      Animated.timing(sheetAnim, {
        toValue: screenHeight * (1 - sheetHeightPercentage),
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(sheetAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [visible, screenHeight, sheetHeightPercentage]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: activeTab === 'login' ? 0 : width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          sheetAnim.setValue(
            screenHeight * (1 - sheetHeightPercentage) + gestureState.dy,
          );
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dy, vy } = gestureState;
        if (dy > screenHeight * sheetHeightPercentage * 0.4 || vy > 0.5) {
          onClose();
        } else {
          Animated.spring(sheetAnim, {
            toValue: screenHeight * (1 - sheetHeightPercentage),
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.sheetContainer,
                { transform: [{ translateY: sheetAnim }] },
                { height: `${sheetHeightPercentage * 100}%` },
              ]}
            >
              <View
                style={styles.header}
                className="py-6"
                {...panResponder.panHandlers}
              >
                <View style={styles.headerHandle} />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  className="bg-primary-50 p-2 rounded-full"
                >
                  <X size={20} color={primary[300]} />
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center gap-2 px-8">
                <Image
                  source={images.logoIcon}
                  className="w-10 aspect-square"
                  resizeMode="contain"
                />
                <Text style={styles.title}>Welcome to TaskSync</Text>
              </View>

              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === 'login' && styles.activeTabButton,
                  ]}
                  onPress={() => handleTabChange('login')}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'login' && styles.activeTabText,
                    ]}
                  >
                    Login
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === 'register' && styles.activeTabButton,
                  ]}
                  onPress={() => handleTabChange('register')}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === 'register' && styles.activeTabText,
                    ]}
                  >
                    Register
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formWrapper}>
                <Animated.View
                  style={[
                    styles.formSlide,
                    {
                      transform: [
                        {
                          translateX: slideAnim.interpolate({
                            inputRange: [0, width],
                            outputRange: [0, -width],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <LoginForm handleTabChange={handleTabChange} />
                </Animated.View>

                <Animated.View
                  style={[
                    styles.formSlide,
                    {
                      transform: [
                        {
                          translateX: slideAnim.interpolate({
                            inputRange: [0, width],
                            outputRange: [width, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <RegisterForm handleTabChange={handleTabChange} />
                </Animated.View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 60 : 40,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    position: 'relative',
  },
  headerHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 8,
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 10,
    backgroundColor: primary[50],
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTabButton: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: primary[700],
  },
  activeTabText: {
    color: '#fff',
  },
  formContainer: {
    flex: 1,
  },
  formContentContainer: {
    paddingHorizontal: 24,
    flexGrow: 1,
  },
  formWrapper: {
    position: 'relative',
    overflow: 'hidden',
    flex: 1,
    paddingBottom: 32,
  },
  formSlide: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
