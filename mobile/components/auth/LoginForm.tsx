import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useRouter, Link } from 'expo-router';
import { Lock, Eye, EyeOff, AlertTriangle, Mail } from 'lucide-react-native';
import { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { AlertBox } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { notify } from '@/components/ui/toast-container';
import { primary } from '@/constants/colors';
import { loginUser } from '@/controllers/auth-actions';
import { useAuthStore } from '@/store/authStore';

const loginSchema = z.object({
  // phone: z
  //   .string()
  //   .min(10, 'Phone Number must be at least 10 characters')
  //   .regex(
  //     PHONE_NUMBER_PATTERN,
  //     'Zambian Phone Number must be numeric and valid',
  //   )
  //   .nonempty('Please enter a valid Phone Number'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm({
  handleTabChange,
  onCloseSheet,
}: {
  handleTabChange: (tab: 'login' | 'register') => void;
  onCloseSheet?: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation();

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    const response = await loginUser({
      email: data?.email,
      password: data?.password,
    });

    if (response?.success) {
      notify({
        title: 'Login Successful',
        message: 'Welcome back! You are now logged in.',
        duration: 2000,
        type: 'success',
      });
      useAuthStore.setState({
        isAuthenticated: true,
      });
      router.replace('/(tabs)');
    }

    if (!response?.success) {
      notify({
        title: 'Login Failed',
        message: response?.message || 'Please try again',
        type: 'error',
      });
      setError(response?.message);
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView bounces={false} className="flex-1 flex-grow">
        <View className="px-8 flex-1 pb-32">
          <View className="space-y-6">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  ref={emailRef}
                  label="Email Address"
                  placeholder="name@example.com"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.email?.message}
                  autoCapitalize="none"
                  leftIcon={<Mail size={20} color={primary[300]} />}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  ref={passwordRef}
                  label="Password"
                  placeholder="Enter your password"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.password?.message}
                  secureTextEntry={!showPassword}
                  leftIcon={<Lock size={20} color={primary[300]} />}
                  rightIcon={
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={20} color={primary[300]} />
                      ) : (
                        <Eye size={20} color={primary[300]} />
                      )}
                    </TouchableOpacity>
                  }
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
              )}
            />

            <Link href="/(auth)/forgot-password" asChild>
              <TouchableOpacity className="mb-4" onPress={onCloseSheet}>
                <Text className="text-primary-600 text-right font-medium">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </Link>
            {error && (
              <AlertBox
                Icon={<AlertTriangle size={20} color="#ef4444" />}
                color="error"
                text={error}
              />
            )}

            <Button
              onPress={handleSubmit(onSubmit)}
              variant="default"
              className="mt-4"
              isLoading={isLoading}
              loadingText="Signing in..."
            >
              Sign In
            </Button>

            <View className="mt-6 flex-row items-center justify-center">
              <Text className="text-gray-600">Don't have an account? </Text>

              <TouchableOpacity onPress={() => handleTabChange('register')}>
                <Text className="text-primary-600 font-medium">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
