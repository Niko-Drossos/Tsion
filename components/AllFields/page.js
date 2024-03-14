"use client"
import { useEffect, useState } from "react" 
import { Moon } from "lunarphase-js";
import { DateTime } from 'luxon';
import { Sedra, HDate } from '@hebcal/core'

import Image from "next/image"

import angelData from "@/data/angels.json"
import bulkData from "@/data/data.json"

import ImageField from "../ImageField/page"
import Fieldset from "../Fieldset/page";

/* -- Manual import of data from https://moontracks.com/lunar_ingress.html -- */

import moonSigns from "@/data/moonSign.json"

/* --------------------------- Add dates manually --------------------------- */

const desiredTimeZone = 'America/Phoenix'

const equinoxDates = [
  { year: 2024, month: 3, day: 19 },
  { year: 2023, month: 3, day: 20 },
]

function pickEquinox(currentDate) { 
  const foundDate = equinoxDates.find(date => {
    const newDate = DateTime.fromObject(date).setZone(desiredTimeZone);
    return currentDate > newDate
  });
  // console.log(foundDate)
  return DateTime.fromObject(foundDate).setZone(desiredTimeZone);
}

/* ------------------------- For each Spring equinox ------------------------ */

const familySigns = [
  { name: "Sharon", sign: "Aquarius" },
  { name: "Malki", sign: "Gemini" },
  { name: "Dimetri", sign: "Aries" },
  { name: "Niko", sign: "Virgo" },
]

