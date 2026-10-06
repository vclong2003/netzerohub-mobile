import { ActivityIndicator, StyleSheet, View } from "react-native";

export function LoadingScreen() {
  return (
    <View style={styles.wrapper}>
      <ActivityIndicator color="#FFF" size="large" />
    </View>
  );
}

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#128085",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
