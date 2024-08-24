"use client"

import { useState, useEffect, useRef } from 'react'
import { DateTime } from 'luxon';
import flatpickr from 'flatpickr'
import AllFields from "@/components/AllFields/page"

import 'flatpickr/dist/themes/dark.css'
import styles from "./page.module.css";

import moonSigns from '@/data/moonSign.json'
import timezones from '@/data/timezones.json'

export default function Tsion() {
  const [coordinates, setCoordinates] = useState(null)
  const [desiredTimeZone, setDesiredTimeZone] = useState('America/Phoenix')

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setDesiredTimeZone(timeZone)
      setCoordinates({ lat, lng })
    }, (error) => {
      console.error(error)
    })
  }, [])

  const [currentDate, setCurrentDate] = useState(DateTime.now().setZone(desiredTimeZone))
  const [startFlatpickrInstance, setStartFlatpickrInstance] = useState(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const currentDatePicker = useRef()

  const earliestDate = new Date(moonSigns[0].date)
  const latestDate = new Date(moonSigns[moonSigns.length - 1].date)
  
  const formatDate = (date) => {
    // Convert date to ISO 8601 format (YYYY-MM-DD)
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const flatpickrCalendarOptions = {
    inline: showDatePicker ? true : false,
    minDate: formatDate(earliestDate),
    maxDate: formatDate(latestDate),
    dateFormat: 'm-d-Y',
    timeZone: desiredTimeZone
  }

  const toggleDate = () => {
    setShowDatePicker(prev => !prev)
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
  }, [showDatePicker, currentDate])

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
      <button onClick={toggleDate} className={styles.toggleBtn}>Change time</button>
      <input
        type="text"
        ref={currentDatePicker}
        placeholder="Select Date"
        className={styles.datePicker}
      />
      <h2>{currentDate.toISODate()}</h2>
      { 
        desiredTimeZone && coordinates /* &&false  *///! Just for testing 
        ?
        <AllFields params={{currentDate, setCurrentDate, coordinates, setCoordinates, desiredTimeZone}} />
        :
        <div>
          <h3>Please enable location</h3>
          <h4>or set your time zone:</h4>
          <div>
            <select id="timezoneSelect">
              {
                Object.keys(timezones).map((key) => {
                  return <option key={key} value={timezones[key].timezone} id={key}>{timezones[key].timezone}</option>
                })
              }
            </select>
            <button onClick={() => {
              const timezone = document.getElementById('timezoneSelect')
              const key = timezone.options[timezone.selectedIndex].id
              setDesiredTimeZone(timezone.value)
              setCoordinates(timezones[key].coordinates)
            }}>
              Choose timezone
            </button>
          </div>
        </div>
      }
    </main>
  )
}