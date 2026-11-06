
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { cars } from "../constants/cars";

const brands = ["All Cars", "Toyota", "Honda", "BMW", "Suzuki", "KIA"];

export default function ExploreScreen() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All Cars");
  const [sortOrder, setSortOrder] = useState("default");

  const filteredCars = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = cars.filter((car) => {
      const matchesSearch =
        car.name.toLowerCase().includes(query) ||
        car.brand.toLowerCase().includes(query) ||
        String(car.year).includes(query) ||
        car.price.toLowerCase().includes(query);

      const matchesBrand =
        selectedBrand === "All Cars" ||
        car.brand.toLowerCase() === selectedBrand.toLowerCase();

      return matchesSearch && matchesBrand;
    });

    if (sortOrder === "low") {
      result = [...result].sort(
        (a, b) =>
          Number(a.price.replace(/[^0-9]/g, "")) -
          Number(b.price.replace(/[^0-9]/g, ""))
      );
    }

    if (sortOrder === "high") {
      result = [...result].sort(
        (a, b) =>
          Number(b.price.replace(/[^0-9]/g, "")) -
          Number(a.price.replace(/[^0-9]/g, ""))
      );
    }

    return result;
  }, [search, selectedBrand, sortOrder]);

  const openCar = (car: (typeof cars)[number]) => {
  router.push({
  pathname: "/details",
  params: {
    id: car.id,
    name: car.name,
    brand: car.brand,
    year: String(car.year),
    price: car.price,
    image: car.image,
  },
});
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.heading}>Explore Cars</Text>
          <Text style={styles.subtitle}>
            Find your perfect car
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search BMW, Honda, Toyota..."
            placeholderTextColor="#8993A4"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            returnKeyType="search"
          />

          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Text style={styles.clearButton}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Brands */}
        <Text style={styles.sectionTitle}>Popular Brands</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.brandList}
        >
          {brands.map((brand) => (
            <Pressable
              key={brand}
              onPress={() => setSelectedBrand(brand)}
              style={[
                styles.brandButton,
                selectedBrand === brand && styles.activeBrand,
              ]}
            >
              <Text
                style={[
                  styles.brandText,
                  selectedBrand === brand && styles.activeBrandText,
                ]}
              >
                {brand}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Results heading */}
        <View style={styles.resultHeader}>
          <View>
            <Text style={styles.sectionTitle}>Available Cars</Text>
            <Text style={styles.resultCount}>
              {filteredCars.length} cars found
            </Text>
          </View>

          <View style={styles.sortButtons}>
            <Pressable
              onPress={() => setSortOrder("low")}
              style={[
                styles.sortButton,
                sortOrder === "low" && styles.activeSort,
              ]}
            >
              <Text style={styles.sortText}>Low Price</Text>
            </Pressable>

            <Pressable
              onPress={() => setSortOrder("high")}
              style={[
                styles.sortButton,
                sortOrder === "high" && styles.activeSort,
              ]}
            >
              <Text style={styles.sortText}>High Price</Text>
            </Pressable>
          </View>
        </View>

        {/* Car list */}
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <Pressable
              key={car.id}
              style={styles.carCard}
              onPress={() => openCar(car)}
            >
              <Image
                source={{ uri: car.image }}
                style={styles.carImage}
                resizeMode="cover"
              />

              <View style={styles.carInfo}>
                <Text style={styles.carName}>{car.name}</Text>

                <Text style={styles.carDetails}>
                  {car.brand} • {car.year}
                </Text>

                <Text style={styles.carPrice}>{car.price}</Text>

                <Text style={styles.viewDetails}>
                  View Details →
                </Text>
              </View>
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🚘</Text>
            <Text style={styles.emptyTitle}>No Cars Found</Text>
            <Text style={styles.emptyText}>
              Try another car name or select All Cars.
            </Text>

            <Pressable
              style={styles.resetButton}
              onPress={() => {
                setSearch("");
                setSelectedBrand("All Cars");
                setSortOrder("default");
              }}
            >
              <Text style={styles.resetText}>Reset Filters</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#101C2C",
  },
  subtitle: {
    fontSize: 14,
    color: "#778397",
    marginTop: 5,
  },
  searchBox: {
    height: 54,
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#E5EAF0",
  },
  searchIcon: {
    fontSize: 25,
    color: "#64748B",
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#101C2C",
  },
  clearButton: {
    color: "#2563EB",
    fontSize: 18,
    padding: 5,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#101C2C",
    marginHorizontal: 20,
    marginBottom: 12,
  },
  brandList: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 25,
  },
  brandButton: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  activeBrand: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  brandText: {
    color: "#475569",
    fontWeight: "600",
  },
  activeBrandText: {
    color: "#FFFFFF",
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingRight: 20,
  },
  resultCount: {
    color: "#8490A1",
    fontSize: 12,
    marginLeft: 20,
    marginTop: -5,
  },
  sortButtons: {
    flexDirection: "row",
    gap: 6,
  },
  sortButton: {
    paddingHorizontal: 9,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  activeSort: {
    backgroundColor: "#DBEAFE",
  },
  sortText: {
    fontSize: 10,
    color: "#2563EB",
    fontWeight: "600",
  },
  carCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
  },
  carImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#E2E8F0",
  },
  carInfo: {
    padding: 15,
  },
  carName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#101C2C",
  },
  carDetails: {
    color: "#8490A1",
    marginTop: 5,
    fontSize: 13,
  },
  carPrice: {
    color: "#2563EB",
    fontWeight: "bold",
    fontSize: 17,
    marginTop: 10,
  },
  viewDetails: {
    color: "#2563EB",
    fontWeight: "600",
    marginTop: 10,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 35,
  },
  emptyIcon: {
    fontSize: 45,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#101C2C",
  },
  emptyText: {
    color: "#8490A1",
    textAlign: "center",
    marginTop: 8,
  },
  resetButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 18,
  },
  resetText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
