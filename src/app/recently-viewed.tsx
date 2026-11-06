
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Car = {
  name: string;
  brand: string;
  year: string;
  price: string;
  image: string;
  viewedAt: number;
};

export default function RecentlyViewedScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const clearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all recently viewed cars?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("recentlyViewed");
            setCars([]);
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      const loadCars = async () => {
        try {
          const stored = await AsyncStorage.getItem("recentlyViewed");
          setCars(stored ? JSON.parse(stored) : []);
        } catch (error) {
          console.log("Loading Error:", error);
        } finally {
          setLoading(false);
        }
      };

      setLoading(true);
      loadCars();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Recently Viewed</Text>

      <Text style={styles.subtitle}>
        Cars you explored recently
      </Text>

      <Pressable
        style={styles.clearButton}
        onPress={clearHistory}
        disabled={cars.length === 0}
      >
        <Text style={styles.clearButtonText}>Clear History</Text>
      </Pressable>

      {loading ? (
        <Text style={styles.empty}>Loading...</Text>
      ) : (
        <FlatList
          data={cars}
          keyExtractor={(item, index) =>
            `${item.brand}-${item.name}-${index}`
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              No recently viewed cars yet.
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/details",
                  params: {
                    name: item.name,
                    brand: item.brand,
                    year: item.year,
                    price: item.price,
                    image: item.image,
                  },
                })
              }
            >
              <Image
                source={{ uri: item.image }}
                style={styles.image}
              />

              <View style={styles.info}>
                <Text style={styles.carName}>
                  {item.brand} {item.name}
                </Text>
                <Text style={styles.year}>
                  Year: {item.year}
                </Text>
                <Text style={styles.price}>
                  {item.price}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
  },
  heading: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#101C2C",
  },
  subtitle: {
    color: "#777",
    marginTop: 5,
    marginBottom: 20,
  },
  clearButton: {
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 18,
  },
  clearButtonText: {
    color: "#DC2626",
    fontWeight: "bold",
    fontSize: 15,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 15,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 170,
    backgroundColor: "#E2E8F0",
  },
  info: {
    padding: 15,
  },
  carName: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#101C2C",
  },
  year: {
    color: "#777",
    marginTop: 7,
  },
  price: {
    color: "#176B55",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 7,
  },
  empty: {
    textAlign: "center",
    color: "#777",
    marginTop: 50,
  },
});
