import axios from "axios";

export interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export const getPrayerTimes = async (
  city: string,
  country: string = "Turkey",
  method: number = 13
): Promise<PrayerTimes | null> => {
  try {
    const response = await axios.get(
      "https://api.aladhan.com/v1/timingsByCity",
      {
        params: {
          city,
          country,
          method,
        },
      }
    );

    if (response.data && response.data.data && response.data.data.timings) {
      return response.data.data.timings as PrayerTimes;
    } else {
      console.error("Geçersiz API yanıtı:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Şehir namaz vakitleri alınamadı:", error);
    return null;
  }
};
