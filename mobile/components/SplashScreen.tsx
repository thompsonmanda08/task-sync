import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { colors, primary } from '@/constants/colors';
import images from '@/constants/images';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');
const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function SplashScreenView({
  onAnimationComplete,
}: {
  onAnimationComplete: () => void;
}) {
  // Animation values
  const iconOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0.5);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const bgCircle1Scale = useSharedValue(0.8);
  const bgCircle2Scale = useSharedValue(0.8);
  const bgCircle3Scale = useSharedValue(0.8);

  // Background circles animation
  const animatedCircle1Style = useAnimatedStyle(() => {
    return {
      transform: [{ scale: bgCircle1Scale.value }],
      opacity: interpolate(
        bgCircle1Scale.value,
        [0.8, 1],
        [0.1, 0.2],
        Extrapolate.CLAMP,
      ),
    };
  });

  const animatedCircle2Style = useAnimatedStyle(() => {
    return {
      transform: [{ scale: bgCircle2Scale.value }],
      opacity: interpolate(
        bgCircle2Scale.value,
        [0.8, 1],
        [0.1, 0.15],
        Extrapolate.CLAMP,
      ),
    };
  });

  const animatedCircle3Style = useAnimatedStyle(() => {
    return {
      transform: [{ scale: bgCircle3Scale.value }],
      opacity: interpolate(
        bgCircle3Scale.value,
        [0.8, 1],
        [0.05, 0.1],
        Extrapolate.CLAMP,
      ),
    };
  });

  // Icon animation
  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      opacity: iconOpacity.value,
      transform: [{ scale: iconScale.value }],
    };
  });

  // Text animation
  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [{ translateY: textTranslateY.value }],
    };
  });

  useEffect(() => {
    // Start background animations
    bgCircle1Scale.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );

    bgCircle2Scale.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );

    bgCircle3Scale.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );

    // Animate icon first
    iconOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.ease),
    });
    iconScale.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.elastic(1)),
    });

    // Then animate text
    textOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    textTranslateY.value = withDelay(
      600,
      withTiming(0, { duration: 800, easing: Easing.out(Easing.ease) }),
    );

    // Complete animation after delay
    const timeout = setTimeout(() => {
      onAnimationComplete();
    }, 3500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Background circles */}
      <Animated.View
        style={[styles.bgCircle, styles.bgCircle1, animatedCircle1Style]}
      />
      <Animated.View
        style={[styles.bgCircle, styles.bgCircle2, animatedCircle2Style]}
      />
      <Animated.View
        style={[styles.bgCircle, styles.bgCircle3, animatedCircle3Style]}
      />

      {/* Background pattern */}
      <View style={styles.patternContainer}>
        {Array.from({ length: 10 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.patternLine,
              { left: `${i * 10}%`, opacity: 0.03 + (i % 3) * 0.01 },
            ]}
          />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.patternLine,
              {
                top: `${i * 10}%`,
                transform: [{ rotate: '90deg' }],
                opacity: 0.03 + (i % 3) * 0.01,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.logoContainer}>
        {/* Icon */}
        <AnimatedImage
          source={images.logoIcon}
          style={[styles.iconImage, animatedIconStyle]}
          contentFit="contain"
        />

        {/* Text logo */}
        <AnimatedImage
          source={images.textLogo}
          style={[styles.textImage, animatedTextStyle]}
          contentFit="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFFFE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  iconImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  textImage: {
    width: 200,
    height: 50,
  },
  bgCircle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: primary[200],
  },
  bgCircle1: {
    width: width * 1.5,
    height: width * 1.5,
    top: -width * 0.5,
    left: -width * 0.25,
  },
  bgCircle2: {
    width: width * 1.2,
    height: width * 1.2,
    bottom: -width * 0.3,
    right: -width * 0.3,
  },
  bgCircle3: {
    width: width * 0.8,
    height: width * 0.8,
    top: height * 0.6,
    left: -width * 0.4,
  },
  patternContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  patternLine: {
    position: 'absolute',
    width: '200%',
    height: 1,
    backgroundColor: primary[900],
  },
});
