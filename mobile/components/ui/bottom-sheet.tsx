import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { X } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  snapPoints?: string[];
}

const BottomSheet = forwardRef<any, BottomSheetProps>(
  ({ children, isOpen, onClose, snapPoints = ['50%', '90%'] }, ref) => {
    // Convert snapPoints percentages to actual pixel values
    const convertedSnapPoints = snapPoints.map((point) => {
      if (typeof point === 'string' && point.endsWith('%')) {
        const percentage = parseInt(point.slice(0, -1));
        return SCREEN_HEIGHT * (percentage / 100);
      }
      return 300; // Default height
    });

    const translateY = useSharedValue(SCREEN_HEIGHT);
    const context = useSharedValue({ y: 0 });
    const active = useSharedValue(false);
    const activeSnapPoint = useSharedValue(0);

    // Set smallest snap point as the default when opening
    const smallestSnapPoint = Math.min(...convertedSnapPoints);

    useImperativeHandle(ref, () => ({
      scrollTo: (destination: number) => {
        'worklet';
        active.value = destination !== 0;
        translateY.value = withSpring(destination, { damping: 50 });
      },
      isActive: () => {
        return active.value;
      },
    }));

    useEffect(() => {
      if (isOpen) {
        translateY.value = withSpring(SCREEN_HEIGHT - smallestSnapPoint, {
          damping: 50,
        });
        active.value = true;
        activeSnapPoint.value = 0; // First snap point
      } else {
        translateY.value = withSpring(SCREEN_HEIGHT, { damping: 50 });
        active.value = false;
      }
    }, [isOpen]);

    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        translateY.value = Math.max(
          event.translationY + context.value.y,
          SCREEN_HEIGHT - convertedSnapPoints[convertedSnapPoints.length - 1],
        );
      })
      .onEnd((event) => {
        // Find the closest snap point based on velocity and position
        let dest = SCREEN_HEIGHT;
        let newActivePoint = -1;

        // If velocity is significant, move in that direction
        if (event.velocityY > 500) {
          // Moving down fast
          if (activeSnapPoint.value > 0) {
            dest =
              SCREEN_HEIGHT - convertedSnapPoints[activeSnapPoint.value - 1];
            newActivePoint = activeSnapPoint.value - 1;
          } else {
            dest = SCREEN_HEIGHT;
            newActivePoint = -1;
          }
        } else if (event.velocityY < -500) {
          // Moving up fast
          if (activeSnapPoint.value < convertedSnapPoints.length - 1) {
            dest =
              SCREEN_HEIGHT - convertedSnapPoints[activeSnapPoint.value + 1];
            newActivePoint = activeSnapPoint.value + 1;
          } else {
            dest =
              SCREEN_HEIGHT -
              convertedSnapPoints[convertedSnapPoints.length - 1];
            newActivePoint = convertedSnapPoints.length - 1;
          }
        } else {
          // Based on position
          let minDistance = Number.MAX_VALUE;
          convertedSnapPoints.forEach((snapPoint, idx) => {
            const distance = Math.abs(
              translateY.value - (SCREEN_HEIGHT - snapPoint),
            );
            if (distance < minDistance) {
              minDistance = distance;
              dest = SCREEN_HEIGHT - snapPoint;
              newActivePoint = idx;
            }
          });

          // If closest to fully closed, handle close
          if (Math.abs(translateY.value - SCREEN_HEIGHT) < minDistance) {
            dest = SCREEN_HEIGHT;
            newActivePoint = -1;
          }
        }

        // If we're closing the sheet
        if (dest === SCREEN_HEIGHT) {
          activeSnapPoint.value = -1;
          active.value = false;
          runOnJS(onClose)();
        } else {
          activeSnapPoint.value = newActivePoint;
          active.value = true;
        }

        translateY.value = withSpring(dest, { damping: 50 });
      });

    const bottomSheetStyle = useAnimatedStyle(() => {
      const borderRadius = interpolate(
        translateY.value,
        [
          SCREEN_HEIGHT - convertedSnapPoints[convertedSnapPoints.length - 1],
          SCREEN_HEIGHT,
        ],
        [25, 25],
        Extrapolate.CLAMP,
      );

      return {
        borderRadius,
        transform: [{ translateY: translateY.value }],
      };
    });

    const backdropStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        translateY.value,
        [SCREEN_HEIGHT, SCREEN_HEIGHT - smallestSnapPoint],
        [0, 0.5],
        Extrapolate.CLAMP,
      );

      return {
        opacity,
        display: opacity === 0 ? 'none' : 'flex',
      };
    });

    return (
      <>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'black' },
            backdropStyle,
          ]}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>

        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[styles.bottomSheetContainer, bottomSheetStyle]}
          >
            <View style={styles.header}>
              <View style={styles.indicator} />
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color="#9E9E9E" />
              </TouchableOpacity>
            </View>
            <View style={styles.content}>{children}</View>
          </Animated.View>
        </GestureDetector>
      </>
    );
  },
);

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    borderRadius: 25,
    zIndex: 1000,
    overflow: 'hidden',
  },
  header: {
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indicator: {
    width: 40,
    height: 5,
    backgroundColor: '#EEEEEE',
    borderRadius: 5,
    alignSelf: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default BottomSheet;
