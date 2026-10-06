import { AuthStorage } from "@/auth/auth.utils";
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { TextInput } from "@/components/TextInput";
import { AuthMutations } from "@/services/service.auth";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import EmailSvg from "@/assets/svgs/Envelope.svg";
import EyeSvg from "@/assets/svgs/Eye.svg";
import PasswordSvg from "@/assets/svgs/Lock.svg";

export default function Login() {
  const { bottom } = useSafeAreaInsets();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const { mutate: login, isPending } = AuthMutations.useLogin();

  const onLoginSuccess = (data: AuthMutations.ILoginResponse) => {
    if (data?.accessToken) AuthStorage.setAccessToken(data.accessToken);
    if (data?.refreshToken) AuthStorage.setRefreshToken(data.refreshToken);
    router.replace("/(app)");
  };

  const submit = (data: AuthMutations.ILoginPayload) => {
    login(data, {
      onSuccess: onLoginSuccess,
      onError: (message) =>
        Toast.show({ type: "error", text1: "Login failed" }),
    });
  };

  const { control, handleSubmit } = useForm<AuthMutations.ILoginPayload>({
    values: {
      email: "",
      password: "",
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header onBackButtonPress={router.back} backButtonVisible />
      <View style={{ height: 52 }} />
      <KeyboardAwareScrollView style={styles.wrapper}>
        <Text style={styles.title}>Log in your Account</Text>
        <View style={{ height: 42 }} />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              preIcon={<EmailSvg width={24} height={24} />}
              placeholder="Email"
              defaultValue="vclong2003@gmail.com"
              keyboardType="email-address"
              textContentType="oneTimeCode"
              autoCapitalize="none"
            />
          )}
        />
        <View style={{ height: 8 }} />
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
              defaultValue="12345678"
            />
          )}
        />
        <View style={{ height: 12 }} />
        <Button
          variant="green"
          text="Log in"
          disabled={isPending}
          onPress={handleSubmit(submit)}
        />

        <View style={{ height: 24 }} />
        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
      </KeyboardAwareScrollView>
      <Text
        style={[styles.registerText, { bottom: bottom + 16 }]}
        onPress={() => navigation.navigate("Register")}>
        Don’t have an account?{" "}
        <Text style={styles.registerTextColored}>Sign up</Text>
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

  registerText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#0A0A0B",
    width: "100%",
    textAlign: "center",
  },
  registerTextColored: {
    color: "#FF5900",
  },
});
