import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { WeatherAPI } from "../../api";
import { ICity } from "../../interfaces/Weather";
import { RootState } from "../store";
import { enableMapSet } from "immer";
import { setLocalWeatherData } from "../../utils/localstorage";

enableMapSet();

export interface WeatherState {
  cities: Map<number, ICity>;
  updateTime: Map<number, Date>;
  currCity: ICity | null;
  isLoading: boolean;
  addCityError: boolean;
}

const initialState: WeatherState = {
  cities: new Map(),
  updateTime: new Map(),
  currCity: null,
  isLoading: false,
  addCityError: false,
};

export const getCityWeather = createAsyncThunk("weather/getCity", async (cityName: string) => {
  const response = await WeatherAPI.getCityWeather(cityName);
  return response.data;
});

export const getCityWeatherByCoord = createAsyncThunk("weather/getCityByCoord", async (coord: { lat: number; lon: number }) => {
  const response = await WeatherAPI.getCityWeatherByCoord(coord);
  return response.data;
});

export const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    removeCity: (state, prop: { payload: number }) => {
      state.cities.delete(prop.payload);
      const newCitiesMap: Map<number, ICity> = new Map();
      Array.from(state.cities.values()).map((city) => {
        if (city.id !== prop.payload) newCitiesMap.set(city.id, city);
        return null;
      });
      setLocalWeatherData({
        ...state,
        cities: newCitiesMap,
      });
    },
    addCity: (state, prop: { payload: ICity }) => {
      state.cities.set(prop.payload.id, prop.payload);
      setLocalWeatherData({
        ...state,
        cities: state.cities.set(prop.payload.id, prop.payload),
      });
    },
    addUpdateTime: (state, prop: { payload: Map<number, Date> }) => {
      state.updateTime = prop.payload;
      setLocalWeatherData({
        ...state,
        updateTime: prop.payload,
      });
    },
    addCurrCity: (state, prop: { payload: ICity | null }) => {
      state.currCity = prop.payload;
      setLocalWeatherData({
        ...state,
        currCity: prop.payload,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCityWeather.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCityWeather.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addCityError = false;
        state.cities.set(action.payload.id, action.payload);
        setLocalWeatherData({
          ...state,
          cities: state.cities.set(action.payload.id, action.payload),
          updateTime: state.updateTime.set(action.payload.id, new Date()),
        });
      })
      .addCase(getCityWeatherByCoord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addCityError = false;
        state.currCity = action.payload;
        setLocalWeatherData({
          ...state,
          currCity: action.payload,
          updateTime: state.updateTime.set((action.payload as ICity).id, new Date()),
        });
      })
      .addCase(getCityWeather.rejected, (state) => {
        state.isLoading = false;
        state.addCityError = true;
      });
  },
});

export const { removeCity, addCity, addCurrCity, addUpdateTime } = weatherSlice.actions;

export const selectWeatherData = (state: RootState) => state.weather;

export default weatherSlice.reducer;
