
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Car } from "../constants/cars";

type FavoritesContextType = {
  favorites: Car[];
  toggleFavorite: (car: Car) => void;
  isFavorite: (id: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Car[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const saved = await AsyncStorage.getItem("favorites");

        if (saved) {
          setFavorites(JSON.parse(saved));
        }
      } catch (error) {
        console.log("Favorites loading error:", error);
      } finally {
        setLoaded(true);
      }
    }

    loadFavorites();
  }, []);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem("favorites", JSON.stringify(favorites)).catch(
        (error) => console.log("Favorites saving error:", error)
      );
    }
  }, [favorites, loaded]);

  const toggleFavorite = (car: Car) => {
    setFavorites((previous) =>
      previous.some((item) => item.id === car.id)
        ? previous.filter((item) => item.id !== car.id)
        : [...previous, car]
    );
  };

  const isFavorite = (id: string) =>
    favorites.some((car) => car.id === id);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }

  return context;
}
