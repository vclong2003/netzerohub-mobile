import LockSvg from "@/assets/svgs/Lock.svg";
import { Button } from "@/components/button";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function IntroScreen() {
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={{ height: 52 }} />
      <Text style={styles.title}>Let you in</Text>
      <View style={{ height: 32 }} />

      <Button
        style={styles.button}
        variant="gray"
        preIcon={<LockSvg width={24} height={24} />}
        text="Continue with password"
        onPress={() => router.push("/auth/login")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    alignItems: "center",

    paddingHorizontal: 16,
  },

  title: {
    fontSize: 40,
    fontWeight: "700",
    color: "rgba(18, 128, 133, 1)",
  },

  button: {
    backgroundColor: "rgba(240, 240, 240, 1)",
    borderRadius: 6,
    width: "100%",
  },
});
