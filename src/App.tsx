import React from "react";
import { Weather } from "./modules";
import styles from "./App.module.scss";

function App() {
  return (
    <div className={styles.app}>
      <header>
        <h1>World Weather</h1>
      </header>
      <Weather />
    </div>
  );
}

export default App;
