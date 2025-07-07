import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { Input } from '@/components/ui/input';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      // Simulate password reset email
      console.log('Reset password for:', data.email);
      // Show success message and navigate back to login
      alert('Password reset link sent to your email');
      router.replace('/');
    } catch (error) {
      console.error('Password reset failed', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background py-4">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1">
          <View className="p-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 p-2"
            >
              <ArrowLeft size={20} color="#1e293b" />
            </TouchableOpacity>

            <Text className="mb-2 text-3xl font-bold text-gray-900">
              Reset Password
            </Text>
            <Text className="mb-8 text-base text-gray-600">
              Enter your email to receive a password reset link
            </Text>

            <View className="space-y-6">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email"
                    placeholder="Enter your email"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.email?.message}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    leftIcon={<Mail size={20} color="#64748b" />}
                  />
                )}
              />

              <Button onPress={handleSubmit(onSubmit)} variant="default">
                Send Reset Link
              </Button>

              <TouchableOpacity
                onPress={() => router.replace('/(auth)/login')}
                className="mt-4"
              >
                <Text className="text-primary-600 text-center font-medium">
                  Back to Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
