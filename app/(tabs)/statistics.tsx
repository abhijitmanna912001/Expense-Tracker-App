import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import TransactionList from "@/components/TransactionList";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import {
  fetchMonthlyStats,
  fetchWeeklyStats,
  fetchYearlyStats,
} from "@/services/statsService";
import { scale, verticalScale } from "@/utils/styling";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const Statistics = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { user } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const getWeeklyStats = useCallback(async () => {
    if (!user?.uid) return;

    setChartLoading(true);
    const res = await fetchWeeklyStats(user.uid);
    setChartLoading(false);

    if (res.success) {
      setChartData(res.data.stats);
      setTransactions(res.data.transactions);
    } else {
      Alert.alert("Error", res.msg);
    }
  }, [user?.uid]);

  const getMonthlyStats = useCallback(async () => {
    if (!user?.uid) return;

    setChartLoading(true);
    const res = await fetchMonthlyStats(user.uid);
    setChartLoading(false);

    if (res.success) {
      setChartData(res.data.stats);
      setTransactions(res.data.transactions);
    } else {
      Alert.alert("Error", res.msg);
    }
  }, [user?.uid]);

  const getYearlyStats = useCallback(async () => {
    if (!user?.uid) return;

    setChartLoading(true);
    const res = await fetchYearlyStats(user.uid);
    setChartLoading(false);

    if (res.success) {
      setChartData(res.data.stats);
      setTransactions(res.data.transactions);
    } else {
      Alert.alert("Error", res.msg);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (activeIndex === 0) getWeeklyStats();
    if (activeIndex === 1) getMonthlyStats();
    if (activeIndex === 2) getYearlyStats();
  }, [activeIndex, getWeeklyStats, getMonthlyStats, getYearlyStats]);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View>
          <Header title="Statistics" />
        </View>

        <ScrollView
          contentContainerStyle={{
            gap: spacingY._20,
            paddingTop: spacingY._5,
            paddingBottom: verticalScale(100),
          }}
          showsVerticalScrollIndicator={false}
        >
          <SegmentedControl
            values={["Weekly", "Last 12 Months", "Yearly"]}
            selectedIndex={activeIndex}
            onChange={(event) => {
              setActiveIndex(event.nativeEvent.selectedSegmentIndex);
            }}
            tintColor={colors.neutral200}
            backgroundColor={colors.neutral800}
            appearance="dark"
            activeFontStyle={styles.segmentFontStyle}
            style={styles.segmentStyle}
            fontStyle={{ ...styles.segmentFontStyle, color: colors.white }}
          />

          <View style={styles.chartContainer}>
            {chartData.length > 0 ? (
              <BarChart
                data={chartData}
                barWidth={scale(12)}
                spacing={scale(16)}
                labelWidth={scale(40)}
                roundedTop
                roundedBottom
                hideRules
                yAxisLabelPrefix="$"
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisTextStyle={{ color: colors.neutral350 }}
                xAxisLabelTextStyle={{
                  color: colors.neutral350,
                  fontSize: verticalScale(12),
                  textAlign: "center",
                }}
                noOfSections={3}
                minHeight={5}
              />
            ) : (
              <View style={styles.noChart} />
            )}

            {chartLoading && (
              <View style={styles.chartLoadingContainer}>
                <Loading color={colors.white} />
              </View>
            )}
          </View>

          <View>
            <TransactionList
              title="Transactions"
              emptyListMessage="No transactions found"
              data={transactions}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
    gap: spacingY._10,
  },
  segmentFontStyle: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: colors.black,
  },
  segmentStyle: { height: scale(37) },
  searchIcon: {
    backgroundColor: colors.neutral700,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    height: verticalScale(35),
    width: verticalScale(35),
    borderCurve: "continuous",
  },
  noChart: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    height: verticalScale(210),
  },
  chartLoadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: radius._12,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  chartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
});
