import { Dimensions, StyleSheet } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CAROUSEL_WIDTH = SCREEN_WIDTH - 40;

export const THEME_COLOR = "#009369";
export const THEME_COLOR_LIGHT = "#E6F5F0";

export const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  pillContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  pill: {
    backgroundColor: "#D1D5DB",
    width: 44,
    height: 5,
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
  },
  centerName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 19,
  },
  ecoBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },

  /* Carousel */
  carouselContainer: {
    position: "relative",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#F3F4F6",
  },
  carouselImage: {
    width: CAROUSEL_WIDTH,
    height: 180,
    borderRadius: 14,
  },
  counterBadge: {
    position: "absolute",
    bottom: 10,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  counterBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  /* Metrics Row */
  metricsRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F3F4F6",
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metricText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },

  /* Waste Types Chips */
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },

  /* PDF Info Sheets List */
  infoSheetsList: {
    gap: 10,
  },
  pdfCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  pdfLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  pdfIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#FEE2E2", // Soft red badge for PDF
    justifyContent: "center",
    alignItems: "center",
  },
  pdfTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  pdfSubText: {
    fontSize: 12,
    color: "#6B7280",
  },
  openIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME_COLOR_LIGHT,
    justifyContent: "center",
    alignItems: "center",
  },

  /* Action Button */
  actionButton: {
    backgroundColor: THEME_COLOR,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 24,
    gap: 8,
    elevation: 3,
    shadowColor: THEME_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

export { CAROUSEL_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH };
