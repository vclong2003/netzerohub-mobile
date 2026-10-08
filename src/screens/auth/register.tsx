import { Header } from "@/components/header";
import { TextInput } from "@/components/text-input";
import { AuthMutations } from "@/services/service.auth";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import EmailSvg from "@/assets/svgs/Envelope.svg";
import EyeSvg from "@/assets/svgs/Eye.svg";
import PasswordSvg from "@/assets/svgs/Lock.svg";

import { Button } from "@/components/button";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

export function Register() {
  const { mutate: register, isPending } = AuthMutations.useRegister();

  const { bottom } = useSafeAreaInsets();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const { control, handleSubmit } = useForm<AuthMutations.IRegisterPayload>({
    values: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const onSubmit = async (data: AuthMutations.IRegisterPayload) => {
    register(data, {
      onSuccess: () => {
        router.replace({
          pathname: "/auth/verify",
          params: { email: data.email },
        });
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: error.message,
        });
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header onBackButtonPress={router.back} backButtonVisible />
      <View style={{ height: 52 }} />
      <KeyboardAwareScrollView style={styles.wrapper}>
        <Text style={styles.title}>Create your Account</Text>
        <View style={{ height: 42 }} />

        {/* FirstName ------------------------------------------------ */}
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              placeholder="First Name"
            />
          )}
        />
        <View style={{ height: 10 }} />

        {/* LastName ------------------------------------------------ */}
        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              placeholder="Last Name"
            />
          )}
        />
        <View style={{ height: 10 }} />

        {/* Phone --------------------------------------------------- */}
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              placeholder="Phone Number"
              keyboardType="phone-pad"
            />
          )}
        />
        <View style={{ height: 10 }} />

        {/* Email --------------------------------------------------- */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              preIcon={<EmailSvg width={24} height={24} />}
              placeholder="Email"
              keyboardType="email-address"
              textContentType="oneTimeCode"
              autoCapitalize="none"
            />
          )}
        />
        <View style={{ height: 10 }} />

        {/* Password ------------------------------------------------ */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              blurOnSubmit={false}
              secureTextEntry={!isPasswordVisible}
              onChangeText={onChange}
              value={value}
              preIcon={<PasswordSvg width={24} height={24} />}
              postIcon={
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <EyeSvg width={20} height={20} />
                </TouchableOpacity>
              }
              placeholder="Password"
            />
          )}
        />
        <View style={{ height: 24 }} />

        <Button
          variant="green"
          text="Continue"
          disabled={isPending}
          onPress={handleSubmit(onSubmit)}
        />
      </KeyboardAwareScrollView>
      <Text
        style={[styles.loginText, { bottom: bottom + 16 }]}
        onPress={() => router.push("/auth/login")}>
        Already have an account?{" "}
        <Text style={styles.loginTextColored}>Log in</Text>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 40,
    fontWeight: "700",
    color: "#128085",
  },

  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#FF5900",

    textAlign: "center",
  },

  dividerWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,

    marginBottom: 32,
    marginTop: 32,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: "400",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#9F9C9C",
  },

  oauthButtonWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },

  loginText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#0A0A0B",
    width: "100%",
    textAlign: "center",
  },
  loginTextColored: {
    color: "#FF5900",
  },
});
