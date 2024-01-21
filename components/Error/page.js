import styles from "./page.module.css";

export default function Error({ error }) {
  // const { error } = params;

  return (
    <div className={styles.container}>
      <h4>{error}</h4>
    </div>
  );
}
