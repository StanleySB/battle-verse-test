import moment from "moment";
import React, { FC } from "react";
import { Button } from "../../../components";
import { ICity } from "../../../interfaces/Weather";

import styles from "./WeatherCityItem.module.scss";

interface Props {
  city: ICity;
  onCityRemove: (cityId: number) => void;
  onReload: (cityName: string) => void;
  updateTime?: Date;
}

const WeatherCityItem: FC<Props> = ({ city, onCityRemove, onReload, updateTime }) => {
  const { sys, name, weather, main } = city;

  const weatherDescription = weather[0].description[0].toUpperCase() + weather[0].description.slice(1);

  return (
    <div className={styles.cityItem}>
      <div className={styles.cityItem_title}>{name}</div>
      <div className={styles.cityItem_subtitle}>{sys.country}</div>
      <div className={styles.cityItemInfo}>
        <div className={styles.item}>
          <div className={styles.item_description}>Weather</div>
          <div className={styles.item_value}>{weatherDescription}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.item_description}>Temperature</div>
          <div className={styles.item_value}>{main.temp} °C</div>
        </div>
        <div className={styles.item}>
          <div className={styles.item_description}>Humidity</div>
          <div className={styles.item_value}>{main.humidity} %</div>
        </div>
      </div>
      <div className={styles.cityItem_updateTime}>{moment(updateTime).fromNow()}</div>
      <div className={styles.buttonGroup}>
        <Button title="Remove" onClick={() => onCityRemove(city.id)} />
        <Button title="Reload" onClick={() => onReload(city.name)} />
      </div>
    </div>
  );
};

export default WeatherCityItem;
