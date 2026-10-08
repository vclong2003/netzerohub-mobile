import { AuthStorage } from "@/auth/auth.utils";
import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { AuthQueries } from "@/services/service.auth";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import AvatarPlaceHolder from "@/assets/images/Profile.png";
import CaretRightBlackSvg from "@/assets/svgs/CaretRightBlack.svg";
import { router } from "expo-router";

export function MyHub() {
  const queryClient = useQueryClient();
  const { data: me } = AuthQueries.useMyAccount();

  const logout = async () => {
    queryClient.clear();
    AuthStorage.clearAuthStorage();
    router.replace("/auth");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="My NetZero Hub" />
      <View style={styles.wrapper}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={{ height: 8 }} />
        <View style={styles.accountWrapper}>
          <Image
            source={me?.avatarUrl ? { uri: me?.avatarUrl } : AvatarPlaceHolder}
            style={styles.avatar}
            contentFit="cover"
          />
          <View style={styles.accountTextsWrapper}>
            <Text style={styles.userNameText}>
              {me?.firstName} {me?.lastName}
            </Text>
            <Text style={styles.userInfoText}>{me?.email}</Text>
          </View>
          <Button
            variant="gray"
            preIcon={<CaretRightBlackSvg width={16} height={16} />}
            style={styles.button}
            onPress={() => router.push("/update-account")}
          />
        </View>
        <View style={{ height: 32 }} />
        <ScrollView style={styles.settingListWrapper}>
          {/* Notification ------------------------------------------------ */}
          {/* <View style={styles.settingItem}>
            <View style={styles.settingItemRow}>
              <BellSvg width={24} height={24} />
              <Text style={styles.settingItemText}>Notification</Text>
            </View>
            <Button
              variant="gray"
              preIcon={<CaretRightBlackSvg width={16} height={16} />}
              style={styles.button}
              // onPress={() => navigate("Settings__Notification")}
            />
          </View> */}

          {/* Vehicle List -------------------------------------------------- */}
          <View style={styles.settingItem}>
            <View style={styles.settingItemRow}>
              <FontAwesome5 name="history" size={20} color="black" />
              <Text style={styles.settingItemText}>
                Pollution Report History
              </Text>
            </View>
            <Button
              variant="gray"
              preIcon={<CaretRightBlackSvg width={16} height={16} />}
              style={styles.button}
              // onPress={() => navigate("Settings__Vehicle_List")}
            />
          </View>

          {/* Vehicle List -------------------------------------------------- */}
          <View style={styles.settingItem}>
            <View style={styles.settingItemRow}>
              <Entypo name="text-document" size={22} color="black" />
              <Text style={styles.settingItemText}>Terms & Conditions</Text>
            </View>
            <Button
              variant="gray"
              preIcon={<CaretRightBlackSvg width={16} height={16} />}
              style={styles.button}
              // onPress={() => navigate("Settings__Vehicle_List")}
            />
          </View>

          {/* Card List -------------------------------------------------- */}
          {/* <View style={styles.settingItem}>
            <View style={styles.settingItemRow}>
              <CardBlackSvg width={24} height={24} />
              <Text style={styles.settingItemText}>My Cards</Text>
            </View>
            <Button
              variant="gray"
              preIcon={<CaretRightBlackSvg width={16} height={16} />}
              style={styles.button}
              // onPress={() => navigate("Settings__SavedCards_List")}
            />
          </View> */}
        </ScrollView>
      </View>
      <Button
        variant="gray"
        text="Log out"
        style={styles.logoutButton}
        onPress={logout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },

  button: {
    width: 36,
    height: 36,
  },

  accountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 55 / 2,
  },
  accountTextsWrapper: {
    flex: 1,
    flexDirection: "column",
    marginHorizontal: 10,
    gap: 6,
  },
  userNameText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#128085",
  },
  userInfoText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#000",
  },

  settingListWrapper: {
    flexDirection: "column",
    flex: 1,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 8,
  },
  settingItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingItemText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },

  logoutButton: {
    position: "absolute",
    bottom: 120,
    left: 16,
    right: 16,
  },
});
