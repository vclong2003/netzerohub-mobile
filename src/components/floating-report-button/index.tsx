import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const BUTTON_SIZE = 48;
const HORIZONTAL_MARGIN = 8;

export function FloatingReportButton({
  onReportPress,
}: {
  onReportPress?: () => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { left, bottom } = useSafeAreaInsets();

  const [menuSide, setMenuSide] = useState<{ isLeft: boolean; isTop: boolean }>(
    {
      isLeft: false,
      isTop: false,
    },
  );

  const lastOffset = useRef({
    x: HORIZONTAL_MARGIN,
    y: SCREEN_HEIGHT / 2 + 70,
  });

  const pan = useRef(new Animated.ValueXY(lastOffset.current)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 3 || Math.abs(gesture.dy) > 3,

      onPanResponderGrant: () => {
        pan.setOffset(lastOffset.current);
        pan.setValue({ x: 0, y: 0 });
      },

      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),

      onPanResponderRelease: (_, gesture) => {
        pan.flattenOffset();

        const minX = HORIZONTAL_MARGIN;
        const maxX = SCREEN_WIDTH - BUTTON_SIZE - HORIZONTAL_MARGIN;

        const clampedX = Math.min(
          Math.max(minX, lastOffset.current.x + gesture.dx),
          maxX,
        );
        const clampedY = Math.min(
          Math.max(60, lastOffset.current.y + gesture.dy),
          SCREEN_HEIGHT - 140,
        );

        lastOffset.current = { x: clampedX, y: clampedY };
        pan.setValue(lastOffset.current);

        const isLeft = clampedX < (SCREEN_WIDTH - BUTTON_SIZE) / 2;
        const isTop = clampedY < 180;
        setMenuSide({ isLeft, isTop });

        if (Math.abs(gesture.dx) < 6 && Math.abs(gesture.dy) < 6) {
          setIsMenuOpen((prev) => !prev);
        }
      },
    }),
  ).current;

  const handlePollutionReport = () => {
    setIsMenuOpen(false);
    onReportPress?.();
  };

  return (
    <>
      {/* Backdrop -------------------------------------------------- */}
      {isMenuOpen && (
        <Pressable
          style={styles.backdrop}
          onPress={() => setIsMenuOpen(false)}
        />
      )}

      {/* Container -------------------------------------------------  */}
      <Animated.View style={[styles.movableContainer, pan.getLayout()]}>
        {/* Popover */}
        {isMenuOpen && (
          <View
            style={[
              styles.menuContainer,
              menuSide.isLeft ? { left: 0 } : { right: 0 },
              menuSide.isTop
                ? { top: BUTTON_SIZE + 8 }
                : { bottom: BUTTON_SIZE + 8 },
            ]}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.menuItem}
              onPress={handlePollutionReport}>
              <MaterialIcons
                name="report-gmailerrorred"
                size={22}
                color="#E53E3E"
              />
              <Text style={styles.menuText}>Pollution Report</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Floating Btn */}
        <View {...panResponder.panHandlers} style={styles.fabButton}>
          <MaterialIcons
            name="report-gmailerrorred"
            size={26}
            color="#128085"
          />
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    zIndex: 998,
  },
  movableContainer: {
    position: "absolute",
    zIndex: 999,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
  },
  fabButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  menuContainer: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 8,
    minWidth: 170,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 8,
  },
  menuText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    // whiteSpace: "nowrap",
  },
});
