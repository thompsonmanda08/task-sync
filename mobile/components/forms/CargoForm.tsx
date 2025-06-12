import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { Package, Truck, ChevronRight } from 'lucide-react-native';

interface CargoFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export default function CargoForm({ onSubmit, isSubmitting }: CargoFormProps) {
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
    },
    pickupLocation: {
      city: '',
      address: '',
    },
    deliveryLocation: {
      city: '',
      address: '',
    },
    price: '',
  });

  const updateFormData = (key: string, value: string) => {
    if (key.includes('.')) {
      const [parentKey, childKey] = key.split('.');
      setFormData((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey as keyof typeof prev],
          [childKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      if (!formData.title || !formData.description) {
        alert('Please fill in all fields');
        return false;
      }
    } else if (currentStep === 2) {
      if (
        !formData.weight ||
        !formData.dimensions.length ||
        !formData.dimensions.width ||
        !formData.dimensions.height
      ) {
        alert('Please fill in all fields');
        return false;
      }
    } else if (currentStep === 3) {
      if (
        !formData.pickupLocation.city ||
        !formData.pickupLocation.address ||
        !formData.deliveryLocation.city ||
        !formData.deliveryLocation.address
      ) {
        alert('Please fill in all fields');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!formData.price) {
      alert('Please enter a price');
      return;
    }

    const processedData = {
      ...formData,
      weight: parseFloat(formData.weight),
      dimensions: {
        length: parseFloat(formData.dimensions.length),
        width: parseFloat(formData.dimensions.width),
        height: parseFloat(formData.dimensions.height),
      },
      price: parseFloat(formData.price),
    };

    onSubmit(processedData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <Text style={styles.stepTitle}>Cargo Details</Text>
            <Text style={styles.stepDescription}>Tell us about your cargo</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Office Furniture"
                value={formData.title}
                onChangeText={(text) => updateFormData('title', text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your cargo in detail"
                multiline
                numberOfLines={4}
                value={formData.description}
                onChangeText={(text) => updateFormData('description', text)}
              />
            </View>
          </>
        );

      case 2:
        return (
          <>
            <Text style={styles.stepTitle}>Cargo Measurements</Text>
            <Text style={styles.stepDescription}>
              Enter the dimensions and weight
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 50"
                keyboardType="numeric"
                value={formData.weight}
                onChangeText={(text) => updateFormData('weight', text)}
              />
            </View>

            <Text style={styles.inputLabel}>Dimensions (cm)</Text>

            <View style={styles.dimensionsRow}>
              <View
                style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}
              >
                <Text style={styles.dimensionLabel}>Length</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  keyboardType="numeric"
                  value={formData.dimensions.length}
                  onChangeText={(text) =>
                    updateFormData('dimensions.length', text)
                  }
                />
              </View>

              <View
                style={[
                  styles.inputContainer,
                  { flex: 1, marginHorizontal: 4 },
                ]}
              >
                <Text style={styles.dimensionLabel}>Width</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  keyboardType="numeric"
                  value={formData.dimensions.width}
                  onChangeText={(text) =>
                    updateFormData('dimensions.width', text)
                  }
                />
              </View>

              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.dimensionLabel}>Height</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  keyboardType="numeric"
                  value={formData.dimensions.height}
                  onChangeText={(text) =>
                    updateFormData('dimensions.height', text)
                  }
                />
              </View>
            </View>
          </>
        );

      case 3:
        return (
          <>
            <Text style={styles.stepTitle}>Pickup & Delivery</Text>
            <Text style={styles.stepDescription}>
              Where should the cargo be picked up and delivered?
            </Text>

            <View style={styles.locationSection}>
              <View style={styles.locationHeader}>
                <View
                  style={[styles.locationDot, { backgroundColor: '#2196F3' }]}
                />
                <Text style={styles.locationTitle}>Pickup Location</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>City</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Nairobi"
                  value={formData.pickupLocation.city}
                  onChangeText={(text) =>
                    updateFormData('pickupLocation.city', text)
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 123 Kimathi St, CBD"
                  value={formData.pickupLocation.address}
                  onChangeText={(text) =>
                    updateFormData('pickupLocation.address', text)
                  }
                />
              </View>
            </View>

            <View style={styles.locationSection}>
              <View style={styles.locationHeader}>
                <View
                  style={[styles.locationDot, { backgroundColor: '#4D5DFA' }]}
                />
                <Text style={styles.locationTitle}>Delivery Location</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>City</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Mombasa"
                  value={formData.deliveryLocation.city}
                  onChangeText={(text) =>
                    updateFormData('deliveryLocation.city', text)
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 456 Nyali Rd, Nyali"
                  value={formData.deliveryLocation.address}
                  onChangeText={(text) =>
                    updateFormData('deliveryLocation.address', text)
                  }
                />
              </View>
            </View>
          </>
        );

      case 4:
        return (
          <>
            <Text style={styles.stepTitle}>Set Your Price</Text>
            <Text style={styles.stepDescription}>
              How much are you willing to pay for this transport?
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Price (KSh)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 5000"
                keyboardType="numeric"
                value={formData.price}
                onChangeText={(text) => updateFormData('price', text)}
              />
            </View>

            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Summary</Text>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Cargo Type:</Text>
                <Text style={styles.summaryValue}>{formData.title}</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Weight:</Text>
                <Text style={styles.summaryValue}>{formData.weight} kg</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Route:</Text>
                <Text style={styles.summaryValue}>
                  {formData.pickupLocation.city} →{' '}
                  {formData.deliveryLocation.city}
                </Text>
              </View>
            </View>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4].map((s) => (
          <View key={s} style={styles.progressItem}>
            <View
              style={[
                styles.progressDot,
                s <= currentStep
                  ? styles.progressActive
                  : styles.progressInactive,
              ]}
            />
            {s < 4 && (
              <View
                style={[
                  styles.progressLine,
                  s < currentStep
                    ? styles.progressActive
                    : styles.progressInactive,
                ]}
              />
            )}
          </View>
        ))}
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderStep()}
      </ScrollView>

      <View style={styles.buttonsContainer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={prevStep}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        {currentStep < 4 ? (
          <TouchableOpacity
            style={[
              styles.baseButton,
              {
                backgroundColor: '#4D5DFA',
                marginLeft: currentStep > 1 ? 8 : 0,
              },
            ]}
            onPress={nextStep}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <ChevronRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.baseButton,
              {
                backgroundColor: isSubmitting ? '#FFB74D' : '#4D5DFA',
                marginLeft: 8,
              },
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Posting...' : 'Post Cargo'}
            </Text>
            {!isSubmitting && <Truck size={20} color="#FFFFFF" />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  progressLine: {
    width: 30,
    height: 2,
    marginHorizontal: 4,
  },
  progressActive: {
    backgroundColor: '#4D5DFA',
  },
  progressInactive: {
    backgroundColor: '#E0E0E0',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#616161',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#212121',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  dimensionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dimensionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#616161',
    marginBottom: 8,
  },
  locationSection: {
    marginBottom: 24,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  summaryContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#757575',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
  },
  buttonsContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  backButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#616161',
  },
  baseButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 4,
  },
});
