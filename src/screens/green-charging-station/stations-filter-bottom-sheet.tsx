import { EPlugType } from "@/services/service.green-charging-stations";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { PanResponder, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGreenChargingStationsContext } from "./context";
import { styles } from "./stations-filter-bottom-sheet.styles";

function getLeafSaturationColor(percent: number): string {
  const saturation = Math.round(15 + (percent / 100) * 65);
  const lightness = Math.round(62 - (percent / 100) * 32);
  return `hsl(182, ${saturation}%, ${lightness}%)`;
}

export function StationsFilterBottomSheet() {
  const { bottom } = useSafeAreaInsets();
  const {
    showFilterModal,
    setShowFilterModal,
    stationsFilter,
    setStationsFilter,
  } = useGreenChargingStationsContext();
  const [localPlugType, setLocalPlugType] = useState<EPlugType | undefined>(
    stationsFilter.plugType,
  );
  const [localPercent, setLocalPercent] = useState<number>(
    stationsFilter.renewableEnergyPercent ?? 0,
  );

  useEffect(() => {
    if (showFilterModal) {
      setLocalPlugType(stationsFilter.plugType);
      setLocalPercent(stationsFilter.renewableEnergyPercent ?? 0);
    }
  }, [showFilterModal, stationsFilter]);

  const handleClose = () => setShowFilterModal(false);

  const handleReset = () => {
    setLocalPlugType(undefined);
    setLocalPercent(0);
  };

  const handleApply = () => {
    setStationsFilter({
      plugType: localPlugType,
      renewableEnergyPercent: localPercent > 0 ? localPercent : undefined,
    });
    setShowFilterModal(false);
  };

  // Slider geometry & PanResponder
  const [trackWidth, setTrackWidth] = useState(0);
  const trackWidthRef = useRef(0);
  trackWidthRef.current = trackWidth;

  // Store percentage at start of touch
  const startPercentRef = useRef(0);

  const sliderPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      // 1. CRITICAL: Stops react-native-modal from stealing the gesture
      onPanResponderTerminationRequest: () => false,

      // 2. On initial tap: jump to tap location
      onPanResponderGrant: (evt) => {
        if (trackWidthRef.current <= 0) return;
        const touchX = Math.min(
          Math.max(0, evt.nativeEvent.locationX),
          trackWidthRef.current,
        );
        const percent = Math.round((touchX / trackWidthRef.current) * 100);
        startPercentRef.current = percent;
        setLocalPercent(percent);
      },

      // 3. On drag: smoothly add drag delta (dx)
      onPanResponderMove: (_, gestureState) => {
        if (trackWidthRef.current <= 0) return;
        const deltaPercent = (gestureState.dx / trackWidthRef.current) * 100;
        const newPercent = Math.round(
          Math.min(Math.max(0, startPercentRef.current + deltaPercent), 100),
        );
        setLocalPercent(newPercent);
      },
    }),
  ).current;

  const leafColor = getLeafSaturationColor(localPercent);

  return (
    <Modal
      isVisible={showFilterModal}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      backdropOpacity={0.2}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      animationOutTiming={250}
      swipeDirection={["down"]}
      onSwipeComplete={handleClose}
      style={styles.modal}>
      <View style={[styles.container, { paddingBottom: Math.max(bottom, 20) }]}>
        {/* Pill Handle */}
        <View style={styles.pillContainer}>
          <View style={styles.pill} />
        </View>

        {/* Modal Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filter Stations</Text>
          <TouchableOpacity onPress={handleReset} activeOpacity={0.7}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Plug Type Filter */}
        <Text style={styles.sectionLabel}>Connector Type</Text>
        <View style={styles.chipsRow}>
          <TouchableOpacity
            style={[
              styles.chip,
              localPlugType === undefined && styles.chipSelected,
            ]}
            onPress={() => setLocalPlugType(undefined)}>
            <Text
              style={[
                styles.chipText,
                localPlugType === undefined && styles.chipTextSelected,
              ]}>
              All Types
            </Text>
          </TouchableOpacity>

          {Object.values(EPlugType).map((type) => {
            const isSelected = localPlugType === type;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => setLocalPlugType(type)}>
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextSelected,
                  ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 3. Renewable Energy Slider */}
        <View style={styles.sliderHeaderRow}>
          <Text style={styles.sectionLabel}>Min. Renewable Energy</Text>
          <Text style={[styles.sliderValueText, { color: leafColor }]}>
            {localPercent === 0 ? "Any %" : `≥ ${localPercent}%`}
          </Text>
        </View>

        <View style={styles.sliderControlWrapper}>
          {/* Saturated Leaf Icon */}
          <View style={styles.leafIconContainer}>
            <MaterialIcons
              name="energy-savings-leaf"
              size={30}
              color={leafColor}
            />
          </View>

          {/* Interactive Slider Track */}
          <View
            style={styles.sliderTrackContainer}
            onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
            {...sliderPanResponder.panHandlers}>
            {/* Background Grey Bar */}
            <View style={styles.sliderTrackBackground} pointerEvents="none" />

            {/* Filled Teal Bar */}
            <View
              pointerEvents="none" // 👈 Prevents child from intercepting touch
              style={[
                styles.sliderTrackFilled,
                { width: `${localPercent}%`, backgroundColor: leafColor },
              ]}
            />

            {/* Draggable Thumb */}
            <View
              pointerEvents="none" // 👈 Prevents thumb from resetting touch coordinates
              style={[
                styles.sliderThumb,
                {
                  left:
                    trackWidth > 0 ? (localPercent / 100) * trackWidth - 12 : 0,
                  borderColor: leafColor,
                },
              ]}
            />
          </View>
        </View>

        {/* 4. Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.applyButton}
            activeOpacity={0.85}
            onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
