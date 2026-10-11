import {
  EPlugStatus,
  EPlugType,
  GreenChargingStationsQueries,
} from "@/services/service.green-charging-stations";
import {
  getDirection,
  openInGoogleMaps,
  reverseGeocode,
} from "@/utils/utils.location";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import * as Location from "expo-location";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGreenChargingStationsContext } from "./context";
import {
  CAROUSEL_WIDTH,
  SCREEN_HEIGHT,
  STATUS_STYLES,
  styles,
} from "./station-bottom-sheet.styles";

export function StationBottomSheet() {
  const { selectedStationId, setSelectedStationId } =
    useGreenChargingStationsContext();
  const { bottom } = useSafeAreaInsets();

  const [address, setAddress] = useState("");
  const [distance, setDistance] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  const handleOnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const handleScrollTo = (p: any) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState<
    number | null
  >(null);

  const { data: station, isPending } =
    GreenChargingStationsQueries.useGetStationById(selectedStationId);

  useEffect(() => {
    setScrollOffset(0);
    setActiveCarouselIndex(0);
    setFullscreenImageIndex(null);
  }, [selectedStationId]);

  useEffect(() => {
    if (!station) return setAddress("");
    reverseGeocode({
      lat: station.latitude,
      lon: station.longitude,
    }).then(setAddress);
  }, [station]);

  useEffect(() => {
    if (!station) return;
    (async () => {
      const pos = await Location.getLastKnownPositionAsync();
      if (!pos) return;

      const direction = await getDirection({
        source: { lat: pos.coords.latitude, lon: pos.coords.longitude },
        destination: { lat: station.latitude, lon: station.longitude },
      });
      setDistance(direction?.distance || 0);
    })();
  }, [station]);

  const plugSummary = useMemo(() => {
    if (!station?.plugs) return [];
    const map: Record<
      string,
      { type: EPlugType; total: number; available: number }
    > = {};

    station.plugs.forEach((p) => {
      if (!map[p.type]) {
        map[p.type] = { type: p.type, total: 0, available: 0 };
      }
      map[p.type].total += 1;
      if (p.status === EPlugStatus.Available) {
        map[p.type].available += 1;
      }
    });

    return Object.values(map);
  }, [station?.plugs]);

  const handleClose = () => {
    setSelectedStationId(undefined);
  };

  const handleCarouselScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.x;
    const index = Math.round(offset / CAROUSEL_WIDTH);
    setActiveCarouselIndex(index);
  };

  return (
    <Modal
      isVisible={!!selectedStationId}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      backdropOpacity={0.1}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      animationOutTiming={250}
      swipeDirection={["down"]}
      onSwipeComplete={handleClose}
      scrollTo={handleScrollTo}
      scrollOffset={scrollOffset}
      scrollOffsetMax={400}
      propagateSwipe={true}
      style={styles.modal}>
      <View
        style={[
          styles.container,
          {
            height: SCREEN_HEIGHT * 0.85,
            paddingBottom: Math.max(bottom, 16),
          },
        ]}>
        {/* Pill ------------------------------------------ */}
        <View style={styles.pillContainer}>
          <View style={styles.pill} />
        </View>

        {isPending ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color="#128085" />
          </View>
        ) : station ? (
          <ScrollView
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={16}
            bounces={false}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            {/* Header ------------------------------------ */}
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <Text style={styles.stationName} numberOfLines={1}>
                  {station.name}
                </Text>
                <Text style={styles.addressText} numberOfLines={2}>
                  {address || "Loading address..."}
                </Text>
              </View>

              <View style={styles.renewableBadge}>
                <MaterialIcons
                  name="energy-savings-leaf"
                  size={16}
                  color="#128085"
                />
                <Text style={styles.renewableText}>
                  {station.renewableEnergyPercent}% Green
                </Text>
              </View>
            </View>

            {/* Images ------------------------------------ */}
            {station.imageUrls && station.imageUrls.length > 0 && (
              <View style={styles.carouselContainer}>
                <FlatList
                  data={station.imageUrls}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleCarouselScroll}
                  scrollEventThrottle={16}
                  keyExtractor={(_, index) => `img-${index}`}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => setFullscreenImageIndex(index)}>
                      <Image
                        source={{ uri: item }}
                        style={styles.carouselImage}
                        contentFit="cover"
                        transition={200}
                      />
                    </TouchableOpacity>
                  )}
                />
                {station.imageUrls.length > 1 && (
                  <View style={styles.counterBadge}>
                    <Text style={styles.counterBadgeText}>
                      {activeCarouselIndex + 1} / {station.imageUrls.length}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Station brief ----------------------------- */}
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <MaterialIcons name="near-me" size={18} color="#128085" />
                <Text style={styles.metricText}>
                  {distance < 1000
                    ? `${Math.round(distance)} m`
                    : `${(distance / 1000).toFixed(1)} km`}
                </Text>
              </View>

              <View style={styles.metricItem}>
                <FontAwesome6 name="bolt" size={15} color="#128085" />
                <Text style={styles.metricText}>
                  {
                    station.plugs.filter(
                      (p) => p.status === EPlugStatus.Available,
                    ).length
                  }
                  /{station.plugs.length} Plugs Free
                </Text>
              </View>
            </View>

            {/* Connector --------------------------------- */}
            <Text style={styles.sectionTitle}>Connector Types</Text>
            <View style={styles.summaryChipsContainer}>
              {plugSummary.map((summary) => (
                <View key={summary.type} style={styles.summaryChip}>
                  <Text style={styles.chipTypeText}>{summary.type}</Text>
                  <Text
                    style={[
                      styles.chipCountText,
                      {
                        color: summary.available > 0 ? "#128085" : "#DC2626",
                      },
                    ]}>
                    {summary.available}/{summary.total} Free
                  </Text>
                </View>
              ))}
            </View>

            {/* All Connectors ---------------------------- */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
              All Connectors ({station.plugs.length})
            </Text>
            <View style={styles.plugsList}>
              {station.plugs.map((plug) => {
                const statusInfo = STATUS_STYLES[plug.status];
                return (
                  <View key={plug.id} style={styles.plugCard}>
                    <View style={styles.plugHeader}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}>
                        <FontAwesome6
                          name="charging-station"
                          size={18}
                          color="#128085"
                        />
                        <Text style={styles.plugIdentifier}>
                          {plug.identifier || `Plug #${plug.id}`}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: statusInfo.bg },
                        ]}>
                        <Text
                          style={[
                            styles.statusText,
                            { color: statusInfo.text },
                          ]}>
                          {statusInfo.label}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.plugDetailsRow}>
                      <View style={styles.detailPill}>
                        <Text style={styles.detailPillText}>{plug.type}</Text>
                      </View>
                      <View style={styles.detailPill}>
                        <Text style={styles.detailPillText}>
                          {plug.currentType}
                        </Text>
                      </View>
                      <View style={styles.detailPill}>
                        <Text style={styles.detailPillText}>
                          {plug.powerKw} kW
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Open in map ------------------------------- */}
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.85}
              onPress={() =>
                openInGoogleMaps(station.latitude, station.longitude)
              }>
              <MaterialIcons name="directions" size={22} color="#FFF" />
              <Text style={styles.actionButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : null}
      </View>
    </Modal>
  );
}
