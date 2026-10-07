import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { AuthMutations } from "@/services/service.auth";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { LogBox, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

export default function Verification() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { mutate: verifyAccount, isPending } = AuthMutations.useVerifyAccount();

  const [codes, onChangeCodes] = useState<string>("");

  if (!email) return <Redirect href="/" />;

  const onVerify = (otp: string) => {
    if (!email) return;
    verifyAccount(
      { email, otp },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Account verified successfully",
          });
          router.replace({
            pathname: "/auth/login",
            params: { email },
          });
        },
      },
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header onBackButtonPress={router.back} backButtonVisible />
      <View style={{ height: 52 }} />
      <KeyboardAwareScrollView style={styles.wrapper}>
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>
          Enter the code sent to your email {email}
        </Text>
        <OtpInput
          numberOfDigits={6}
          onTextChange={onChangeCodes}
          theme={{
            pinCodeContainerStyle: { borderRadius: 10 },
            focusedPinCodeContainerStyle: { borderColor: "#128085" },
            pinCodeTextStyle: { color: "#128085" },
            focusStickStyle: { backgroundColor: "#128085" },
          }}
        />
        <Button
          variant="green"
          text="Verify"
          onPress={() => onVerify(codes)}
          style={styles.button}
          disabled={isPending}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#128085",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#494949",
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});
