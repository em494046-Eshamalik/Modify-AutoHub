import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function DetailsScreen() {
  const router = useRouter();

  const { name, brand, year, price, image } =
    useLocalSearchParams<{
      name: string;
      brand: string;
      year: string;
      price: string;
      image: string;
    }>();
useEffect(() => {
  const saveRecentlyViewed = async () => {
    try {
      const stored = await AsyncStorage.getItem("recentlyViewed");
      const previousCars = stored ? JSON.parse(stored) : [];

      const currentCar = {
        name,
        brand,
        year,
        price,
        image,
        viewedAt: Date.now(),
      };

      const updatedCars = [
        currentCar,
        ...previousCars.filter(
          (car: any) =>
            !(car.name === name && car.brand === brand)
        ),
      ].slice(0, 20);

      await AsyncStorage.setItem(
        "recentlyViewed",
        JSON.stringify(updatedCars)
      );
    } catch (error) {
      console.log("Recently Viewed Error:", error);
    }
  };

  saveRecentlyViewed();
}, [name, brand, year, price, image]);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Image
          source={{ uri: image }}
          style={styles.carImage}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <Text style={styles.brand}>{brand}</Text>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.price}>{price}</Text>

          <Text style={styles.sectionTitle}>Car Information</Text>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Brand</Text>
            <Text style={styles.value}>{brand}</Text>

            <View style={styles.divider} />

            <Text style={styles.label}>Model Year</Text>
            <Text style={styles.value}>{year}</Text>

            <View style={styles.divider} />

            <Text style={styles.label}>Price</Text>
            <Text style={styles.value}>{price}</Text>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            Explore this {brand} {name}. Check the car details and
            specifications before making your decision.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  backButton: {
    padding: 18,
  },
  backText: {
    fontSize: 17,
    color: "#2563EB",
    fontWeight: "bold",
  },
  carImage: {
    width: "100%",
    height: 250,
    backgroundColor: "#E2E8F0",
  },
  content: {
    padding: 20,
  },
  brand: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "bold",
  },
  name: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#101C2C",
    marginTop: 5,
  },
  price: {
    fontSize: 23,
    color: "#2563EB",
    fontWeight: "bold",
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#101C2C",
    marginTop: 25,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
  },
  label: {
    color: "#8490A1",
    fontSize: 13,
  },
  value: {
    color: "#101C2C",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5EAF0",
    marginVertical: 13,
  },
  description: {
    color: "#64748B",
    fontSize: 15,
    lineHeight: 23,
  },
});
