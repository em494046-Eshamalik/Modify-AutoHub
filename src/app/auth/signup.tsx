import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Link, router } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Missing Fields", "Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
        },
      });

      if (error) throw error;

      Alert.alert(
        "Account Created",
        "Please check your email and confirm your account before logging in.",
        [{ text: "OK", onPress: () => router.replace("/auth/login") }]
      );
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoCircle}>
        <Text style={styles.logo}>A</Text>
      </View>

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join AutoHub and explore your dream car</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Create password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Link href="/auth/login" style={styles.link}>
          Login
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#F5F7FA",
  },
  logoCircle: {
    width: 65,
    height: 65,
    borderRadius: 20,
    backgroundColor: "#176B55",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#172B4D",
    textAlign: "center",
  },
  subtitle: {
    color: "#718096",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },
  label: {
    color: "#172B4D",
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#DCE3EA",
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    fontSize: 15,
  },
  button: {
    height: 54,
    backgroundColor: "#176B55",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  footerText: {
    color: "#718096",
  },
  link: {
    color: "#176B55",
    fontWeight: "bold",
  },
});