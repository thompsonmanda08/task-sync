import {
  X,
  CircleAlert as AlertCircle,
  CircleCheck as CheckCircle,
  Info,
  AlertTriangle,
} from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastProps = {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  duration?: number;
  onDismiss: (id: string) => void;
};

const Toast = ({
  id,
  title,
  message,
  type,
  duration = 5000,
  onDismiss,
}: ToastProps) => {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return '#00d15c';
      case 'error':
        return '#e40744';
      case 'info':
        return '#8893f8';
      case 'warning':
        return '#faaf16';
      default:
        return '#4D5DFA';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={24} color={getIconColor()} />;
      case 'error':
        return <AlertCircle size={24} color={getIconColor()} />;
      case 'warning':
        return <AlertTriangle size={24} color={getIconColor()} />;
      case 'info':
        return <Info size={24} color={getIconColor()} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: duration - 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onDismiss(id));
    });
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [
            {
              translateY: opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
          marginTop: insets.top + 10,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>{getIcon()}</View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
        <X size={20} color="#9E9E9E" />
      </View>
      <Animated.View
        style={[
          styles.progressBar,
          {
            backgroundColor: getIconColor(),
            width: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [width - 32, 0],
            }),
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#757575',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#4CAF50',
  },
});

export default Toast;
