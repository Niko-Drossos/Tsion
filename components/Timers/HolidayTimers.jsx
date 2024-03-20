import React, { useState, useEffect } from 'react';
import styles from './page.module.css'
import { DateTime } from 'luxon';

const holidayDates = [
  { name: "Purim", date: "2024-03-24" },
  { name: "Passover", date: "2024-04-22" },
  { name: "Shavuot", date: "2024-06-13" },
  { name: "Rosh Hashanah", date: "2024-10-04" },
  { name: "Yom Kippur", date: "2024-11-04" },
];

export default function HolidayTimers() {
  const [timers, setTimers] = useState([]);

  useEffect(() => {
    // Function to update timers
    const updateTimers = () => {
      const now = DateTime.local();
      const updatedTimers = holidayDates.map(holiday => {
        const holidayDate = DateTime.fromISO(holiday.date);
        const diff = holidayDate.diff(now);
        const { weeks, days, hours, minutes, seconds } = diff.shiftTo('weeks', 'days', 'hours', 'minutes', 'seconds').toObject();
        return { ...holiday, weeks, days, hours, minutes, seconds: seconds.toFixed(0) };
      });
      setTimers(updatedTimers);
    };

    // Initial call to update timers
    updateTimers();

    // Interval to update timers every second
    const intervalId = setInterval(updateTimers, 1000);

    // Cleanup function
    return () => clearInterval(intervalId);
  }, [])

  return (
    <div className={styles.container}>
      <h1>Holiday Timers</h1>
      <span className={styles.formatTitle}>(Weeks - Days - Hours : Minutes : Seconds)</span>
      <div>
        {timers.map(timer => (
          <div className={styles.timer} key={timer.name}>
            <h2>{timer.name}</h2> <p>{timer.weeks} - {timer.days} - {timer.hours} : {timer.minutes} : {timer.seconds}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
