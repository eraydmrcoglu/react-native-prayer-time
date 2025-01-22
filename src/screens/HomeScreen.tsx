import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
  LayoutAnimation,
  TextInput,
  Alert,
} from "react-native";
import { getPrayerTimes, PrayerTimes } from "../api/prayerTimes";
import * as Location from "expo-location";
import PrayerTimesList from "../components/PrayerTimesList";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HomeScreen: React.FC<{
  isDarkMode: boolean;
  setDarkMode: (value: boolean) => void;
}> = ({ isDarkMode, setDarkMode }) => {
  const navigation = useNavigation();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<string>("Getting location...");
  const [searchCity, setSearchCity] = useState<string>("");

  useEffect(() => {
    const fetchLocationAndPrayerTimes = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocation("Location permission denied.");
          setLoading(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
          const { city, region } = reverseGeocode[0];
          setLocation(`${city || ""}, ${region || ""}`);
        }

        const timings = await getPrayerTimes(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );
        setPrayerTimes(timings);
      } catch (error) {
        console.error(error);
        setLocation("Location could not be obtained.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocationAndPrayerTimes();
  }, []);

  const fetchPrayerTimesForCurrentLocation = async () => {
    try {
      setLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission Required",
          "It is not possible to show prayer times without location information."
        );
        setLocation("Location permission denied.");
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      const timings = await getPrayerTimes(latitude, longitude);
      if (!timings) {
        throw new Error("Prayer times could not be obtained.");
      }

      setPrayerTimes(timings);
      setLocation("Current Location");
    } catch (error) {
      console.error("Error retrieving location:", error);
      Alert.alert(
        "Error",
        "Could not retrieve current location information. Please try again."
      );
      setLocation("Location could not be obtained.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrayerTimesForCity = async () => {
    if (!searchCity) {
      Alert.alert("Error", "Please enter a city name.");
      return;
    }

    try {
      setLoading(true);
      const timings = await getPrayerTimes(searchCity);
      if (!timings) {
        Alert.alert(
          "Error",
          "Prayer times could not be obtained for the entered city."
        );
        return;
      }

      setPrayerTimes(timings);
      setLocation(searchCity);
    } catch (error) {
      console.error("Failed to retrieve city data:", error);
      Alert.alert(
        "Error",
        "City data could not be retrieved. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    LayoutAnimation.configureNext({
      duration: 200,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
    setDarkMode(!isDarkMode);
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loaderContainer,
          { backgroundColor: isDarkMode ? "#000" : "#FFF" },
        ]}
      >
        <ActivityIndicator size="large" color={isDarkMode ? "#FFF" : "#000"} />
        <Text
          style={[styles.loadingText, { color: isDarkMode ? "#FFF" : "#000" }]}
        >
          Loading Data...
        </Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={
        isDarkMode
          ? require("../../assets/night.png")
          : require("../../assets/day.png")
      }
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        {/* City Search Area */}
        <View style={styles.searchContainer}>
          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: isDarkMode ? "#333" : "#EEE",
                color: isDarkMode ? "#FFF" : "#000",
              },
            ]}
            placeholder="Şehir Ara"
            placeholderTextColor={isDarkMode ? "#BBB" : "#888"}
            value={searchCity}
            onChangeText={setSearchCity}
          />
          <TouchableOpacity
            style={[
              styles.searchButton,
              {
                backgroundColor: isDarkMode ? "#FFF" : "#000",
              },
            ]}
            onPress={fetchPrayerTimesForCity}
          >
            <MaterialCommunityIcons
              name="magnify"
              size={24}
              color={isDarkMode ? "#000" : "#FFF"}
            />
          </TouchableOpacity>
        </View>
        {/* Day/Night Mode Button */}
        <TouchableOpacity
          style={[
            styles.themeButton,
            {
              backgroundColor: isDarkMode ? "#444" : "#EEE",
              borderColor: isDarkMode ? "#FFF" : "#000",
              borderWidth: 0.5,
            },
          ]}
          onPress={toggleTheme}
        >
          <MaterialCommunityIcons
            name={isDarkMode ? "white-balance-sunny" : "weather-night"}
            size={24}
            color={isDarkMode ? "#FFF" : "#000"}
          />
        </TouchableOpacity>
        {/* Location Display */}
        <View
          style={[
            styles.locationCard,
            {
              backgroundColor: isDarkMode ? "#333" : "#F9F9F9",
              borderColor: isDarkMode ? "#FFF" : "#000",
              borderWidth: 0.5,
            },
          ]}
        >
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="map-marker"
              size={30}
              color={isDarkMode ? "#FFF" : "#000"}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.locationText,
              { color: isDarkMode ? "#FFF" : "#000" },
            ]}
          >
            Konum: {location}
          </Text>
        </View>
        {/* Prayer Times */}
        {prayerTimes ? (
          <PrayerTimesList prayerTimes={prayerTimes} isDarkMode={isDarkMode} />
        ) : (
          <Text
            style={[styles.errorText, { color: isDarkMode ? "#FFF" : "#000" }]}
          >
            Prayer times could not be loaded. Try again.
          </Text>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
  },
  searchContainer: {
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  themeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 25,
    borderRadius: 10,
    marginBottom: 4,
    elevation: 3,
    width: "90%",
    alignSelf: "center",
    borderWidth: 0.5,
  },
  locationText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default HomeScreen;
