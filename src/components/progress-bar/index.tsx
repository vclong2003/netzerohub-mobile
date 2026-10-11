import { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, StyleSheet } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BEAM_WIDTH = SCREEN_WIDTH * 0.4;

interface Props {
  isLoading: boolean;
  top?: number;
  marginHorizontal?: number;
}

export function ProgressBar({
  isLoading,
  top = 0,
  marginHorizontal = 0,
}: Props) {
  const anim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;

    if (isLoading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();

      loop = Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      );
      loop.start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        loop?.stop();
        anim.setValue(0);
      });
    }

    return () => {
      loop?.stop();
    };
  }, [isLoading]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-BEAM_WIDTH, SCREEN_WIDTH],
  });

  return (
    <Animated.View
      style={[
        styles.track,
        {
          top,
          left: marginHorizontal,
          right: marginHorizontal,
          opacity: fadeAnim,
        },
      ]}
      pointerEvents="none">
      <Animated.View
        style={[
          styles.beam,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  track: {
    position: "absolute",
    height: 3,
    backgroundColor: "rgba(18, 128, 133, 0.15)",
    overflow: "hidden",
    zIndex: 10,
  },
  beam: {
    width: BEAM_WIDTH,
    height: "100%",
    backgroundColor: "#128085",
    borderRadius: 2,
  },
});
