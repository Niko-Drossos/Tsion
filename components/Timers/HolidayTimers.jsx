import React, { useState, useEffect } from 'react'
import styles from './page.module.css'
import { DateTime } from 'luxon'

export default function HolidayTimers() {
  const [nextHoliday, setNextHoliday] = useState(null)
  const [upcomingHolidays, setUpcomingHolidays] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        setLoading(true)
        const now = DateTime.local()
        const year = now.year
        
        // Fetch holidays for current year from Hebcal API
        const response = await fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&year=${year}&maj=on&min=off&mod=on&nx=off&s=on&b=18&M=on&c=off&molad=on`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (!data.items || !Array.isArray(data.items)) {
          throw new Error('Invalid data format received')
        }
        
        // Find all upcoming holidays
        const upcoming = data.items
          .filter(item => {
            if (!item.date || !item.title || item.category !== 'holiday') return false
            const holidayDate = DateTime.fromISO(item.date)
            return holidayDate.isValid && holidayDate > now
          })
          .sort((a, b) => {
            const dateA = DateTime.fromISO(a.date)
            const dateB = DateTime.fromISO(b.date)
            return dateA - dateB
          })
          .map(item => {
            const holidayDate = DateTime.fromISO(item.date)
            const diff = holidayDate.diff(now)
            const { weeks, days, hours } = diff.shiftTo('weeks', 'days', 'hours').toObject()
            
            return {
              name: item.title,
              date: item.date,
              weeks: Math.floor(weeks || 0),
              days: Math.floor(days || 0),
              hours: Math.floor(hours || 0),
              formattedDate: holidayDate.toLocaleString(DateTime.DATETIME_FULL),
              link: item.link || null,
              hebrew: item.hebrew || null,
              memo: item.memo || null
            }
          })
        
        setUpcomingHolidays(upcoming)
        
        if (upcoming.length > 0) {
          setNextHoliday(upcoming[0])
        } else {
          setNextHoliday(null)
        }
      } catch (err) {
        console.error('Error fetching holiday data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHolidays()
    
    // Update timer every hour
    const interval = setInterval(fetchHolidays, 60 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className={styles.container}>
        <h1>Holiday Timers</h1>
        <p>Loading holidays...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1>Holiday Timers</h1>
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()} className={styles.retryButton}>
          Retry
        </button>
      </div>
    )
  }

  if (!nextHoliday) {
    return (
      <div className={styles.container}>
        <h1>Holiday Timers</h1>
        <p>No upcoming holidays found</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1>Jewish Holiday Countdown</h1>
      
      {/* Main countdown for next holiday */}
      <div className={styles.holidayCard}>
        <h2>Next Holiday: {nextHoliday.name}</h2>
        <div className={styles.countdown}>
          <div className={styles.timeUnit}>
            <span className={styles.number}>{nextHoliday.weeks}</span>
            <span className={styles.label}>Weeks</span>
          </div>
          <div className={styles.timeUnit}>
            <span className={styles.number}>{nextHoliday.days}</span>
            <span className={styles.label}>Days</span>
          </div>
          <div className={styles.timeUnit}>
            <span className={styles.number}>{nextHoliday.hours}</span>
            <span className={styles.label}>Hours</span>
          </div>
        </div>
        <p className={styles.date}>
          {new Date(nextHoliday.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Table of upcoming holidays */}
      <div className={styles.holidaysTable}>
        <h3>Upcoming Holidays</h3>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Holiday</th>
                <th>Date</th>
                <th>Time Until</th>
                <th>Countdown</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {upcomingHolidays.map((holiday, index) => (
                <tr key={holiday.date} className={index === 0 ? styles.nextHoliday : ''}>
                  <td className={styles.holidayName}>
                    {holiday.link ? (
                      <a 
                        href={holiday.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.holidayLink}
                      >
                        <strong>{holiday.name}</strong>
                      </a>
                    ) : (
                      <strong>{holiday.name}</strong>
                    )}
                    {index === 0 && <span className={styles.nextBadge}>Next</span>}
                    {holiday.hebrew && (
                      <div className={styles.hebrewName}>{holiday.hebrew}</div>
                    )}
                  </td>
                  <td className={styles.holidayDate}>
                    {new Date(holiday.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className={styles.timeUntil}>
                    {holiday.weeks > 0 && `${holiday.weeks}w `}
                    {holiday.days > 0 && `${holiday.days}d `}
                    {holiday.hours > 0 && `${holiday.hours}h`}
                  </td>
                  <td className={styles.countdownBar}>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ 
                          width: `${Math.min(100, ((holiday.weeks * 7 * 24 + holiday.days * 24 + holiday.hours) / (365 * 24)) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </td>
                  {holiday.memo && (
                    <td className={styles.holidayMemo}>
                      <span className={styles.memoText} title={holiday.memo}>
                        {holiday.memo.length > 50 ? `${holiday.memo.substring(0, 50)}...` : holiday.memo}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
