import * as Location from "expo-location";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export const getUserLocation = async (): Promise<Coordinates | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error("Error fetching user location:", error);
    return null;
  }
};
