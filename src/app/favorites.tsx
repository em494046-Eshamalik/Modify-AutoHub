
import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { useFavorites } from "../context/FavoritesContext";
import { useRouter } from "expo-router";

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useFavorites();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Saved Cars</Text>
      <Text style={styles.subtitle}>
        {favorites.length} cars saved
      </Text>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>♡</Text>
          <Text style={styles.emptyTitle}>No Saved Cars Yet</Text>
          <Text style={styles.emptyText}>
            Tap the heart on a car to save it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/details",
                    params: {
                      id: item.id,
                      name: item.name,
                      brand: item.brand,
                      year: String(item.year),
                      price: item.price,
                      image: item.image,
                    },
                  })
                }
              >
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.year}>{item.year}</Text>
                  <Text style={styles.price}>{item.price}</Text>
                </View>
              </Pressable>

              <Pressable
                style={styles.remove}
                onPress={() => toggleFavorite(item)}
              >
                <Text style={styles.heart}>♥</Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
    paddingTop: 55,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#101828",
  },
  subtitle: {
    color: "#667085",
    marginTop: 6,
    marginBottom: 20,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 65,
    color: "#1769FF",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
  },
  emptyText: {
    color: "#667085",
    marginTop: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: 180,
  },
  info: {
    padding: 15,
  },
  name: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#101828",
  },
  year: {
    color: "#667085",
    marginTop: 5,
  },
  price: {
    color: "#1769FF",
    fontWeight: "bold",
    fontSize: 17,
    marginTop: 8,
  },
  remove: {
    position: "absolute",
    right: 12,
    top: 12,
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  heart: {
    color: "#E53935",
    fontSize: 23,
  },
});
