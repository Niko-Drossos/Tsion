"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { DateTime } from 'luxon';
import flatpickr from 'flatpickr'
import AllFields from "@/components/AllFields/page"

import 'flatpickr/dist/themes/dark.css'
import styles from "./page.module.css";

import moonSigns from '@/data/moonSign.json'
import timezones from '@/data/timezones.json'

export default function Tsion() {
  const [coordinates, setCoordinates] = useState(null)
  const [desiredTimeZone, setDesiredTimeZone] = useState(null)

  useEffect(() => {
    // Set timezone from browser without requesting geolocation
    if (typeof window !== 'undefined') {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timeZone) setDesiredTimeZone(timeZone)
        console.log(timeZone)
    }
  }, [])

  const [currentDate, setCurrentDate] = useState(DateTime.now().setZone(desiredTimeZone))
  const [startFlatpickrInstance, setStartFlatpickrInstance] = useState(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const currentDatePicker = useRef()

  const earliestDate = useMemo(() => new Date(moonSigns[0].date), [])
  const latestDate = useMemo(() => new Date(moonSigns[moonSigns.length - 1].date), [])
  
  const formatDate = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const flatpickrCalendarOptions = useMemo(() => ({
    inline: showDatePicker ? true : false,
    minDate: formatDate(earliestDate),
    maxDate: formatDate(latestDate),
    dateFormat: 'Y-m-d'
  }), [showDatePicker, earliestDate, latestDate])

  const toggleDate = () => {
    setShowDatePicker(prev => !prev)
  }

  const handleDateChange = useCallback((pickedDate) => {
    // pickedDate is a string like '2025-01-14'
    const selectedDate = DateTime.fromFormat(pickedDate, 'yyyy-MM-dd', { zone: desiredTimeZone })
      .set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
    setCurrentDate(selectedDate);
  }, [desiredTimeZone])

  useEffect(() => {
    if (showDatePicker) {
      // Create a new div element for flatpickr
      const calendarContainer = document.querySelector(`.${styles.flatpickrWrapper}`)
      
      if (calendarContainer && !startFlatpickrInstance) {
        const fp = flatpickr(calendarContainer, {
        ...flatpickrCalendarOptions,
        onChange: function(selectedDates, dateStr, instance) {
            handleDateChange(dateStr);
            // Hide the calendar after selection
            setShowDatePicker(false);
            setStartFlatpickrInstance(null);
        }
      })
      setStartFlatpickrInstance(fp)
      }
    } else {
      // Clean up flatpickr instance when hiding
      if (startFlatpickrInstance) {
        startFlatpickrInstance.destroy();
        setStartFlatpickrInstance(null);
      }
    }
  }, [showDatePicker, currentDate, flatpickrCalendarOptions, handleDateChange, startFlatpickrInstance])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (startFlatpickrInstance) {
        startFlatpickrInstance.destroy();
      }
    }
  }, [startFlatpickrInstance])

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>Tsion Calendar</h1>
        
        {/* Date Range Info Card */}
        <div className={styles.infoCard}>
          <h2>Available Date Range</h2>
          <div className={styles.dateRange}>
            <span className={styles.dateLabel}>From:</span>
            <span className={styles.dateValue}>{earliestDate.toLocaleDateString()}</span>
            <span className={styles.dateLabel}>To:</span>
            <span className={styles.dateValue}>{latestDate.toLocaleDateString()}</span>
          </div>
        </div>

        {/* Date Selection Card */}
        <div className={styles.selectionCard}>
          <h3>Select Date</h3>
          <div className={styles.dateControls}>
            <button 
              onClick={toggleDate} 
              className={styles.toggleBtn}
        ref={currentDatePicker}
            >
              {showDatePicker ? 'Hide Calendar' : 'Show Calendar'}
            </button>
          </div>
          {showDatePicker && (
            <div className={styles.calendarContainer}>
              <div className={styles.flatpickrWrapper}></div>
            </div>
          )}
          <div className={styles.currentDate}>
            <span className={styles.currentDateLabel}>Current Date:</span>
            <span className={styles.currentDateValue}>{currentDate.toISODate()}</span>
          </div>
        </div>

                {/* Location/Timezone Setup */}
        {!desiredTimeZone ? (
          <div className={styles.setupCard}>
            <h3>Timezone</h3>
            <p className={styles.setupText}>Select your timezone to proceed:</p>
            <div className={styles.timezoneSelector}>
              <select 
                id="timezoneSelect" 
                className={styles.timezoneSelect}
                onChange={(e) => {
                  const timezone = e.target
                  const key = timezone.options[timezone.selectedIndex].id
                  if (key && timezones[key]) {
                    setDesiredTimeZone(timezone.value)
                  }
                }}
              >
                <option value="">Select a timezone...</option>
                {Object.keys(timezones).map((key) => (
                  <option key={key} value={timezones[key].timezone} id={key}>
                    {timezones[key].timezone}
                  </option>
                ))}
              </select>
              <p className={styles.timezoneHint}>
                You can also allow location within the AllFields panel.
              </p>
            </div>
          </div>
        ) : null}

        {/* Main Content */}
        <div className={styles.contentCard}>
          <AllFields params={{currentDate, setCurrentDate, coordinates, setCoordinates, desiredTimeZone}} />
        </div>
      </div>
    </main>
  )
}