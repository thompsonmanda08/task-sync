import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, Link, Redirect } from 'expo-router';
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Smartphone,
} from 'lucide-react-native';
import { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { z } from 'zod';

import { registerNewUser } from '../../controllers/auth-actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EXISTING_USER, PHONE_NUMBER_PATTERN } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { notify } from '../ui/toast-container';
import { primary } from '@/constants/colors';
import { User as UserType } from '@/types';

const registerSchema = z
  .object({
    firstName: z.string().min(3, 'Name must be at least 3 characters'),
    lastName: z.string().min(3, 'Name must be at least 3 characters'),
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
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm({
  handleTabChange,
}: {
  handleTabChange: (tab: 'login' | 'register') => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const response = await registerNewUser({
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
    });

    if (response?.success) {
      notify({
        title: 'Account Created!',
        message: 'Logging you in right now',
        duration: 2000,
        type: 'success',
      });
      if (response?.data?.accessToken) {
        useAuthStore.setState({
          isAuthenticated: true,
          user: response?.data?.user as UserType,
        });
        router.replace('/(tabs)');
      } else {
        Alert.alert('Login', 'Login with your credentials now', [
          {
            text: 'OK',
            style: 'cancel',
          },
        ]);
      }
    } else {
      notify({
        title: 'Registration Failed',
        message: response?.message || 'Please try again',
        type: 'error',
      });

      Alert.alert('Registration failed', response.message, [
        // {
        //   text: 'OK',
        //   style: 'cancel',
        //   onPress: () => {
        //     router.replace('/(auth)/login');
        //   },
        // },
      ]);
    }
  };

  const handleNext = async (fieldsToValidate: (keyof RegisterFormData)[]) => {
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView
        className="flex-1 flex-grow"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="space-y-5 px-6 flex-1 pb-24">
          {/* Step 1: First and Last Name */}
          {currentStep === 1 && (
            <View>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={firstNameRef}
                    label="First Name"
                    placeholder="Enter your first name"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.firstName?.message}
                    autoCapitalize="words"
                    leftIcon={<User size={20} color={primary[400]} />}
                    returnKeyType="next"
                    onSubmitEditing={() => lastNameRef.current?.focus()}
                  />
                )}
              />
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={lastNameRef}
                    label="Last Name"
                    placeholder="Enter your last name"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.lastName?.message}
                    autoCapitalize="words"
                    leftIcon={<User size={20} color={primary[400]} />}
                    returnKeyType="next"
                    onSubmitEditing={() =>
                      handleNext(['firstName', 'lastName'])
                    }
                  />
                )}
              />
              <Button
                onPress={() => handleNext(['firstName', 'lastName'])}
                variant="default"
                className="mt-3"
              >
                Next
              </Button>
            </View>
          )}

          {/* Step 2: Email Address (Placeholder) */}
          {currentStep === 2 && (
            <View>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={emailRef}
                    label="Email Address"
                    placeholder="Enter your email address"
                    autoComplete="off" // Disables autocomplete/autofill
                    importantForAutofill="no" // For Android specifically
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.email?.message}
                    autoCapitalize="none"
                    leftIcon={<Mail size={20} color={primary[400]} />}
                    returnKeyType="next"
                    onSubmitEditing={() => handleNext(['email'])}
                  />
                )}
              />
              <View className="flex-row justify-between mt-3">
                <Button
                  onPress={() => setCurrentStep(1)}
                  variant="outline"
                  className="flex-1 mr-2"
                >
                  Previous
                </Button>
                <Button
                  onPress={() => handleNext(['email'])}
                  variant="default"
                  className="flex-1 ml-2"
                >
                  Next
                </Button>
              </View>
            </View>
          )}

          {/* Step 3: Passwords (Placeholder) */}
          {currentStep === 3 && (
            <View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={passwordRef}
                    label="Password"
                    placeholder="Create a password"
                    onChangeText={onChange}
                    autoComplete="off" // Disables autocomplete/autofill
                    importantForAutofill="no" // For Android specifically
                    onBlur={onBlur}
                    value={value}
                    error={errors.password?.message}
                    secureTextEntry={!showPassword}
                    leftIcon={<Lock size={20} color={primary[400]} />}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={20} color={primary[400]} />
                        ) : (
                          <Eye size={20} color={primary[400]} />
                        )}
                      </TouchableOpacity>
                    }
                    returnKeyType="next"
                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                  />
                )}
              />
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={confirmPasswordRef}
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.confirmPassword?.message}
                    secureTextEntry={!showConfirmPassword}
                    leftIcon={<Lock size={20} color={primary[400]} />}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} color={primary[400]} />
                        ) : (
                          <Eye size={20} color={primary[400]} />
                        )}
                      </TouchableOpacity>
                    }
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                  />
                )}
              />
              <View className="flex-row justify-between mt-3">
                <Button
                  onPress={() => setCurrentStep(2)}
                  variant="outline"
                  className="flex-1 mr-2"
                >
                  Previous
                </Button>
                <Button
                  onPress={handleSubmit(onSubmit)}
                  variant="default"
                  className="flex-1 ml-2"
                >
                  Create Account
                </Button>
              </View>
            </View>
          )}

          <View className="my-6 mb-12 flex-row items-center justify-center">
            <Text className="text-gray-600">Already have an account? </Text>

            <TouchableOpacity onPress={() => handleTabChange('login')}>
              <Text className="text-primary-600 font-medium">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
