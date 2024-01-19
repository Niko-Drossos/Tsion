import Image from "next/image";
import styles from "./page.module.css";

const ImageField = ({ params }) => {
  const { legend={}, keys=[], image={} } = params;
  const { style, title } = legend;

  const firstKey = keys[0] && keys[0].Name;

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legendText}>
        <span className={`${styles.key} ${styles[style]}`}>{title}: </span>{firstKey}
      </legend>
      {keys.map((keyObj, index) => {
        const [key, value] = Object.entries(keyObj)[0];
        if (key === "Name") {
          return null; // Skip rendering
        }
        return (
          <div key={index}>
            <span className={`${styles.key} ${styles[style]}`}>{key}:</span> {value}
          </div>
        );
      })}
      <Image
        src={image.src}
        alt={image.alt}
        className={styles[style]}
        width={image.width}
        height={image.height}
      />
    </fieldset>
  );
};

export default ImageField;

