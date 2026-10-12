import { Header } from "@/components/header";
import {
  IPollutionReportItem,
  PollutionReportQueries,
} from "@/services/service.pollution-report";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import dayjs from "dayjs";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { STATUS_CONFIG, styles } from "./index.styles";

export function PollutionReportHistory() {
  const { bottom, top } = useSafeAreaInsets();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = PollutionReportQueries.useGetMyReports(6);

  const reports = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderItem = ({ item }: { item: IPollutionReportItem }) => {
    const statusTheme = STATUS_CONFIG[item.status];

    return (
      <View style={styles.card}>
        {/* image ----------------------------------------- */}
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.cardImage}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={200}
          />
        ) : null}

        <View style={styles.cardBody}>
          {/* badge --------------------------------------- */}
          <View style={styles.badgeRow}>
            <View style={styles.typeBadge}>
              <FontAwesome6 name="tag" size={10} color="#128085" />
              <Text style={styles.typeBadgeText}>{item.type}</Text>
            </View>

            <View
              style={[styles.statusBadge, { backgroundColor: statusTheme.bg }]}>
              <Text
                style={[styles.statusBadgeText, { color: statusTheme.text }]}>
                {statusTheme.label}
              </Text>
            </View>
          </View>

          {/* title desc ---------------------------------- */}
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.cardFooter}>
            {/* location ---------------------------------- */}
            {item.address ? (
              <View style={styles.locationContainer}>
                <MaterialIcons name="place" size={14} color="#6B7280" />
                <Text style={styles.locationText} numberOfLines={1}>
                  {item.address}
                </Text>
              </View>
            ) : (
              <View />
            )}

            {/* created ----------------------------------- */}
            <Text style={styles.dateText}>
              {dayjs(item.createdAt).format("DD MMM YYYY, h:mm A")}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB", paddingTop: top }}>
      <Header
        title="Your Pollution Reports"
        backButtonVisible
        onBackButtonPress={router.back}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#128085" />
          <Text style={styles.loadingText}>Loading your reports...</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Math.max(bottom, 20) },
          ]}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#128085"
            />
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#128085" />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome6 name="clipboard-list" size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No Reports Submitted</Text>
              <Text style={styles.emptySubText}>
                You haven't reported any environmental pollution yet.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
