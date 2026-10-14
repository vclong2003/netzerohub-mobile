import { EPollutionReportStatus } from "@/services/service.pollution-report";
import { StyleSheet } from "react-native";

export const STATUS_CONFIG: Record<
  EPollutionReportStatus,
  { label: string; bg: string; text: string }
> = {
  [EPollutionReportStatus.Pending]: {
    label: "Pending Review",
    bg: "#FEF3C7",
    text: "#D97706",
  },
  [EPollutionReportStatus.Acknowledged]: {
    label: "Acknowledged",
    bg: "#E0F2FE",
    text: "#0284C7",
  },
  [EPollutionReportStatus.Processed]: {
    label: "Under Investigation",
    bg: "#E6F4F1",
    text: "#128085",
  },
  [EPollutionReportStatus.Resolved]: {
    label: "Resolved",
    bg: "#D1FAE5",
    text: "#059669",
  },
  [EPollutionReportStatus.Rejected]: {
    label: "Rejected",
    bg: "#FEE2E2",
    text: "#DC2626",
  },
};

export const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#F3F4F6",
  },
  cardBody: {
    padding: 16,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F4F1",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    gap: 4,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#128085",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#F3F4F6",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    flex: 1,
    marginRight: 8,
  },
  locationText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },
  dateText: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
  emptyContainer: {
    paddingTop: 80,
    alignItems: "center",
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
  },
  emptySubText: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
