import { RecyclingCentresQueries } from "@/services/service.recycling-centres";
import { getFileName } from "@/utils/utils.file";
import { getDirection, openInGoogleMaps } from "@/utils/utils.location";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import * as Location from "expo-location";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef, useState } from "react";
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
import {
  CAROUSEL_WIDTH,
  SCREEN_HEIGHT,
  styles,
  THEME_COLOR,
} from "./center-bottom-sheet.styles";
import { useRecyclingCentersContext } from "./context";

export function CenterBottomSheet() {
  const { bottom } = useSafeAreaInsets();

  const { selectedCenterId, setSelectedCenterId } =
    useRecyclingCentersContext();
  const { data: centre, isPending } =
    RecyclingCentresQueries.useGetRecyclingCentreById(selectedCenterId);

  const [distance, setDistance] = useState(0);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

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

  useEffect(() => {
    setScrollOffset(0);
    setActiveCarouselIndex(0);
  }, [selectedCenterId]);

  // Calculate distance
  useEffect(() => {
    if (!centre) return;
    (async () => {
      const pos = await Location.getLastKnownPositionAsync();
      if (!pos) return;

      const direction = await getDirection({
        source: { lat: pos.coords.latitude, lon: pos.coords.longitude },
        destination: { lat: centre.latitude, lon: centre.longitude },
      });
      setDistance(direction?.distance || 0);
    })();
  }, [centre]);

  // Open PDF in Chrome
  const handleOpenPdf = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url, {
        toolbarColor: THEME_COLOR,
        showTitle: true,
      });
    } catch (err) {
      console.warn("Could not open PDF in browser:", err);
    }
  };

  const handleClose = () => setSelectedCenterId(undefined);

  const handleCarouselScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.x;
    const index = Math.round(offset / CAROUSEL_WIDTH);
    setActiveCarouselIndex(index);
  };

  return (
    <Modal
      isVisible={!!selectedCenterId}
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
        {/* Pill Drag Handle */}
        <View style={styles.pillContainer}>
          <View style={styles.pill} />
        </View>

        {isPending && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={THEME_COLOR} />
          </View>
        )}
        {centre ? (
          <ScrollView
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={16}
            bounces={false}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <Text style={styles.centerName} numberOfLines={1}>
                  {centre.name}
                </Text>
                <Text style={styles.addressText} numberOfLines={2}>
                  {centre.address}
                </Text>
              </View>

              <View style={styles.ecoBadge}>
                <FontAwesome6 name="recycle" size={20} color={THEME_COLOR} />
              </View>
            </View>

            {/* Images Carousel */}
            {centre.imageUrls && centre.imageUrls.length > 0 && (
              <View style={styles.carouselContainer}>
                <FlatList
                  data={centre.imageUrls}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleCarouselScroll}
                  scrollEventThrottle={16}
                  keyExtractor={(_, index) => `img-${index}`}
                  renderItem={({ item }) => (
                    <Image
                      source={{ uri: item }}
                      style={styles.carouselImage}
                      contentFit="cover"
                      transition={200}
                    />
                  )}
                />
                {centre.imageUrls.length > 1 && (
                  <View style={styles.counterBadge}>
                    <Text style={styles.counterBadgeText}>
                      {activeCarouselIndex + 1} / {centre.imageUrls.length}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Metrics */}
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <MaterialIcons name="near-me" size={18} color={THEME_COLOR} />
                <Text style={styles.metricText}>
                  {distance < 1000
                    ? `${Math.round(distance)} m`
                    : `${(distance / 1000).toFixed(1)} km`}
                </Text>
              </View>

              <View style={styles.metricItem}>
                <MaterialIcons
                  name="access-time"
                  size={18}
                  color={THEME_COLOR}
                />
                <Text style={styles.metricText}>
                  {centre.openingTime.slice(0, 5)} -{" "}
                  {centre.closingTime.slice(0, 5)}
                </Text>
              </View>
            </View>

            {/* Accepted Waste Types */}
            <Text style={styles.sectionTitle}>Accepted Materials</Text>
            <View style={styles.chipsContainer}>
              {centre.acceptedWasteTypes.map((type) => (
                <View key={type.id} style={styles.chip}>
                  <FontAwesome6 name="check" size={11} color={THEME_COLOR} />
                  <Text style={styles.chipText}>{type.name}</Text>
                </View>
              ))}
            </View>

            {centre.infoSheetUrls && centre.infoSheetUrls.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                  Guidelines & Info Sheets (PDF)
                </Text>
                <View style={styles.infoSheetsList}>
                  {centre.infoSheetUrls.map((url, index) => {
                    const title = getFileName(url, index);
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.pdfCard}
                        activeOpacity={0.7}
                        onPress={() => handleOpenPdf(url)}>
                        <View style={styles.pdfLeft}>
                          <View style={styles.pdfIconContainer}>
                            <MaterialIcons
                              name="picture-as-pdf"
                              size={22}
                              color="#DC2626"
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.pdfTitle} numberOfLines={1}>
                              {title}
                            </Text>
                            <Text style={styles.pdfSubText}>
                              PDF Document • Tap to open
                            </Text>
                          </View>
                        </View>

                        {/* Clickable Chrome Open Icon */}
                        <View style={styles.openIconBtn}>
                          <MaterialIcons
                            name="open-in-new"
                            size={18}
                            color={THEME_COLOR}
                          />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}

            {/* Directions Button */}
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.85}
              onPress={() =>
                openInGoogleMaps(centre.latitude, centre.longitude)
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
