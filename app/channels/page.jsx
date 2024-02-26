// import { useState } from 'react'
import styles from './page.module.css'



export default function Channels() {
  return (
    <div>
      <div className={styles.youtubeChannels}>
        <h1>Youtube</h1>
        <a href="https://www.youtube.com/@GodAMinuteGoJesusGo" target='_blank'>God a Minute</a>
        <a href="https://www.youtube.com/@TheCodesearcher" target='_blank'>Code Searcher</a>
        {/* <a href="" target='_blank'>God a Minute</a> */}
      </div>
      <br />
      <div className={styles.youtubeChannels}>
        <h1>Calendars</h1>
        <a href="https://torahcalendar.com/" target='_blank'>Torah Calendar</a>
        {/* <a href="" target='_blank'></a>
        <a href="" target='_blank'>God a Minute</a> */}
      </div>
    </div>
  )
}