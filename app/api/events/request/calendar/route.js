import Holiday from "@/models/events/Holiday"
import { NextResponse } from "next/server"

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  // If calendar is defined use that, otherwise return all Events
  const calendar = searchParams.get('calendar') || "all"
  try {
    let result

    switch (calendar) {
      case "all":
        result = await Holiday.find()
        break

      case "hebrew":
        result = await fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&year=now&mf=on&leyning=off`)
        result = await result.json()
        break

      default: 
        result = await Holiday.find({
          "info.calendar": calendar
        });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully fetched all Events`,
      data: result
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: `An error occurred fetching Posts`,
      errorMessage: err.message,
      error: err
    })
  }
}