export default function AllFields({ params }) {
  const { currentDate } = params
  const [sunTimes, setSunTimes] = useState(null)
  const [lastEquinox, setLastEquinox] = useState(pickEquinox(currentDate))
  const [angelOfDay, setAngelOfDay] = useState(null)
  const [dayDifference, setDayDifference] = useState(calculateDifference(currentDate, lastEquinox))

  useEffect(() => {
    const newEquinox = pickEquinox(currentDate)
    const newDifference = calculateDifference(currentDate, newEquinox)

    setLastEquinox(pickEquinox(currentDate))
    setDayDifference(newDifference)
    setAngelOfDay(getAngel(newDifference))
  }, [currentDate])

  useEffect(() => {
    console.log(lastEquinox)
  }, [lastEquinox])

  // Get day of week number
  let currentDay = currentDate.weekday
  if (currentDay === 7) currentDay = 0
  

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`https://api.sunrisesunset.io/json?lat=33.359710&lng=-112.036873&date=${currentDate.toLocaleString()}`);
        
        // Check if the response status is ok
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Check if the response contains valid JSON data
        if (!data) {
          throw new Error('Invalid JSON data in the response');
        }

        setSunTimes(data);
        console.log(await gregorianToHebrewDate(currentDate.toLocaleString()))

      } catch (error) {
        console.error(error);
        // Handle errors, e.g., setSunTimes to a default value or show an error message
      }
    }

    fetchData();
  }, [currentDate]);
  
  // Destructured data
  const { chakra, planet, geometry, element, hebrewDay, principle } = bulkData[currentDay]

  // Moon info
  const moonSignData = getMoonSigns(currentDate)

  /* -------------------------------------------------------------------------- */
  /*                               FUNCTIONS START                              */
  /* -------------------------------------------------------------------------- */

  async function gregorianToHebrewDate(gregorianDate) {
    const parts = gregorianDate.split('/');
    const year = parts[2];
    const month = parts[0].padStart(2, '0'); // Ensure two digits for month
    const day = parts[1].padStart(2, '0'); // Ensure two digits for day
    
    // Format the date as "yyyy-mm-dd"
    const formattedDate = `${year}-${month}-${day}`;
    
    const response = await fetch(`https://www.hebcal.com/converter?cfg=json&date=${formattedDate}&g2h=1&strict=1`)
    const responseData = await response.json()

    const { hd, hm, hy } = responseData
    const hebrewDate = new HDate(hd, hm, hy)
    return hebrewDate
  }
    
  function calculateDifference(currentDate, lastEquinox) {
    // Calculate the difference in days
    let daysPassed = Math.floor(currentDate.diff(lastEquinox, "day").days)
    /* if (daysPassed === 0) {
      daysPassed = Math.floor(currentDate.diff(pickEquinox(currentDate), "day").days)
    }  */
    // if (daysPassed > 365) daysPassed -= 365
    console.log(daysPassed)
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
    let nextMoonSign, currentSign = null;
  
    // Find the next and second-to-last signs
    for (let i = 0; i < moonSigns.length; i++) {
      const phase = moonSigns[i];
      const phaseDate = new Date(phase.date);
  
      if (phaseDate > currentDate) {
        /* const tempDate = new Date(phaseDate.date) */
        nextMoonSign = { date: phaseDate.toLocaleString("en-us",  { timeZone: 'MST' }), sign: phase.sign };
        // Get the second-to-last moon sign without using an index
        const lastSignIndex = i - 1;
        if (lastSignIndex >= 0) {
          const currentMoonSign = moonSigns[lastSignIndex];
          const tempDate = new Date(currentMoonSign.date);
          currentSign = { date: tempDate.toLocaleString("en-us", { timeZone: 'MST' }), sign: currentMoonSign.sign };
        }
        break;
      }
    }

    let familyMember = { name: "Nobody" }
    const matchingPerson = familySigns.find(person => person.sign === currentSign.sign);
    if (matchingPerson) familyMember = matchingPerson

    let nextFamilyMember = { name: "Nobody" }
    const nextMatchingPerson = familySigns.find(person => person.sign === nextMoonSign.sign);
    if (nextMatchingPerson) nextFamilyMember = nextMatchingPerson

    // If currentDate is beyond the last known moon phase, return an appropriate message
    if (!nextMoonSign) return { currentSign, nextMoonSign: 'No upcoming moon phase found', familyMember: familyMember.name }

    return { 
      currentSign, 
      nextMoonSign, 
      familyMember: familyMember.name, 
      nextFamilyMember: nextFamilyMember.name
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
      { "Day": dayDifference},
      { "Day Of The Week": currentDate.toLocaleString({ weekday: "long" })},
      { "First Light": sunTimes?.results.first_light ?? "N/A" },
      { "Sunrise": sunTimes?.results.sunrise ?? "N/A" },
      { "Sunset": sunTimes?.results.sunset ?? "N/A" },
      { "Golden Hour": sunTimes?.results.golden_hour ?? "N/A" },
      { "Solar Noon": sunTimes?.results.solar_noon ?? "N/A" },
      { "Day Length": sunTimes?.results.day_length ?? "N/A" },
    ]
  }
  
  const hebrewDayData = {
    legend: { style: "hebrewDay", title: "Hebrew Day" },
    keys: [
      { "Hebrew Day": hebrewDay.day },
      { "Sephira": hebrewDay.sephira },
      { "Sunset Psalm": hebrewDay.psalm },
      { "Choir": hebrewDay.choir },
      { "Archangel": hebrewDay.archangel },
      { "Parsha": <a 
            href="https://hebcal.com/s/?us=sedrot-diaspora"
            target="_blank"
            style={{color: "#0033EE"}}
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
      { "Moon Entered": <span>{moonSign} - <Image 
      src={`/images/zodiac/${moonSign}.png`} 
      alt={moonSign}
      height={20}
      width={20}
      style={{ verticalAlign: 'middle' }} 
      />
      </span>},
      { "At": moonDate 
      },
      { "Family Sign": moonSignData.familyMember },
      { "": ""},
      { "Next Sign": <span>{nextSign} - <Image 
        src={`/images/zodiac/${nextSign}.png`} 
        alt={nextSign} 
        height={20}
        width={20}
        style={{ verticalAlign: 'middle' }} 
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
    legend: { style: "shape", title: "Geometry" },
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
      
      {/* Time data block */}
      { // Sometimes sunTimes is null :/
        sunTimes && 
        <Fieldset params={timeData}/>
      }
      

      {/* Hebrew Day */}
      <Fieldset params={hebrewDayData} />

      {/* Angel data block */}
      <Fieldset params={angelOfDayData} />

      {/* Moon Signs */}
      <Fieldset params={moonData} />

      {/* Chakra gate data */}
      <ImageField params={chakraGateData} />

      {/* Aura field */}
      <ImageField params={auraData} />

      {/* Planet for day */}
      <ImageField params={planetData} />

      {/* Geometry */}
      <ImageField params={geometryData} />

      {/* Law */}
      <Fieldset params={principleData} />
    </>
  )
}