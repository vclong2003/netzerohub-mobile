import ChevronLeft from "@/assets/svgs/ChevronLeft.svg";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Pressable } from "react-native-gesture-handler";

interface IHeaderProps {
  backButtonVisible?: boolean;
  onBackButtonPress?: () => void;

  title?: string;

  rightButtonIcon?: React.ReactNode;
  onRightButtonPress?: () => void;

  wrapperStyle?: ViewStyle;
}

export function Header({
  backButtonVisible,
  onBackButtonPress,
  rightButtonIcon,
  onRightButtonPress,
  title,
  wrapperStyle,
}: IHeaderProps) {
  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <Pressable style={styles.buttonWrapper} onPress={onBackButtonPress}>
        {backButtonVisible && <ChevronLeft width={24} height={24} />}
      </Pressable>

      <Text style={styles.title}>{title}</Text>

      <Pressable style={styles.buttonWrapper} onPress={onRightButtonPress}>
        {rightButtonIcon}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,

    display: "flex",
    flexDirection: "row",
    alignItems: "center",

    // backgroundColor: "#FFF",
  },

  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",

    textAlign: "center",
  },

  buttonWrapper: {
    width: 25,
    height: 25,
  },
});
