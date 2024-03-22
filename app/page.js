"use client"
import styles from './page.module.css'
import HolidayTimers from '@/components/Timers/HolidayTimers'

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <h1 className={styles.title}>
          Tsion
        </h1>
      </div>
      <HolidayTimers />
    </div>

  )
}





