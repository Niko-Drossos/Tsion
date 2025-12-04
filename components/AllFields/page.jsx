"use client"
import { useEffect, useState } from "react" 
import { Moon } from "lunarphase-js";
import { DateTime } from 'luxon';
import { Sedra, HDate, gematriya } from '@hebcal/core'

import Image from "next/image"

import angelData from "@/data/angels.json"
import bulkData from "@/data/data.json"
import timezones from "@/data/timezones.json"

import ImageField from "../ImageField/page"
import Fieldset from "../Fieldset/page";
import styles from "./page.module.css";

/* -- Manual import of data from https://moontracks.com/lunar_ingress.html -- */

import moonSigns from "@/data/moonSign.json"

/* --------------------------- Add dates manually --------------------------- */

const equinoxDates = [
  { year: 2030, month: 3, day: 20 },
  { year: 2029, month: 3, day: 20 },
  { year: 2028, month: 3, day: 19 },
  { year: 2027, month: 3, day: 20 },
  { year: 2026, month: 3, day: 20 },
  { year: 2025, month: 3, day: 20 },
  { year: 2024, month: 3, day: 19 },
  { year: 2023, month: 3, day: 20 },
]

function pickEquinox(currentDate, tz) { 
  const foundDate = equinoxDates.find(date => {
    const equinoxDate = DateTime.fromObject(date).setZone(tz);
    return currentDate > equinoxDate
  });
  return DateTime.fromObject(foundDate).setZone(tz);
}

/* ------------------------- For each Spring equinox ------------------------ */

const familySigns = [
  { name: "Sharon", sign: "Aquarius" },
  { name: "Malki", sign: "Gemini" },
  { name: "Dimetri", sign: "Aries" },
  { name: "Niko", sign: "Virgo" },
  { name: "Stephan", sign: "Virgo" },
  { name: "Adriana", sign: "Pisces" },
]

