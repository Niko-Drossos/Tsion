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
  const [calendarValue, setCalendarValue] = useState("")

  useEffect(() => {
    fetch(`/api/events/request/calendar?calendar=${calendarValue}`)
      .then(res => res.json())
      .then(result => setHolidays(result.data))
  }, [calendarValue])

  const changeCalendar = async (event) => {
    setCalendarValue(event.target.value)

    console.log(calendarValue)

    await fetch(`/api/calendar?calendar=${calendarValue}`)
  }

  /* const findData = (selectedDate) => {
    const date = selectedDate
    setDayData(holidays.find(day => day.duration.start == date))
  } */

  const findData = async (selectedDate) => {
		const clickedDate = new Date(selectedDate);
		if (!holidays) return
		const currentSelectedEvents = holidays.filter(event => {
			const startDate = new Date(event.duration.start);
			const endDate = new Date(event.duration.end);
			// Extract the day parts of the dates
			const clickedDay = new Date(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate()).getTime();
			const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
			const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();
			// Check if the clickedDate is within the range of the festival's start and end dates
			if (startDay <= clickedDay && clickedDay <= endDay) return true

			return false;
		});
    console.log(currentSelectedEvents)

		// setDayData(currentSelectedEvents);
	};

  const handleDateClick = (arg) => { // bind with an arrow function
    setSelected(arg)
    findData(arg.dateStr)
  }

  return (
    <div className={styles.calenderContainer}>
      <label id="calendars">Select a calendar</label>
      <select id="calendars" onChange={event => changeCalendar(event)}>
        <option value="">All calendars</option>
        <option value="hebrew">Hebrew Calendar</option>
        <option value="enoch">Enoch Calendar</option>
        {/* <option value="hebrew">Hebrew Calendar</option>
        <option value="hebrew">Hebrew Calendar</option> */}
      </select>
      <div className={styles.calender}>
        <FullCalendar
          plugins={[ dayGridPlugin, interactionPlugin ]}
          initialView="dayGridMonth"
          events={holidays}
          dateClick={handleDateClick}
          eventColor="#5a6ace"
        />
      </div>
      { 
        selected && dayData &&
        <div className={styles.dayData}>
          <h2>Date: <span className={styles.data}>{selected.dateStr}</span></h2>
          <h3>Title: <span className={styles.data}>{dayData.info.title}</span></h3>
          <h4>Description: <span className={styles.data}>{dayData.info.description}</span></h4>
          {/* <h4>Hebrew: <span className={styles.data}>{dayData.hebrew}</span></h4> */}
          {/* <h4>Description: <span className={styles.data}>{dayData.memo}</span></h4> */}
          {/* <h4>  
            <a href={dayData.link} target="_blank">
              <span className={styles.info}>
               More Info
              </span>
            </a>
          </h4> */}
        </div>
      }
    </div>
  )
}