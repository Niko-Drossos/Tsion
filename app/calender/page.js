"use client"
import React, { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import styles from './page.module.css'

export default function Calender() {
  const [holidays, setHolidays] = useState([])
  const [selected, setSelected] = useState(null)
  const [dayData, setDayData] = useState({})

  useEffect(() => {
    fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&year=now&mf=on&leyning=off`)
      .then(res => res.json())
      .then(result => setHolidays(result.items))
  }, [])

  const findData = (date) => {
    setDayData(holidays.find(day => day.date == date))
  }

  const handleDateClick = (arg) => { // bind with an arrow function
    setSelected(arg)
    findData(arg.dateStr)
  }

  return (
    <div className={styles.calenderContainer}>
      <label id="calendars">Select a calendar</label>
      <select id="calendars">
        <option value="hebrew">Hebrew Calendar</option>
        <option value="enoch">Enoch Calendar</option>
        <option value="hebrew">Hebrew Calendar</option>
        <option value="hebrew">Hebrew Calendar</option>
      </select>
      <div className={styles.calender}>
        <FullCalendar
          plugins={[ dayGridPlugin, interactionPlugin ]}
          initialView="dayGridMonth"
          events={holidays}
          dateClick={handleDateClick}
          // style={{fontSize: 10}}
        />
      </div>
      { 
        selected && dayData &&
        <div className={styles.dayData}>
          <h2>Date: <span className={styles.data}>{selected.dateStr}</span></h2>
          <h3>Holiday: <span className={styles.data}>{dayData.title}</span></h3>
          <h4>Hebrew Date: <span className={styles.data}>{dayData.hdate}</span></h4>
          <h4>Hebrew: <span className={styles.data}>{dayData.hebrew}</span></h4>
          <h4>Description: <span className={styles.data}>{dayData.memo}</span></h4>
          <h4>  
            <a href={dayData.link} target="_blank">
              <span className={styles.info}>
               More Info
              </span>
            </a>
          </h4>
        </div>
      }
    </div>
  )
}