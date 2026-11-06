import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Link, router } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing Fields", "Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      router.replace("/");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Text style={styles.logo}>A</Text>
      </View>

      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Login to continue to AutoHub</Text>

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
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Link href="/auth/signup" style={styles.link}>
          Sign Up
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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