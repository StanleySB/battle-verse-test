import { ICity } from "../interfaces/Weather";
import { WeatherState } from "../store/slices/weatherSlice";

export const getLocalWeatherData = (): WeatherState | undefined => {
  const data = localStorage.getItem("weather");
  const citiesMap = new Map();
  const updateTimeMap = new Map();
  if (data) {
    JSON.parse(data).cities.map((cityArr: Array<number | ICity>) => citiesMap.set(cityArr[0], cityArr[1]));
    JSON.parse(data).updateTime.map((timeArr: Array<number | ICity>) => updateTimeMap.set(timeArr[0], timeArr[1]));
    return {
      ...JSON.parse(data),
      cities: citiesMap,
      updateTime: updateTimeMap,
    };
  }
};

export const setLocalWeatherData = (data: WeatherState) => {
  localStorage.setItem(
    "weather",
    JSON.stringify({
      ...data,
      cities: Array.from(data.cities.entries()),
      updateTime: Array.from(data.updateTime.entries()),
    })
  );
};
