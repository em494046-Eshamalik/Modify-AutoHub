import { useFocusEffect } from "expo-router";
import React, { useCallback,useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
    FlatList,
      Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFavorites } from "../context/FavoritesContext";
import { supabase } from "../lib/supabase";
export default function ProfileScreen() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const [userName, setUserName] = useState("AutoHub Member");
const [userEmail, setUserEmail] = useState("");

useEffect(() => {
  const loadProfile = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (!error && user) {
      setUserName(user.user_metadata?.full_name || "AutoHub Member");
      setUserEmail(user.email || "");
    }
  };

  loadProfile();
}, []);
const handleLogout = async () => {
  Alert.alert("Logout", "Are you sure you want to logout?", [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Logout",
      style: "destructive",
      onPress: async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
          Alert.alert("Logout Failed", error.message);
        }
      },
    },
  ]);
};

  const menuItems = [
    {
  icon: "🚗",
  title: "My Listings",
  subtitle: "Manage your car listings",
  route: "/my-listings",
},
    { icon: "❤️", title: "Saved Cars", subtitle: "View your favorite cars", route: "/favorites" },
    {
  icon: "🚘",
  title: "Sell Your Car",
  subtitle: "Add your car for sale",
  route: "/add-car",
},
   {
  icon: "🕘",
  title: "Recently Viewed",
  subtitle: "Cars you explored",
  route: "/recently-viewed",
},
    { icon: "⚙️", title: "Settings", subtitle: "Manage your preferences" },
    { icon: "❓", title: "Help & Support", subtitle: "We are here to help" },
  ];
 

    
const [listingCount, setListingCount] = useState(0);

useFocusEffect(
  useCallback(() => {
    const getListingCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;
      

      const { count, error } = await supabase
        .from("cars")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (error) {
        console.log("Listing Error:", error.message);
      } else {
        console.log("Listing Count:", count);
        setListingCount(count ?? 0);
      }
    };

    getListingCount();
  }, [])
) ;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>My Profile</Text>
        <Text style={styles.subtitle}>
          Manage your AutoHub experience
        </Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
  {userName.charAt(0).toUpperCase()}
</Text>
          </View>

       <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}> Welcome to your own  automotive  world!</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
          

          <View style={styles.introLine} />

          <Text style={styles.intro}>
            Discover your dream car, explore trusted car listings,
            and keep your favorite vehicles in one place.
            Your journey to finding the perfect car starts here!
          </Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{listingCount}</Text>
            <Text style={styles.statLabel}>My Listings</Text>
          </View>

          <Pressable
            style={styles.statCard}
            onPress={() => router.push("/favorites")}
          >
            <Text style={styles.statNumber}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Saved Cars</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Account</Text>

        {menuItems.map((item) => (
          <Pressable
            key={item.title}
            style={styles.menuItem}
            onPress={() => {
              if (item.route) {
                router.push(item.route as "/favorites");
              } else {
                Alert.alert(item.title, "This feature will be available soon.");
              }
            }}
          >
            <View style={styles.menuIcon}>
              <Text style={styles.iconText}>{item.icon}</Text>
            </View>

            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>
        ))}

        <View style={styles.footer}>
        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
          <Text style={styles.footerTitle}>AUTOHUB</Text>
          <Text style={styles.footerText}>
            Your trusted destination for finding the right car.
          </Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
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
    marginBottom: 22,
  },
  profileCard: {
    backgroundColor: "#101C2C",
    padding: 22,
    borderRadius: 20,
    alignItems: "center",
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: "#247BFD",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
  },
  userName: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "bold",
    marginTop: 12,
  },
  userEmail: {
    color: "#B8C7DD",
    marginTop: 5,
    textAlign: "center",
  width: "100%",
  },
  introLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#34445A",
    marginVertical: 18,
  },
  intro: {
    color: "#D5DFEC",
    textAlign: "center",
    lineHeight: 22,
  },
  stats: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#247BFD",
  },
  statLabel: {
    color: "#667085",
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#101C2C",
    marginTop: 28,
    marginBottom: 14,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 14,
    marginBottom: 11,
  },
  menuIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 20,
  },
  menuText: {
    flex: 1,
    marginLeft: 13,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#101C2C",
  },
  menuSubtitle: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
  arrow: {
    fontSize: 25,
    color: "#999",
  },
  footer: {
    alignItems: "center",
    marginTop: 25,
    marginBottom: 25,
  },
  footerTitle: {
    color: "#247BFD",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 3,
  },
  footerText: {
    color: "#777",
    textAlign: "center",
    marginTop: 7,
  },
  version: {
    color: "#AAA",
    marginTop: 10,
    fontSize: 12,
  },
  logoutButton: {
    backgroundColor: "#FEE2E2",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  logoutText: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "bold",
  },
});
