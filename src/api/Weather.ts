import { AxiosResponse } from "axios";
import { ICity } from "../interfaces/Weather";
import http from "../utils/http";

const Weather = {
  getCityWeather: (cityName: string): Promise<AxiosResponse<ICity>> => {
    return http.get(`weather?q=${cityName}`);
  },

  getCityWeatherByCoord: (coord: { lat: number; lon: number }): Promise<AxiosResponse<ICity>> => {
    return http.get(`weather?lat=${coord.lat}&lon=${coord.lon}`);
  },
};
export default Weather;
