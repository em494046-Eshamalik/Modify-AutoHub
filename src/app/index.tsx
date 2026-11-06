
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cars } from "../constants/cars";
import type { Car } from "../constants/cars";
import { useFavorites } from "../context/FavoritesContext";

const brands = ["Toyota", "Honda", "BMW", "Suzuki", "KIA"];

export default function HomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { toggleFavorite, isFavorite } = useFavorites();

  const openBrand = (brand: string) => {
    router.push({
      pathname: "/explore",
      params: { brand },
    } as any);
  };

  const openCar = (car: Car) => {
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
    } as any);
  };

  const searchCars = () => {
    if (!search.trim()) {
      router.push("/explore" as any);
      return;
    }

    router.push({
      pathname: "/explore",
      params: { search: search.trim() },
    } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>AutoHub.</Text>
            <Text style={styles.location}>Find your dream car</Text>
          </View>

          <Text style={styles.locationIcon}>📍 Faisalabad</Text>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            placeholder="Search your dream car..."
            placeholderTextColor="#8A94A6"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            onSubmitEditing={searchCars}
          />

          <Pressable onPress={searchCars}>
            <Text style={styles.searchButton}>Go</Text>
          </Pressable>
        </View>

        {/* Popular Brands */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Brands</Text>

          <Pressable onPress={() => router.push("/explore" as any)}>
            <Text style={styles.seeAll}>See All</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.brandList}
        >
          {brands.map((brand) => (
            <Pressable
              key={brand}
              style={styles.brand}
              onPress={() => openBrand(brand)}
            >
              <Text style={styles.brandText}>{brand}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Featured Cars */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Cars</Text>

          <Pressable onPress={() => router.push("/explore" as any)}>
            <Text style={styles.seeAll}>View All</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.featuredCard}
          onPress={() => openCar(cars[0])}
        >
          <Image
           source={{ uri: cars?.[0]?.image }}
            style={styles.featuredImage}
          />

          <View style={styles.featuredContent}>
            <Text style={styles.featuredTag}>FEATURED</Text>
            <Text style={styles.carName}>Toyota Corolla Altis</Text>
            <Text style={styles.carPrice}>PKR 58 Lacs</Text>
            <Text style={styles.carInfo}>
              2022 • Automatic • Petrol
            </Text>
          </View>
        </Pressable>

        {/* Latest Cars */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest Cars</Text>

          <Pressable onPress={() => router.push("/explore" as any)}>
            <Text style={styles.seeAll}>See All</Text>
          </Pressable>
        </View>

        {cars.map((car) => (
          <View key={car.id} style={styles.carCard}>
            <Pressable
              style={styles.carMain}
              onPress={() => openCar(car)}
            >
              <Image
                source={{ uri: car.image }}
                style={styles.carImage}
              />

              <View style={styles.carDetails}>
                <Text style={styles.carName}>{car.name}</Text>

                <Text style={styles.carInfo}>
                  {car.year} • Available
                </Text>

                <Text style={styles.carPrice}>{car.price}</Text>
              </View>
            </Pressable>

            {/* Favorite Button */}
            <Pressable
              onPress={() => toggleFavorite(car)}
              style={styles.likeButton}
            >
              <Text style={styles.heart}>
                {isFavorite(car.id) ? "♥" : "♡"}
              </Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable onPress={() => router.push("/")}>
          <Text style={styles.activeTab}>⌂{"\n"}Home</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/explore" as any)}>
          <Text style={styles.tab}>⌕{"\n"}Explore</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/favorites" as any)}>
          <Text style={styles.tab}>♡{"\n"}Saved</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/profile" as any)}>
          <Text style={styles.tab}>◉{"\n"}Profile</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    backgroundColor: "#101C2C",
    padding: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
  },

  location: {
    color: "#B9C5D6",
    fontSize: 13,
    marginTop: 5,
  },

  locationIcon: {
    color: "#FFFFFF",
    fontSize: 12,
  },

  searchBox: {
    backgroundColor: "#FFFFFF",
    margin: 18,
    paddingHorizontal: 15,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    height: 50,
  },

  searchIcon: {
    fontSize: 24,
    color: "#247BFD",
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: "#101C2C",
  },

  searchButton: {
    color: "#247BFD",
    fontWeight: "bold",
    padding: 8,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#101C2C",
  },

  seeAll: {
    color: "#247BFD",
    fontWeight: "600",
  },

  brandList: {
    flexGrow: 0,
  },

  brand: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
    marginLeft: 12,
  },

  brandText: {
    color: "#101C2C",
    fontWeight: "600",
  },

  featuredCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 18,
    borderRadius: 16,
    overflow: "hidden",
  },

  featuredImage: {
    width: "100%",
    height: 175,
  },

  featuredContent: {
    padding: 15,
  },

  featuredTag: {
    color: "#247BFD",
    fontSize: 11,
    fontWeight: "bold",
  },

  carName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#101C2C",
    marginTop: 5,
  },

  carPrice: {
    color: "#247BFD",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 7,
  },

  carInfo: {
    color: "#7C8798",
    fontSize: 12,
    marginTop: 6,
  },

  carCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 18,
    marginBottom: 13,
    borderRadius: 14,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  carMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  carImage: {
    width: 105,
    height: 85,
    borderRadius: 10,
  },

  carDetails: {
    flex: 1,
    marginLeft: 12,
  },

  likeButton: {
    padding: 8,
  },

  heart: {
    fontSize: 25,
    color: "#247BFD",
  },

  bottomNav: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E8ECF2",
  },

  activeTab: {
    color: "#247BFD",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 12,
  },

  tab: {
    color: "#8A94A6",
    textAlign: "center",
    fontSize: 12,
  },
});
