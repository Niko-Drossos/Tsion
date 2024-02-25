const mongoose = require('mongoose')
const eventsDB = require('@/connections/eventsDB')
const Schema = mongoose.Schema
require('dotenv').config()

let holidaySchema = new Schema({
  info: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: false
    },
    calendar: {
      type: String,
      enum: ["enoch", "hebrew"],
      required: true,
    },
  },
  start: { 
    type: Date, 
    required: true
  },
  end: { 
    type: Date, 
    required: true
  },
  totalHolidayMS: { // Add totalTime field to store the calculated value
    type: Number,
    required: false
  },
  images: {
    type: Array,
    required: false
  }
},{
  collection: 'Holidays',
  timestamps: true
})

// Define a pre-save hook to calculate and store the totalTime
holidaySchema.pre('save', function(next) {
  const timeDiff = this.end - this.start;
    // Create a new Date object with timeDiff milliseconds added to January 1, 1970
    const totalTimeDate = new Date(0);
    totalTimeDate.setMilliseconds(timeDiff);
    this.totalHolidayMS = totalTimeDate;
    next();
});

const Holiday = eventsDB.model('Holiday', holidaySchema)

eventsDB.once('open', () => {
    console.log('Connected to eventsDB for Holidays')
})

module.exports = Holiday