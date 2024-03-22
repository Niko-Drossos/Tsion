import React, { useState, useEffect } from 'react'
import styles from './page.module.css'
import { DateTime } from 'luxon'

const holidayDates = [
  { name: "Purim", date: "2024-03-24" },
  { name: "Passover", date: "2024-04-22" },
  { name: "Shavuot", date: "2024-06-13" },
  { name: "Yom Teruah", date: "2024-10-04" },
  { name: "Yom Kippur", date: "2024-11-04" },
]

export default function HolidayTimers() {
  const [timers, setTimers] = useState([])

  useEffect(() => {
    // Function to update timers
    const updateTimers = () => {
      const now = DateTime.local()
      const updatedTimers = holidayDates.map(holiday => {
        const holidayDate = DateTime.fromISO(holiday.date)
        const diff = holidayDate.diff(now)
        const { weeks, days } = diff.shiftTo('weeks', 'days', 'hours').toObject()
        return { ...holiday, weeks, days }
      })
      setTimers(updatedTimers)
    }

    updateTimers()
  }, [])

  return (
    <div className={styles.container}>
      <h1>Holiday Timers</h1>
      <span className={styles.formatTitle}>Timer (Weeks - Days)</span>
      <table className={styles.table} border="1">
        <thead>
          <tr>
            <th>Holiday</th>
            <th>Timer</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {timers.map((timer, index) => (
            <tr className={styles.timer} key={timer.name}>
              <td><h3>{timer.name}</h3></td>
              <td>{timer.weeks} - {timer.days}</td>
              <td>{new Date(timer.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
