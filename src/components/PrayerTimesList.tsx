import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  prayerTimes: { [key: string]: string };
  isDarkMode: boolean;
}

const translatedNames: { [key: string]: string } = {
  Fajr: "İmsak",
  Sunrise: "Güneş",
  Dhuhr: "Öğle",
  Asr: "İkindi",
  Maghrib: "Akşam",
  Isha: "Yatsı",
};

const icons: { [key: string]: string } = {
  Fajr: "moon-waxing-crescent",
  Sunrise: "weather-sunset-up",
  Dhuhr: "white-balance-sunny",
  Asr: "weather-partly-cloudy",
  Maghrib: "weather-sunset",
  Isha: "weather-night",
};

const PrayerTimesList: React.FC<Props> = ({ prayerTimes, isDarkMode }) => {
  const filteredTimes = Object.entries(prayerTimes).filter(([key]) =>
    Object.keys(translatedNames).includes(key)
  );

  return (
    <View style={styles.container}>
      {filteredTimes.map(([key, value]) => (
        <View
          key={key}
          style={[
            styles.card,
            {
              backgroundColor: isDarkMode ? "#333" : "#f5f5f5",
              borderColor: isDarkMode ? "#FFF" : "#000",
              borderWidth: 1,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={icons[key]}
            size={30}
            color={isDarkMode ? "#FFF" : "#000"}
            style={styles.icon}
          />
          <View style={styles.textContainer}>
            <Text
              style={[styles.title, { color: isDarkMode ? "#FFF" : "#000" }]}
            >
              {translatedNames[key]}
            </Text>
            <Text
              style={[styles.time, { color: isDarkMode ? "#CCC" : "#555" }]}
            >
              {value}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 40,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  time: {
    fontSize: 14,
    fontWeight: "400",
    marginTop: 2,
  },
});

export default PrayerTimesList;
