import { EPlugStatus } from "@/services/service.green-charging-stations";
import { Dimensions, StyleSheet } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CAROUSEL_WIDTH = SCREEN_WIDTH - 40;

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
  loadingWrapper: {
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
  stationName: {
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
  renewableBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F4F1",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    gap: 4,
  },
  renewableText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#128085",
  },

  /* Carousel Styles */
  carouselContainer: {
    position: "relative",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#F3F4F6",
  },
  carouselImage: {
    width: CAROUSEL_WIDTH,
    height: 200,
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
  summaryChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  summaryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
  },
  chipTypeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  chipCountText: {
    fontSize: 13,
    fontWeight: "700",
  },
  plugsList: {
    gap: 12,
  },
  plugCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  plugHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  plugIdentifier: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  plugDetailsRow: {
    flexDirection: "row",
    gap: 8,
  },
  detailPill: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  detailPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  actionButton: {
    backgroundColor: "#128085",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 24,
    gap: 8,
    elevation: 3,
    shadowColor: "#128085",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  fullscreenBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "center",
  },
  fullscreenHeader: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fullscreenCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  fullscreenCounter: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  fullscreenImageWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.75,
  },
});

const STATUS_STYLES: Record<
  EPlugStatus,
  { bg: string; text: string; label: string }
> = {
  [EPlugStatus.Available]: {
    bg: "#E6F4F1",
    text: "#128085",
    label: "Available",
  },
  [EPlugStatus.Occupied]: {
    bg: "#FEF3C7",
    text: "#D97706",
    label: "In Use",
  },
  [EPlugStatus.OutOfService]: {
    bg: "#FEE2E2",
    text: "#DC2626",
    label: "Out of Order",
  },
  [EPlugStatus.Faulted]: {
    bg: "#F3F4F6",
    text: "#6B7280",
    label: "Faulted",
  },
};

export { CAROUSEL_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH, STATUS_STYLES };
