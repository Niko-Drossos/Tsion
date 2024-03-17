// import { useState } from 'react'
import styles from './page.module.css'



export default function Channels() {
  return (
    <div className={styles.container}>
      <h1>Creator Links</h1>
      <div className={styles.youtubeChannels}>
        <h2>Youtube</h2>
        <a className={styles.link} href="https://www.youtube.com/@GodAMinuteGoJesusGo" target='_blank'>God a Minute</a>
        <a className={styles.link} href="https://www.youtube.com/@TheCodesearcher" target='_blank'>Code Searcher</a>
        {/* <a href="" target='_blank'>God a Minute</a> */}
      </div>
      <br />
      <div className={styles.youtubeChannels}>
        <h2>Calendars</h2>
        <a className={styles.link} href="https://torahcalendar.com/" target='_blank'>Torah Calendar</a>
        {/* <a href="" target='_blank'></a>
        <a href="" target='_blank'>God a Minute</a> */}
      </div>
    </div>
  )
}