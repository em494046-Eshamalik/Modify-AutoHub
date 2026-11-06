
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, router } from "expo-router";
import { supabase } from "../lib/supabase";

type Car = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  status: string;
};

export default function MyListingsScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCars = async () => {
    const { data: { user } } = await supabase.auth.getUser();

console.log("Current User ID:", user?.id);
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setCars((data || []) as Car[]);
    }

    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadCars();
    }, [])
  );

  const deleteCar = (id: string) => {
    Alert.alert("Delete Listing", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase
            .from("cars")
            .delete()
            .eq("id", id);

          if (error) {
            Alert.alert("Error", error.message);
          } else {
            setCars((previous) => previous.filter((car) => car.id !== id));
            Alert.alert("Deleted", "Car listing removed.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>My Listings</Text>
      <Text style={styles.subtitle}>
        Manage your cars for sale
      </Text>

      <Pressable
        style={styles.addButton}
        onPress={() => router.push("/add-car")}
      >
        <Text style={styles.addButtonText}>+ Sell Your Car</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator size="large" color="#176B55" />
      ) : (
        <FlatList
          data={cars}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              You have not listed any cars yet.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.carCard}>
              <Text style={styles.carName}>
                {item.brand} {item.model}
              </Text>

              <Text style={styles.carInfo}>
                Year: {item.year}
              </Text>

              <Text style={styles.price}>
                PKR {Number(item.price).toLocaleString("en-PK")}
              </Text>

              <Text style={styles.status}>
                Status: {item.status}
              </Text>

              <Pressable
                style={styles.deleteButton}
                onPress={() => deleteCar(item.id)}
              >
                <Text style={styles.deleteText}>Delete Listing</Text>
              </Pressable>
            </View>
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#101C2C",
  },
  subtitle: {
    color: "#777",
    marginTop: 5,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#176B55",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 40,
  },
  carCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 15,
    marginBottom: 14,
  },
  carName: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#101C2C",
  },
  carInfo: {
    color: "#777",
    marginTop: 8,
  },
  price: {
    color: "#176B55",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 8,
  },
  status: {
    color: "#777",
    marginTop: 6,
  },
  deleteButton: {
    backgroundColor: "#FEE2E2",
    padding: 11,
    borderRadius: 9,
    alignItems: "center",
    marginTop: 14,
  },
  deleteText: {
    color: "#DC2626",
    fontWeight: "bold",
  },
});
