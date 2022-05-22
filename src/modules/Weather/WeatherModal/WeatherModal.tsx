import React, { useState, FC } from "react";
import { Button } from "../../../components";

import styles from "./WeatherModal.module.scss";

interface Props {
  onCityAdd: (cityName: string) => void;
  open: boolean;
  onClose: () => void;
  error: boolean;
}

const WeatherModal: FC<Props> = ({ onCityAdd, open, onClose, error }) => {
  const [cityName, setCityName] = useState("");

  const onAdd = () => {
    onCityAdd(cityName);
    onClose();
  };

  if (open) {
    return (
      <div className={styles.modal} onClick={onClose}>
        <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
          <div>
            <div className={styles.modal_title}>Choose a city</div>
            <div className={styles.modal_subtitle}>To find city start typing and pick one from the suggestions</div>
          </div>
          <div>
            <input data-error={error} className={styles.modal_input} placeholder="Search city" value={cityName} onChange={(e) => setCityName(e.target.value)} />
          </div>
          <div className={styles.buttonGroup}>
            <div>
              <Button title="Clear" onClick={() => setCityName("")} />
            </div>
            <div className={styles.buttonGroup_item}>
              <Button title="Cancel" onClick={onClose} />
              <Button title="Add" onClick={onAdd} disabled={cityName.length === 0} />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default WeatherModal;
