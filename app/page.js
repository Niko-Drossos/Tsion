"use client"
import styles from './page.module.css'
import HolidayTimers from '@/components/Timers/HolidayTimers'

export default function Home() {
  return (
    <div className={styles.container}>
      <HolidayTimers />
    </div>

  )
}





