"use client"

import { useState, useEffect, useRef } from 'react'
import { DateTime } from 'luxon';
import flatpickr from 'flatpickr'
import AllFields from "@/components/AllFields/page"

import 'flatpickr/dist/themes/dark.css'
import styles from "./page.module.css";

import moonSigns from '@/data/moonSign.json'

export default function Tsion() {
  const desiredTimeZone = 'America/Phoenix'
  const [currentDate, setCurrentDate] = useState(DateTime.now().setZone(desiredTimeZone))
  const [startFlatpickrInstance, setStartFlatpickrInstance] = useState(null)
  const currentDatePicker = useRef()

  const earliestDate = new Date(moonSigns[0].date)
  const latestDate = new Date(moonSigns[moonSigns.length - 1].date)
  
  const formatDate = (date) => {
    // Convert date to ISO 8601 format (YYYY-MM-DD)
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const flatpickrCalendarOptions = {
    inline: true,
    minDate: formatDate(earliestDate),
    maxDate: formatDate(latestDate),
    dateFormat: 'm-d-Y',
    timeZone: 'America/Phoenix'
  }

  useEffect(() => {
    // Start time selector
    if (currentDatePicker.current) {
      if (startFlatpickrInstance) {
        currentDatePicker.current.value = new Date(currentDate).toLocaleDateString()
      }

      const fp = flatpickr(currentDatePicker.current, {
        ...flatpickrCalendarOptions,
        onChange: function(selectedDates, dateStr, instance) {
          handleDateChange(dateStr); // Call handleDateChange with the selected date string
        }
      })
      setStartFlatpickrInstance(fp)
    }
  }, [])

  const handleDateChange = (pickedDate) => {
    const newDate = new Date(pickedDate)
    const selectedDate = DateTime.fromISO(newDate.toISOString(), { zone: desiredTimeZone });
    setCurrentDate(selectedDate);
  };

  return (
    <main className={styles.main}>
      <p>
        {earliestDate.toLocaleDateString()} - {latestDate.toLocaleDateString()}
      </p>
      <input
        type="text"
        ref={currentDatePicker}
        placeholder="Select Date"
        className={styles.datePicker}
      />
      <AllFields params={{currentDate, setCurrentDate}} />
    </main>
  )
}