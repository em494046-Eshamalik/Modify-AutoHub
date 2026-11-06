
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { supabase } from "../lib/supabase";

export default function AddCarScreen() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!brand || !model || !year || !price) {
      Alert.alert("Required", "Please fill all required fields.");
      return;
    }

    if (
      !Number.isInteger(Number(year)) ||
      Number(year) < 1900 ||
      Number(year) > new Date().getFullYear() + 1 ||
      !Number.isFinite(Number(price)) ||
      Number(price) <= 0 ||
      (mileage && (!Number.isFinite(Number(mileage)) || Number(mileage) < 0))
    ) {
      Alert.alert("Invalid Details", "Please check year, price and mileage.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      Alert.alert("Login Required", "Please login again.");
      return;
    }

    const { error } = await supabase.from("cars").insert({
      user_id: user.id,
      brand: brand.trim(),
      model: model.trim(),
      year: Number(year),
      price: Number(price),
      mileage: mileage ? Number(mileage) : 0,
      fuel_type: fuelType.trim() || null,
      transmission: transmission.trim() || null,
      description: description.trim() || null,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert("Success", "Your car has been listed!");
    router.replace("/profile");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Sell Your Car</Text>
        <Text style={styles.subtitle}>Enter your car details below</Text>

        <Text style={styles.label}>Brand *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Toyota"
          value={brand}
          onChangeText={setBrand}
        />

        <Text style={styles.label}>Model *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Corolla"
          value={model}
          onChangeText={setModel}
        />

        <Text style={styles.label}>Year *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 2022"
          keyboardType="numeric"
          value={year}
          onChangeText={setYear}
        />

        <Text style={styles.label}>Price (PKR) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 4500000"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.label}>Mileage (KM)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 25000"
          keyboardType="numeric"
          value={mileage}
          onChangeText={setMileage}
        />

        <Text style={styles.label}>Fuel Type</Text>
        <TextInput
          style={styles.input}
          placeholder="Petrol, Diesel, Hybrid"
          value={fuelType}
          onChangeText={setFuelType}
        />

        <Text style={styles.label}>Transmission</Text>
        <TextInput
          style={styles.input}
          placeholder="Automatic or Manual"
          value={transmission}
          onChangeText={setTransmission}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your car..."
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Pressable
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Submitting..." : "Submit Listing"}
          </Text>
        </Pressable>
      </ScrollView>
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
  label: {
    color: "#101C2C",
    fontWeight: "600",
    marginBottom: 7,
    marginTop: 14,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#176B55",
    padding: 17,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 30,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
