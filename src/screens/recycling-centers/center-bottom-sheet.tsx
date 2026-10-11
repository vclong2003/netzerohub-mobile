import { getFileName } from "@/utils/utils.file";
import {
  getDirection,
  openInGoogleMaps,
  reverseGeocode,
} from "@/utils/utils.location";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import * as Location from "expo-location";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef, useState } from "react";
import {
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

enum EWasteType {
  EWaste = "E-Waste",
  Batteries = "Batteries",
  SoftPlastics = "Soft Plastics",
  PaperCardboard = "Paper & Cardboard",
  ScrapMetals = "Scrap Metals",
  Glass = "Glass Bottles & Jars",
  FluorescentTubes = "Fluorescent Tubes",
  Chemicals = "Household Chemicals",
}

interface IRecyclingCenter {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  imageUrls: string[];
  acceptedWasteTypes: EWasteType[];
  infoSheetUrls: string[];
  operatingHours: string;
}

export const MOCK_RECYCLING_CENTRES: IRecyclingCenter[] = [
  {
    id: 1,
    name: "Whytes Gully Resource Recovery Park",
    latitude: -34.4682,
    longitude: 150.8035,
    operatingHours: "Mon - Sun: 7:30 AM - 4:30 PM",
    imageUrls: [
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?q=80&w=800&auto=format&fit=crop",
    ],
    acceptedWasteTypes: [
      EWasteType.EWaste,
      EWasteType.Batteries,
      EWasteType.ScrapMetals,
      EWasteType.Chemicals,
      EWasteType.PaperCardboard,
    ],
    infoSheetUrls: [
      "https://netzero-s3.vclab.uk/netzerohub-api/0a43d537-26f6-4b2c-85fa-E-Waste_Disposal_Guidelines.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=86400",
      "https://netzero-s3.vclab.uk/netzerohub-api/84d6a43b-3272-4edd-aee2-Hazardous_Materials_Handling.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=86400",
    ],
  },
  {
    id: 2,
    name: "UOW Campus Eco-Drop Hub",
    latitude: -34.4042,
    longitude: 150.8772,
    operatingHours: "Mon - Fri: 8:00 AM - 6:00 PM",
    imageUrls: [
      "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=800&auto=format&fit=crop",
    ],
    acceptedWasteTypes: [
      EWasteType.Batteries,
      EWasteType.SoftPlastics,
      EWasteType.PaperCardboard,
      EWasteType.Glass,
    ],
    infoSheetUrls: [
      "https://netzero-s3.vclab.uk/netzerohub-api/1ef3357b-751f-4e53-9bde-Campus_Soft_Plastics_Guide.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=86400",
    ],
  },
];

export function CenterBottomSheet() {
  const { bottom } = useSafeAreaInsets();

  const { selectedCenterId, setSelectedCenterId } =
    useRecyclingCentersContext();
  const [address, setAddress] = useState("");
  const [distance, setDistance] = useState(0);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  // Pick from mock data
  const center: IRecyclingCenter | undefined = MOCK_RECYCLING_CENTRES.find(
    (c) => c.id === selectedCenterId,
  );

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

  // Reverse geocode
  useEffect(() => {
    if (!center) return setAddress("");
    reverseGeocode({
      lat: center.latitude,
      lon: center.longitude,
    }).then(setAddress);
  }, [center]);

  // Calculate distance
  useEffect(() => {
    if (!center) return;
    (async () => {
      const pos = await Location.getLastKnownPositionAsync();
      if (!pos) return;

      const direction = await getDirection({
        source: { lat: pos.coords.latitude, lon: pos.coords.longitude },
        destination: { lat: center.latitude, lon: center.longitude },
      });
      setDistance(direction?.distance || 0);
    })();
  }, [center]);

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

        {center ? (
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
                  {center.name}
                </Text>
                <Text style={styles.addressText} numberOfLines={2}>
                  {address || "Loading location..."}
                </Text>
              </View>

              <View style={styles.ecoBadge}>
                <FontAwesome6 name="recycle" size={20} color={THEME_COLOR} />
              </View>
            </View>

            {/* Images Carousel */}
            {center.imageUrls && center.imageUrls.length > 0 && (
              <View style={styles.carouselContainer}>
                <FlatList
                  data={center.imageUrls}
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
                {center.imageUrls.length > 1 && (
                  <View style={styles.counterBadge}>
                    <Text style={styles.counterBadgeText}>
                      {activeCarouselIndex + 1} / {center.imageUrls.length}
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
                <Text style={styles.metricText}>{center.operatingHours}</Text>
              </View>
            </View>

            {/* Accepted Waste Types */}
            <Text style={styles.sectionTitle}>Accepted Materials</Text>
            <View style={styles.chipsContainer}>
              {center.acceptedWasteTypes.map((type) => (
                <View key={type} style={styles.chip}>
                  <FontAwesome6 name="check" size={11} color={THEME_COLOR} />
                  <Text style={styles.chipText}>{type}</Text>
                </View>
              ))}
            </View>

            {/* 📄 S3 PDF Info Sheets Section */}
            {center.infoSheetUrls && center.infoSheetUrls.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                  Guidelines & Info Sheets (PDF)
                </Text>
                <View style={styles.infoSheetsList}>
                  {center.infoSheetUrls.map((url, index) => {
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
                openInGoogleMaps(center.latitude, center.longitude)
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
