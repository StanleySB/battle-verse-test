import React, { useState, FC, useEffect } from "react";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  getCityWeather,
  getCityWeatherByCoord,
  selectWeatherData,
  removeCity,
  addCity,
  addCurrCity,
  WeatherState,
  addUpdateTime,
} from "../../store/slices/weatherSlice";
import { getLocalWeatherData } from "../../utils/localstorage";
import styles from "./Weather.module.scss";
import { WeatherCityItem } from "./WeatherCityItem";
import { WeatherModal } from "./WeatherModal";

const Weather: FC = () => {
  const data = useAppSelector(selectWeatherData);
  const { cities, currCity, updateTime, addCityError } = data;
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateInterval, setUpdateInterval] = useState(0);
  const [localState, setLocalState] = useState<WeatherState | undefined>(undefined);

  useEffect(() => {
    setLocalState(getLocalWeatherData());
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setUpdateInterval(updateInterval + 1);
    }, 60000);
  }, [updateInterval]);

  useEffect(() => {
    if (navigator.geolocation && !currCity) {
      navigator.geolocation.getCurrentPosition((showPosition) =>
        dispatch(getCityWeatherByCoord({ lat: showPosition.coords.latitude, lon: showPosition.coords.longitude }))
      );
    }
  }, [dispatch, currCity]);

  useEffect(() => {
    if (localState) {
      if (localState.cities.size > 0) {
        Array.from(localState.cities.values()).map((city) => dispatch(addCity(city)));
      }
      dispatch(addUpdateTime(localState.updateTime));
      dispatch(addCurrCity(localState.currCity));
    }
  }, [dispatch, localState]);

  const getCity = (cityName: string) => {
    dispatch(getCityWeather(cityName));
  };

  const onCityRemove = (cityId: number) => {
    dispatch(removeCity(cityId));
  };

  return (
    <>
      {currCity && (
        <div className={styles.weather_currentCity}>
          <p className={styles.currentCity_title}>Watch weather in your current location</p>

          <WeatherCityItem city={currCity} onCityRemove={onCityRemove} onReload={getCity} updateTime={updateTime.get(currCity.id)} />
        </div>
      )}
      <div className={styles.weather_itemContainer}>
        {Array.from(cities.values()).map((city, index) => (
          <WeatherCityItem
            city={city}
            key={city.id + index + updateInterval}
            onCityRemove={onCityRemove}
            onReload={getCity}
            updateTime={updateTime.get(city.id)}
          />
        ))}
      </div>
      <button className={styles.weather_addButton} onClick={() => setIsModalOpen(true)}>
        +
      </button>
      <WeatherModal onCityAdd={getCity} open={isModalOpen} onClose={() => setIsModalOpen(false)} error={addCityError} />
    </>
  );
};

export default Weather;
