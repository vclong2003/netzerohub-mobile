import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { TextInput } from "@/components/text-input";
import { reverseGeocode } from "@/utils/utils.location";
import { useActionSheet } from "@expo/react-native-action-sheet";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import {
  Asset,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from "react-native-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { styles } from "./index.style";

export enum EPollutionType {
  Litter = "LITTER",
  Land = "LAND",
  Water = "WATER",
  Air = "AIR",
  Noise = "NOISE",
}

const POLLUTION_TYPE_OPTIONS = [
  {
    label: "Litter & Dumping",
    value: EPollutionType.Litter,
    icon: "trash-can",
  },
  { label: "Land & Soil", value: EPollutionType.Land, icon: "mountain" },
  { label: "Water", value: EPollutionType.Water, icon: "water" },
  { label: "Air & Smoke", value: EPollutionType.Air, icon: "smog" },
  { label: "Noise", value: EPollutionType.Noise, icon: "volume-high" },
];

export interface IPollutionReportPayload {
  title: string;
  description: string;
  type: EPollutionType;
  image?: Asset;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export function PollutionReport() {
  const { bottom } = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();
  const [photo, setPhoto] = useState<Asset>();
  const [includeLocation, setIncludeLocation] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [displayAddress, setDisplayAddress] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IPollutionReportPayload>({
    defaultValues: {
      title: "",
      description: "",
      type: EPollutionType.Litter,
    },
  });

  const handleImageResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) return;

    if (response.errorCode) {
      Toast.show({
        type: "error",
        text1: "Camera Error",
        text2:
          response.errorMessage || "Permission denied or camera unavailable.",
      });
      return;
    }

    const asset = response.assets?.[0];
    if (asset?.uri) {
      setPhoto(asset);
      setValue("image", asset);
    }
  };

  const openCamera = () => {
    launchCamera(
      {
        mediaType: "photo",
        cameraType: "back",
        saveToPhotos: false,
        quality: 0.8,
      },
      handleImageResponse,
    );
  };

  const openLibrary = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        selectionLimit: 1,
        quality: 0.8,
      },
      handleImageResponse,
    );
  };

  const handlePickImage = () => {
    showActionSheetWithOptions(
      {
        options: ["Take Photo", "Choose from Library", "Cancel"],
        cancelButtonIndex: 2,
      },
      (selectedIndex) => {
        if (selectedIndex === 0) openCamera();
        if (selectedIndex === 1) openLibrary();
      },
    );
  };

  const handleRemoveImage = () => {
    setPhoto(undefined);
    setValue("image", undefined);
  };

  const handleToggleLocation = async () => {
    if (includeLocation) {
      setIncludeLocation(false);
      setDisplayAddress("");
      setValue("coordinates", undefined);
      return;
    }

    try {
      setIsLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Location Permission Denied",
          text2: "Please grant location access in device settings.",
        });
        setIsLocating(false);
        return;
      }

      const position =
        (await Location.getLastKnownPositionAsync()) ||
        (await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }));

      if (position) {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setValue("coordinates", coords);
        setIncludeLocation(true);

        const address = await reverseGeocode({
          lat: coords.latitude,
          lon: coords.longitude,
        });
        setDisplayAddress(address || "Location acquired");
      }
    } catch (err) {
      console.error("Error retrieving location:", err);
      Toast.show({
        type: "error",
        text1: "Failed to get current location",
      });
    } finally {
      setIsLocating(false);
    }
  };

  const onSubmit = async (values: IPollutionReportPayload) => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Mock Submitting Pollution Report Payload:", {
        ...values,
        imageFile: photo?.fileName,
      });

      Toast.show({
        type: "info",
        text1: "Report submitted, thank you!",
      });

      router.back();
    } catch {
      Toast.show({
        type: "error",
        text1: "Submission Failed",
        text2: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Header
        title="Report Pollution"
        backButtonVisible
        onBackButtonPress={router.back}
      />

      <KeyboardAwareScrollView
        style={styles.wrapper}
        contentContainerStyle={{ paddingBottom: bottom + 90 }}>
        {/* Title / Subject ------------------------------------------------ */}
        <Text style={styles.fieldLabel}>Subject / Title *</Text>
        <Controller
          control={control}
          name="title"
          rules={{ required: "Subject is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              placeholder="e.g. Illegal chemical dumping in creek"
            />
          )}
        />
        {errors.title && (
          <Text style={styles.errorText}>{errors.title.message}</Text>
        )}
        <View style={{ height: 16 }} />

        {/* Pollution Type Selection --------------------------------------- */}
        <Text style={styles.fieldLabel}>Pollution Type *</Text>
        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <View style={styles.typesGrid}>
              {POLLUTION_TYPE_OPTIONS.map((opt) => {
                const isSelected = value === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    activeOpacity={0.7}
                    onPress={() => onChange(opt.value)}
                    style={[
                      styles.typeChip,
                      isSelected && styles.typeChipSelected,
                    ]}>
                    <FontAwesome6
                      name={opt.icon}
                      size={13}
                      color={isSelected ? "#FFFFFF" : "#128085"}
                    />
                    <Text
                      style={[
                        styles.typeChipText,
                        isSelected && styles.typeChipTextSelected,
                      ]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        />
        <View style={{ height: 16 }} />

        {/* Description --------------------------------------------------- */}
        <Text style={styles.fieldLabel}>Description *</Text>
        <Controller
          control={control}
          name="description"
          rules={{ required: "Description is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              placeholder="Describe the incident, smell, color, and severity..."
            />
          )}
        />
        {errors.description && (
          <Text style={styles.errorText}>{errors.description.message}</Text>
        )}
        <View style={{ height: 18 }} />

        {/* Photo Attachment (Single) ------------------------------------- */}
        <Text style={styles.fieldLabel}>Evidence Photo (Optional)</Text>
        {photo?.uri ? (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: photo.uri }}
              style={styles.imagePreview}
              contentFit="cover"
            />
            <TouchableOpacity
              style={styles.removeImageBtn}
              onPress={handleRemoveImage}
              activeOpacity={0.8}>
              <MaterialIcons name="close" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.uploadPlaceholder}
            onPress={handlePickImage}
            activeOpacity={0.7}>
            <View style={styles.uploadIconBadge}>
              <MaterialIcons name="add-a-photo" size={22} color="#128085" />
            </View>
            <Text style={styles.uploadPlaceholderText}>
              Tap to attach an evidence photo
            </Text>
          </TouchableOpacity>
        )}
        <View style={{ height: 18 }} />

        {/* Current Location Checkbox ------------------------------------- */}
        <TouchableOpacity
          style={styles.locationCheckboxRow}
          onPress={handleToggleLocation}
          activeOpacity={0.7}
          disabled={isLocating}>
          <MaterialIcons
            name={includeLocation ? "check-box" : "check-box-outline-blank"}
            size={24}
            color={includeLocation ? "#128085" : "#8A8A8E"}
          />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.checkboxLabel}>Include current location</Text>
            {isLocating && (
              <View style={styles.locationLoadingRow}>
                <ActivityIndicator size="small" color="#128085" />
                <Text style={styles.locationSubText}>
                  Acquiring GPS coordinates...
                </Text>
              </View>
            )}
            {!isLocating && includeLocation && displayAddress ? (
              <View style={styles.locationAddressRow}>
                <MaterialIcons name="place" size={14} color="#128085" />
                <Text style={styles.locationAddressText} numberOfLines={2}>
                  {displayAddress}
                </Text>
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      {/* Submit Button --------------------------------------------------- */}
      <Button
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting || isLocating}
        variant="green"
        text={isSubmitting ? "Submitting Report..." : "Submit Report"}
        style={[styles.submitButton, { bottom: bottom + 16 }]}
      />
    </SafeAreaView>
  );
}
