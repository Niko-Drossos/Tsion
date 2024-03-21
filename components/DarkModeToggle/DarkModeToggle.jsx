"use client"

import { useContext } from "react";
import styles from "./darkModeToggle.module.css";
import { useTheme } from "@/components/Context/ThemeContext";

export default function DarkModeToggle() {
  const { toggle, mode } = useTheme()

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