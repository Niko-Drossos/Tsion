import Image from 'next/image'
import styles from './page.module.css'
import Hero from "public/hero.png";
import Button from "@/components/Button/Button";

export default function Home() {
  return (
    <div className={styles.container}>
    <div className={styles.item}>
      <h1 className={styles.title}>
        Social Chat
      </h1>
      {/* <p className={styles.desc}>
        
      </p> */}
    </div>
    <div className={styles.item}>
    </div>
  </div>

  )
}





