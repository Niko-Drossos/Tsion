import styles from "./page.module.css";

export default function Fieldset({ params }) {
  const { legend = {}, keys = [] } = params;
  const { style, title } = legend;

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legendText}>
        <span className={`${styles.key} ${style && styles[style]}`}>{title}</span>
      </legend>
      {keys && keys.map((keyObj, index) => {
        const [key, value] = Object.entries(keyObj)[0];
        return (
          <div key={index} id={key.toLowerCase().replace(/\s/g, "_")}>
            <span className={`key ${style && styles[style]}`}>{key}:</span> {value}
          </div>
        );
      })}
    </fieldset>
  );
}
