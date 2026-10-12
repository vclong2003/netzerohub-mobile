import AvatarPlaceHolder from "@/assets/images/Profile.png";
import NotePencil from "@/assets/svgs/NotePencil.svg";
import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { TextInput } from "@/components/text-input";
import { AuthMutations, AuthQueries } from "@/services/service.auth";
import { StorageMutations } from "@/services/service.storage";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { Asset, launchImageLibrary } from "react-native-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export function UpdateAccount() {
  const { bottom } = useSafeAreaInsets();
  const [avatar, setAvatar] = useState<Asset>();
  const { control, handleSubmit, reset } =
    useForm<AuthMutations.IUpdateAccountPayload>();

  const { data: me } = AuthQueries.useMyAccount();
  const { mutate: updateProfile, isPending } = AuthMutations.useUpdateAccount();
  const { isPending: isUploading, mutateAsync: uploadAvatar } =
    StorageMutations.useUploadFile();

  const openImagePicker = () => {
    launchImageLibrary({ mediaType: "photo", selectionLimit: 1 }).then(
      async ({ assets }) => {
        const asset = assets?.[0];
        if (!asset?.uri) return;
        setAvatar(asset);
      },
    );
  };

  const onSubmit = async (values: AuthMutations.IUpdateAccountPayload) => {
    let bucketUrl: string | undefined;
    if (avatar && avatar.uri && avatar.type && avatar.fileName) {
      try {
        const result = await uploadAvatar({
          file: { uri: avatar.uri, name: avatar.fileName, type: avatar.type },
        });

        bucketUrl = result?.bucketUrl;
      } catch (error) {
        console.error("Error uploading avatar:", error);
      }
    }
    updateProfile(
      { ...values, avatarUrl: bucketUrl },
      {
        onSuccess: router.back,
        onError: (error) => Toast.show({ type: "error", text1: error.message }),
      },
    );
  };

  useEffect(() => {
    if (!me) return;

    reset({
      firstName: me.firstName ?? "",
      lastName: me.lastName ?? "",
      phone: me.phone ?? "",
      avatarUrl: me.avatarUrl ?? "",
    });
  }, [me?.id, reset]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title="Update Profile"
        backButtonVisible
        onBackButtonPress={router.back}
      />
      <KeyboardAwareScrollView style={styles.wrapper}>
        <Controller
          control={control}
          name="avatarUrl"
          render={() => (
            <View
              style={{
                width: 100,
                height: 100,
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: 32,
                marginBottom: 32,
              }}>
              <Image
                source={
                  avatar
                    ? { uri: avatar.uri }
                    : me?.avatarUrl
                      ? { uri: me?.avatarUrl }
                      : AvatarPlaceHolder
                }
                contentFit="cover"
                style={{ width: "100%", height: "100%", borderRadius: 50 }}
              />
              <Button
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                }}
                variant="green"
                preIcon={<NotePencil width={16} height={16} />}
                onPress={openImagePicker}
              />
            </View>
          )}
        />

        {/* First name --------------------------------------------------------- */}
        <Text style={styles.fieldLabel}>First Name</Text>
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              placeholder="John"
            />
          )}
        />
        <View style={{ height: 10 }} />

        {/* Last name --------------------------------------------------------- */}
        <Text style={styles.fieldLabel}>Last Name</Text>
        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              placeholder="Doe"
            />
          )}
        />
        <View style={{ height: 10 }} />

        {/* Phone -------------------------------------------------------------- */}
        <Text style={styles.fieldLabel}>Phone</Text>
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              placeholder="5556667777"
              keyboardType="phone-pad"
            />
          )}
        />
      </KeyboardAwareScrollView>

      <Button
        onPress={handleSubmit(onSubmit)}
        disabled={isPending || isUploading}
        variant="green"
        text={isUploading || isPending ? "Saving..." : "Submit"}
        style={[styles.submitButton, { bottom: bottom + 16 }]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#555555",
  },
  submitButton: {
    position: "absolute",
    left: 16,
    right: 16,
  },
});