export default function AllFields({ params }) {
  const { currentDate, coordinates, setCoordinates, desiredTimeZone } = params
  const [sunTimes, setSunTimes] = useState(null)
  const [effectiveTimeZone, setEffectiveTimeZone] = useState(null)
  const [lastEquinox, setLastEquinox] = useState(null)
  const [angelOfDay, setAngelOfDay] = useState(null)
  const [dayDifference, setDayDifference] = useState(null)
  const [hebrewDate, setHebrewDate] = useState(new HDate())
  const [isFetchingSun, setIsFetchingSun] = useState(false)

  // keep local timezone in sync if parent changes (only if not yet set locally)
  useEffect(() => {
    if (!effectiveTimeZone && desiredTimeZone) {
      setEffectiveTimeZone(desiredTimeZone)
    }
  }, [desiredTimeZone, effectiveTimeZone])

  useEffect(() => {
    // Do nothing until we have a user timezone
    if (!effectiveTimeZone) return

    // If we have a timezone but no coordinates, try to derive from timezones.json
    if ((!coordinates || !coordinates.lat || !coordinates.lng)) {
      const matchKey = Object.keys(timezones).find(k => timezones[k].timezone === effectiveTimeZone)
      if (matchKey) {
        const coords = timezones[matchKey].coordinates
        if (coords && typeof setCoordinates === 'function') {
          setCoordinates(coords)
        }
      }
    }

    const newEquinox = pickEquinox(currentDate, effectiveTimeZone)
    const newDifference = calculateDifference(currentDate, newEquinox)

    setLastEquinox(() => pickEquinox(currentDate, effectiveTimeZone))
    setDayDifference(newDifference)
    setAngelOfDay(() => getAngel(newDifference))

    // Require coordinates to fetch sun times
    if (!coordinates || coordinates.lat == null || coordinates.lng == null) {
      return
    }

    async function fetchData() {
      setIsFetchingSun(true)
      try {
        // Use coordinates with timezone
        const lat = coordinates.lat
        const lng = coordinates.lng
        const dateStr = DateTime.fromISO(currentDate.toISO(), { zone: effectiveTimeZone }).toISODate()
        const url = `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}&date=${encodeURIComponent(dateStr)}&timezone=${encodeURIComponent(effectiveTimeZone)}`

        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        if (!data || !data.results) {
          throw new Error('Invalid JSON data in the response')
        }

        setSunTimes(data)
        setHebrewDate(() => {
          const zoned = DateTime.fromISO(currentDate.toISO(), { zone: effectiveTimeZone }).toJSDate()
          return new HDate(zoned)
        })

      } catch (error) {
        console.error(error)
      } finally {
        setIsFetchingSun(false)
      }
    }

    fetchData()
  }, [currentDate, effectiveTimeZone, coordinates, setCoordinates])

  // Get day of week number
  let currentDay = currentDate.weekday
  if (currentDay === 7) currentDay = 0
  
  // Destructured data
  const { chakra, planet, geometry, element, hebrewDay, principle } = bulkData[currentDay]

  // Moon info
  const moonSignData = getMoonSigns(currentDate)

  /* -------------------------------------------------------------------------- */
  /*                               FUNCTIONS START                              */
  /* -------------------------------------------------------------------------- */

  // No longer needed
  /* function setLocation() {
    setIsLocating(true)
    setLocationFailed(false)
    const successCallback = (position) => {
      setCoordinates(() => ({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }))
      setLocationFailed(false)
      setIsLocating(false)
    }

    const errorCallback = (error) => {
      console.log(error)
      setLocationFailed(true)
      setIsLocating(false)
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options)
  } */

  function calculateDifference(currentDate, lastEquinox) {
    // Calculate the difference in days
    let daysPassed = Math.floor(currentDate.diff(lastEquinox, "day").days)
    /* if (daysPassed === 0) {
      daysPassed = Math.floor(currentDate.diff(pickEquinox(currentDate), "day").days)
    }  */
    // if (daysPassed > 365) daysPassed -= 365
    return daysPassed;
  }

  // Retrieve the angel that matches with the day of the year
  function getAngel(daysFromEquinox) {
    const angelNumber = Math.ceil(daysFromEquinox / 5)
    const angel = angelData.find((angel) => angel.angel_number == angelNumber)
    return angel
  }

  function getMoonSigns(currentDate) {
    // Sort moonSigns array based on date in ascending order
    moonSigns.sort((a, b) => new Date(a.date) - new Date(b.date));
    let nextMoonSign = null, currentSign = null;

    // Find the next and after-the-next signs
    for (let i = 0; i < moonSigns.length; i++) {
      const phase = moonSigns[i];
      const phaseDate = new Date(phase.date);

      if (phaseDate > currentDate) {
        const tz = effectiveTimeZone || 'UTC';
        nextMoonSign = { date: phaseDate.toLocaleString('en-us', { timeZone: tz }), sign: phase.sign };
        // Get the second-to-last moon sign without using an index
        const lastSignIndex = i - 1;
        if (lastSignIndex >= 0) {
          const currentMoonSign = moonSigns[lastSignIndex];
          const tempDate = new Date(currentMoonSign.date);
          currentSign = { date: tempDate.toLocaleString('en-us', { timeZone: tz }), sign: currentMoonSign.sign };
        }
        break;
      }
    }

    const matchingPeople = currentSign ? familySigns.filter(person => person.sign === currentSign.sign) : []
    const familyMemberNames = matchingPeople.length ? matchingPeople.map(person => person.name).join(', ') : 'Nobody'

    const nextMatchingPeople = nextMoonSign ? familySigns.filter(person => person.sign === nextMoonSign.sign) : []
    const nextFamilyMemberNames = nextMatchingPeople.length ? nextMatchingPeople.map(person => person.name).join(', ') : 'Nobody'

    // If currentDate is beyond the last known moon phase, return an appropriate message
    if (!nextMoonSign) return { currentSign, nextMoonSign: 'No upcoming moon phase found', familyMember: familyMemberNames }

    return {
      currentSign,
      nextMoonSign,
      familyMember: familyMemberNames,
      nextFamilyMember: nextFamilyMemberNames
    };
  }

  /* const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Use regex to filter data based on the search query
    const regex = new RegExp(query, "i");
    const filtered = bulkData.filter((item) => regex.test(item.name)); // Replace "name" with the key you want to search
    setFilteredData(filtered);
  }; */

/* -------------------------------------------------------------------------- */
/*                           START OF COMPONENT DATA                          */
/* -------------------------------------------------------------------------- */

  const timeData = {
    legend: { style: "time", title: "Time"},
    keys: [
      { "Day": dayDifference ?? "—"},
      { "Day Of The Week": effectiveTimeZone ? currentDate.toLocaleString({ weekday: "long" }) : "—"},
      { "First Light": sunTimes?.results.first_light ?? "N/A" },
      { "Sunrise": sunTimes?.results.sunrise ?? "N/A" },
      { "Sunset": sunTimes?.results.sunset ?? "N/A" },
      { "Golden Hour": sunTimes?.results.golden_hour ?? "N/A" },
      { "Solar Noon": sunTimes?.results.solar_noon ?? "N/A" },
      { "Day Length": sunTimes?.results.day_length ?? "N/A" },
      { "": "" },
      { "Timezone": effectiveTimeZone ?? sunTimes?.results.timezone ?? "N/A" },
    ]
  }
  
  const hebrewDayData = {
    legend: { style: "hebrewDay", title: "Hebrew Day" },
    keys: [
      /* ---- Hebrew Calendar Dates ---- */
      { "Year": `${hebrewDate.getFullYear()} - ${gematriya(hebrewDate.getFullYear())}` },
      { "Month": `${hebrewDate.getMonth()} - ${gematriya(hebrewDate.getMonth())}` },
      { "Day": `${hebrewDate.getDate()} - ${gematriya(hebrewDate.getDate())}` },
      { "": "" },
      /* ------------------------------- */
      { "Hebrew Day": hebrewDay.day },
      { "Sephira": hebrewDay.sephira },
      { "Sunset Psalm": hebrewDay.psalm },
      { "Choir": hebrewDay.choir },
      { "Archangel": hebrewDay.archangel },
      { "Parsha": <a 
            href="https://hebcal.com/s/?us=sedrot-diaspora"
            target="_blank"
            style={{color: "#0033EE", wordBreak: 'break-word'}}
          >
          Link to Parsha
        </a>
      },
      { "Hebrew Letter": `${hebrewDay.letter.name} - ${hebrewDay.letter.symbol}` }
    ],
  };

  const angelOfDayData = {
    legend: { style: "angel", title: "Angel" },
    keys: [
      { "Angel": angelOfDay?.angel },
      { "Meaning": angelOfDay?.meaning },
      { "Number": angelOfDay?.angel_number },
      { "Degrees": angelOfDay?.degrees },
      { "Purpose": angelOfDay?.purpose }
    ],
  };
    
  // Moon Data
  const moonSign = moonSignData.currentSign.sign
  const moonDate = moonSignData.currentSign.date 
  const nextSign = moonSignData.nextMoonSign.sign 
  const nextDate = moonSignData.nextMoonSign.date
  const moonData = {
    legend: { style: "moon", title: "Moon"},
    keys: [
      { "Phase": Moon.lunarPhaseEmoji() }, 
      { "Lunar Phase": Moon.lunarPhase() },
      { "": ""},
      { "Moon Entered": <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', maxWidth: '100%' }}>{moonSign} - <Image 
      src={`/images/zodiac/${moonSign}.png`} 
      alt={moonSign}
      height={20}
      width={20}
      style={{ verticalAlign: 'middle', filter: 'brightness(0) saturate(100%)' }} 
      />
      </span>},
      { "At": moonDate 
      },
      { "Family Sign": moonSignData.familyMember },
      { "": ""},
      { "Next Sign": <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', maxWidth: '100%' }}>{nextSign} - <Image 
        src={`/images/zodiac/${nextSign}.png`} 
        alt={nextSign} 
        height={20}
        width={20}
        style={{ verticalAlign: 'middle', filter: 'brightness(0) saturate(100%)' }} 
        />
        </span> },
      { "At": nextDate },
      { "Next Family Sign": moonSignData.nextFamilyMember }
    ]
  }
  
  const chakraGateData = {
    legend: { style: "chakra", title: `${chakra.number} Gate` },
    keys: [
      { "Name": chakra.name },
      { "Frequency": chakra.frequency }
    ],
    image: {
      src: `/images/chakras/${chakra.name}.png`,
      alt: "Gate photo for day",
      width: 300,
      height: 300,
    },
  };

  const auraData = {
    legend: { style: "aura", title: `Aura`},
    keys: [
      { "Name":  bulkData[currentDay].aura },
    ],
    image: {
      src: `/images/aura/${bulkData[currentDay].aura}.gif`,
      alt: bulkData[currentDay].aura,
      width: 300,
      height: 350,
    }
  }

  const planetData = {
    legend: { style: "planet", title: `${planet.number} Planet` },
    keys: [
      { "Name": planet.name },
      { "Planet Sign": <Image 
        src={`/images/planetSigns/${planet.name}.png`} 
        alt={planet.name} 
        height={20}
        width={20}
        style={{ verticalAlign: 'middle' }}
        />
      }
    ],
    image: {
      src: `/images/planets/${planet.name}.png`,
      alt: "Planet for day",
      width: 300,
      height: 300,
    },
  };

  const geometryData = {
    legend: { style: "shape", title: "Shape" },
    keys: [
      { "Name": geometry.name },
      { "Element": element.name },
      { "Faces": geometry.faces },  
      { "Edges": geometry.edges }, 
      { "Vertices": geometry.vertices },
      { "": "" },
      { "Interior Angle": `${geometry.interiorAngle}°`},
      { "Exterior Angle": `${geometry.exteriorAngle}°`},
      { "Total Angles": `${geometry.totalAngles}°`},
    ],
    image: {
      src: `/images/geometry/${geometry.name}.png`,
      alt: geometry.name,
      width: 300,
      height: 300,
    },
  }
  
  const principleData = {
    legend: { style: "principle", title: "Principle" },
    keys: [
      { "Name": principle.name },
      { "Details": principle.text }
    ],

  };
  

  return (
    <>
      {/* Search fields */}
      {/* <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearch}
      /> */}
      
      <div className={styles.grid}>
        {/* Time data block - skeleton until sunTimes is available */}
        {sunTimes && effectiveTimeZone ? (
          <Fieldset params={timeData}/>
        ) : (
          <div className={styles.skeleton}>
            <div className={styles.skeletonHeader}>
              <div className={styles.skeletonTitle} />
              {/* Status: show detection error or loading spinner */}
              {!effectiveTimeZone ? (
                <span className={styles.skeletonError}>
                  Couldn&apos;t detect your timezone. Please select it below.
                </span>
              ) : (
                isFetchingSun && (
                  <svg width="20" height="20" viewBox="0 0 50 50" aria-label="Loading">
                    <circle cx="25" cy="25" r="20" fill="none" stroke="#e5e7eb" strokeWidth="6"/>
                    <circle cx="25" cy="25" r="20" fill="none" stroke="#667eea" strokeWidth="6" strokeLinecap="round" strokeDasharray="31.4 125.6">
                      <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                )
              )}
            </div>
            <div className={styles.skeletonLine} style={{ width: '85%' }} />
            <div className={styles.skeletonLine} style={{ width: '70%' }} />
            <div className={styles.skeletonLine} style={{ width: '60%' }} />
            <div className={styles.skeletonLine} style={{ width: '75%' }} />
            <div className={styles.skeletonLine} style={{ width: '50%' }} />
            <div className={styles.skeletonControls}>
              <div className={styles.skeletonSelectRow}>
                <select
                  onChange={(e) => {
                    const key = e.target.options[e.target.selectedIndex].id
                    if (key && timezones[key]) {
                      setEffectiveTimeZone(timezones[key].timezone)
                      if (typeof setCoordinates === 'function' && timezones[key].coordinates) {
                        setCoordinates(timezones[key].coordinates)
                      }
                    }
                  }}
                  className={styles.skeletonSelect}
                >
                  <option value="">Select a timezone…</option>
                  {Object.keys(timezones).map((key) => (
                    <option key={key} id={key} value={timezones[key].timezone}>
                      {timezones[key].timezone}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.skeletonHintRow}>
                <span className={styles.skeletonHint}>
                  Choose a timezone to load sun times.
                </span>
                <button
                  onClick={() => {
                    alert(
`How to enable location permissions:\n\n` +
`Chrome: Click the lock icon → Site settings → Location → Allow, then refresh.\n\n` +
`Firefox: Click the shield icon → Permissions → Location → Allow, then refresh.\n\n` +
`Safari (macOS): Safari → Settings → Websites → Location → Allow.\n\n` +
`Edge: Click the lock icon → Permissions for this site → Location → Allow, then refresh.`
                    )
                  }}
                  className={styles.skeletonButton}
                >
                  How to enable
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Hebrew Day - loads immediately */}
        <Fieldset params={hebrewDayData} />

        {/* Angel data block - loads immediately */}
        <Fieldset params={angelOfDayData} />

        {/* Moon Signs - loads immediately */}
        <Fieldset params={moonData} />

        {/* Chakra gate data - loads immediately */}
        <ImageField params={chakraGateData} />

        {/* Aura field - loads immediately */}
        <ImageField params={auraData} />

        {/* Planet for day - loads immediately */}
        <ImageField params={planetData} />

        {/* Geometry - loads immediately */}
        <ImageField params={geometryData} />

        {/* Law - loads immediately */}
        <Fieldset params={principleData} />
      </div>
    </>
  )
}