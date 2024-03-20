"use client"

import { useContext } from "react";
import styles from "./darkModeToggle.module.css";
import { useTheme } from "@/components/context/ThemeContext";

const DarkModeToggle = () => {
  const { toggle, mode } = useTheme()
  console.log(mode);
  return (
    <div className={styles.container} onClick={toggle}>
      <div className={styles.icon}>🌙</div>
      <div className={styles.icon}>🔆</div>
      <div
        className={styles.ball}
        style={mode === "light" ? { left: "2px" } : { right: "2px" }}
      />
    </div>
  );
};

export default DarkModeToggle;
