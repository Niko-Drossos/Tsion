"use client"
import React, { useEffect, useState } from 'react';
// import { UseGlobal } from '@/app/Context';
import styles from './page.module.css';

export default function CleanTimer() {
  const [ startTime, setStartTime ] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(null);
  const [totalResets, setTotalResets] = useState(null)

  async function fetchTimes() {
    const result = await fetch("/api/data/timer/get-times")
    const response = await result.json()
    const newDate = new Date(response.data[0].createdAt)
    setTotalResets(response.data.length)
    setStartTime(newDate)
  }

  async function resetTimer() {
    const description = prompt("Would you like a description for reset? (optional)")
    let urlString = "/api/data/timer/reset-timer"
    if (description) {
      urlString = urlString.concat(`?description=${description}`)
    }
    const result = await fetch(urlString)
    const response = await result.json()
    const newTime = new Date(response.data.createdAt)
    setTotalResets(totalResets + 1)
    setStartTime(newTime)
  };

  useEffect(() => {
    fetchTimes();
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = new Date();
      const difference = currentTime - startTime;
      setElapsedTime(difference);
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount

  }, [startTime]);

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    return `${hours}:${minutes % 60}:${seconds % 60}`;
  };

  return (
    <div className={styles.container}>
      <button onClick={resetTimer}>Reset Timer</button>
      <br />
      Start Time: { startTime ? startTime.toLocaleString() : "Loading..." }
      <br />
      Time elapsed: { elapsedTime ? formatTime(elapsedTime) : "Loading..."}
      <br />
      Total Resets: { totalResets ? totalResets : "Loading..."}
    </div>
  );
}