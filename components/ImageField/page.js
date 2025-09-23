import Image from "next/image";
import styles from "./page.module.css";

const ImageField = ({ params }) => {
  const { legend={}, keys=[], image={} } = params;
  const { style, title } = legend;

  const firstKey = keys[0] && keys[0].Name;

  return (
    <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
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
          className={styles.img}
          width={0}
          height={0}
          sizes="(max-width: 600px) 100vw, 300px"
          style={{ width: '100%', height: 'auto', maxWidth: '100%' }}
        />
      </fieldset>
    </div>
  );
};

export default ImageField;

